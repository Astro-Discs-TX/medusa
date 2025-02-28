import { promiseAll } from "@medusajs/utils"
import {
  ErrorRequestHandler,
  type Express,
  json,
  RequestHandler,
  text,
  urlencoded,
} from "express"
// import { logger } from "../logger"
import {
  FileSystemRouteDescriptor,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  MiddlewareFunction,
  ScannedMiddlewareDescriptor,
  ScannedRouteDescriptor,
} from "./types"
import { RestrictedFields } from "./utils/restricted-fields"
import { RoutesLoader } from "./routes-loader"
import { MiddlewareFileLoader } from "./middleware-file-loader"
import { RoutesSorter } from "./routes-sorter"
import { errorHandler } from "./middlewares/error-handler"
import { wrapHandler } from "./utils/wrap-handler"
import { authenticate, AuthType } from "./middlewares"
import { ensurePublishableApiKeyMiddleware } from "./middlewares/ensure-publishable-api-key"
import { RoutesFinder } from "./routes-finder"

// const log = ({
//   activityId,
//   message,
// }: {
//   activityId?: string
//   message: string
// }) => {
//   if (activityId) {
//     logger.progress(activityId, message)
//     return
//   }

//   logger.debug(message)
// }

export class ApiLoader {
  /**
   * An express instance
   * @private
   */
  readonly #app: Express

  /**
   * An eventual activity id for information tracking
   * @private
   */
  readonly #activityId?: string

  /**
   * Path from where to load the routes from
   * @private
   */
  readonly #sourceDirs: string[]

  constructor({
    app,
    activityId,
    sourceDir,
    baseRestrictedFields = [],
  }: {
    app: Express
    activityId?: string
    sourceDir: string | string[]
    baseRestrictedFields?: string[]
  }) {
    this.#app = app
    this.#activityId = activityId
    this.#sourceDirs = Array.isArray(sourceDir) ? sourceDir : [sourceDir]
    this.#assignRestrictedFields(baseRestrictedFields ?? [])
  }

  /**
   * Loads routes, middleware, bodyParserConfig routes, routes that have
   * opted out for Auth and CORS and the error handler.
   */
  async #loadHttpResources() {
    const routesLoader = new RoutesLoader({ activityId: this.#activityId })
    const middlewareLoader = new MiddlewareFileLoader({
      activityId: this.#activityId,
    })

    await promiseAll(
      this.#sourceDirs.map(async (sourcePath) =>
        routesLoader.scanDir(sourcePath)
      )
    )

    await promiseAll(
      this.#sourceDirs.map(async (sourcePath) =>
        middlewareLoader.scanDir(sourcePath)
      )
    )

    const routes = routesLoader.getRoutes()
    return {
      routes: routes.list,
      routesFinder: new RoutesFinder<ScannedRouteDescriptor>(),
      middlewares: middlewareLoader.getMiddlewares(),
      errorHandler: middlewareLoader.getErrorHandler(),
      bodyParserConfigRoutes: middlewareLoader.getBodyParserConfigRoutes(),
    }
  }

  /**
   * Registers a middleware or a route handler with Express
   */
  #registerExpressHandler(
    route:
      | ScannedMiddlewareDescriptor
      | ScannedRouteDescriptor
      | FileSystemRouteDescriptor
  ) {
    if ("isRoute" in route) {
      // console.log(
      //   "route>>",
      //   route.matcher,
      //   route.methods,
      //   route.handler.toString()
      // )
      this.#app[route.methods.toLowerCase()](
        route.matcher,
        wrapHandler(route.handler)
      )
      return
    }

    if (!route.methods) {
      // console.log(
      //   "global middleware>>",
      //   route.matcher,
      //   route.handler.toString()
      // )
      this.#app.use(route.matcher, wrapHandler(route.handler))
      return
    }

    const methods = Array.isArray(route.methods)
      ? route.methods
      : [route.methods]
    methods.forEach((method) => {
      // console.log(
      //   "route middleware>>",
      //   route.matcher,
      //   route.methods,
      //   route.handler.toString()
      // )
      this.#app[method.toLowerCase()](route.matcher, wrapHandler(route.handler))
    })
  }

  #assignRestrictedFields(baseRestrictedFields: string[]) {
    this.#app.use("/store", ((
      req: MedusaRequest,
      _: MedusaResponse,
      next: MedusaNextFunction
    ) => {
      req.restrictedFields = new RestrictedFields()
      req.restrictedFields.add(baseRestrictedFields)
      next()
    }) as unknown as RequestHandler)

    this.#app.use("/admin", ((
      req: MedusaRequest,
      _: MedusaResponse,
      next: MedusaNextFunction
    ) => {
      req.restrictedFields = new RestrictedFields()
      next()
    }) as unknown as RequestHandler)
  }

  /**
   * Applies the route middleware on a route. Encapsulates the logic
   * needed to pass the middleware via the trace calls
   */
  #applyAuthMiddleware(
    routesFinder: RoutesFinder<ScannedRouteDescriptor>,
    route: string | RegExp,
    actorType: string | string[],
    authType: AuthType | AuthType[],
    options?: { allowUnauthenticated?: boolean; allowUnregistered?: boolean }
  ) {
    let authenticateMiddleware = authenticate(actorType, authType, options)

    this.#app.use(route, (req, res, next) => {
      const path = `${route}${req.path}`
      const matchingRoute = routesFinder.find(path, req.method)
      if (matchingRoute && matchingRoute.optedOutOfAuth) {
        console.log("skipping auth", path)
        return next()
      }
      console.log("authenticating", path)
      return authenticateMiddleware(req, res, next)
    })
  }

  /**
   * Apply the most specific body parser middleware to the router
   */
  #applyBodyParserMiddleware(path: string): void {
    this.#app.use(path, [
      json({
        verify: (req: MedusaRequest, res: MedusaResponse, buf: Buffer) => {
          req.rawBody = buf
        },
      }),
      text(),
      urlencoded({ extended: true }),
    ])
  }

  #applyStorePublishableKeyMiddleware(route: string | RegExp) {
    let middleware = ensurePublishableApiKeyMiddleware as unknown as
      | RequestHandler
      | MiddlewareFunction

    this.#app.use(route, middleware as RequestHandler)
  }

  async load() {
    this.#applyBodyParserMiddleware("/")

    const {
      errorHandler: sourceErrorHandler,
      middlewares,
      routes,
      routesFinder,
    } = await this.#loadHttpResources()

    this.#applyAuthMiddleware(routesFinder, "/admin", "user", [
      "bearer",
      "session",
      "api-key",
    ])
    this.#applyStorePublishableKeyMiddleware("/store")
    this.#applyAuthMiddleware(
      routesFinder,
      "/store",
      "customer",
      ["bearer", "session"],
      {
        allowUnauthenticated: true,
      }
    )

    const collectionToSort = (
      [] as (
        | ScannedMiddlewareDescriptor
        | ScannedRouteDescriptor
        | FileSystemRouteDescriptor
      )[]
    )
      .concat(middlewares)
      .concat(routes)

    const sorter = new RoutesSorter(collectionToSort)
    const sortedRoutes = sorter.sort()

    sortedRoutes.forEach((route) => {
      if ("isRoute" in route) {
        routesFinder.add(route)
      }
      this.#registerExpressHandler(route)
    })

    this.#app.use((sourceErrorHandler as ErrorRequestHandler) ?? errorHandler())
  }
}
