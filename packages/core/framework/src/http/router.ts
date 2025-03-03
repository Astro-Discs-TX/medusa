import logger from "@medusajs/cli/dist/reporter"
import corsMiddleware, { CorsOptions } from "cors"
import { parseCorsOrigins, promiseAll } from "@medusajs/utils"
import type { Express, RequestHandler, ErrorRequestHandler } from "express"
import type {
  MedusaRequest,
  MedusaResponse,
  RouteDescriptor,
  MiddlewareFunction,
  MedusaNextFunction,
  MiddlewareDescriptor,
  BodyParserConfigRoute,
} from "./types"

import { RoutesLoader } from "./routes-loader"
import { RoutesFinder } from "./routes-finder"
import { RoutesSorter } from "./routes-sorter"
import { wrapHandler } from "./utils/wrap-handler"
import { authenticate, AuthType } from "./middlewares"
import { errorHandler } from "./middlewares/error-handler"
import { RestrictedFields } from "./utils/restricted-fields"
import { MiddlewareFileLoader } from "./middleware-file-loader"
import { createBodyParserMiddlewaresStack } from "./middlewares/bodyparser"
import { ensurePublishableApiKeyMiddleware } from "./middlewares/ensure-publishable-api-key"
import { configManager } from "../config"

export class ApiLoader {
  /**
   * An express instance
   * @private
   */
  readonly #app: Express

  /**
   * Path from where to load the routes from
   * @private
   */
  readonly #sourceDirs: string[]

  constructor({
    app,
    sourceDir,
    baseRestrictedFields = [],
  }: {
    app: Express
    sourceDir: string | string[]
    baseRestrictedFields?: string[]
  }) {
    this.#app = app
    this.#sourceDirs = Array.isArray(sourceDir) ? sourceDir : [sourceDir]
    this.#assignRestrictedFields(baseRestrictedFields ?? [])
  }

  /**
   * Loads routes, middleware, bodyParserConfig routes, routes that have
   * opted out for Auth and CORS and the error handler.
   */
  async #loadHttpResources() {
    const routesLoader = new RoutesLoader()
    const middlewareLoader = new MiddlewareFileLoader()

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
      routesFinder: new RoutesFinder<RouteDescriptor>(),
      middlewares: middlewareLoader.getMiddlewares(),
      errorHandler: middlewareLoader.getErrorHandler() as
        | ErrorRequestHandler
        | undefined,
      bodyParserConfigRoutes: middlewareLoader.getBodyParserConfigRoutes(),
    }
  }

  /**
   * Registers a middleware or a route handler with Express
   */
  #registerExpressHandler(
    route: MiddlewareDescriptor | RouteDescriptor | RouteDescriptor
  ) {
    if ("isRoute" in route) {
      logger.debug(`registering route ${route.methods}:${route.matcher}`)
      this.#app[route.methods.toLowerCase()](
        route.matcher,
        wrapHandler(route.handler)
      )
      return
    }

    if (!route.methods) {
      logger.debug(`registering global middleware for ${route.matcher}`)
      this.#app.use(route.matcher, wrapHandler(route.handler))
      return
    }

    const methods = Array.isArray(route.methods)
      ? route.methods
      : [route.methods]
    methods.forEach((method) => {
      logger.debug(`registering route middleware ${method}:${route.matcher}`)
      this.#app[method.toLowerCase()](route.matcher, wrapHandler(route.handler))
    })
  }

  /**
   * Registers the middleware for restricted fields
   */
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
   * Assigns global cors middleware for a given prefix
   */
  #applyCorsMiddleware(
    routesFinder: RoutesFinder<RouteDescriptor>,
    route: string,
    toggleKey:
      | "shouldAppendAdminCors"
      | "shouldAppendAuthCors"
      | "shouldAppendStoreCors",
    corsOptions: CorsOptions
  ) {
    const cors = corsMiddleware(corsOptions)

    this.#app.use(route, (req, res, next) => {
      const path = `${route}${req.path}`
      const matchingRoute = routesFinder.find(path, req.method)
      if (matchingRoute && matchingRoute[toggleKey] === true) {
        return cors(req, res, next)
      }

      logger.debug(`Skipping CORS middleware ${req.method}:${path}`)
      return next()
    })
  }

  /**
   * Applies the route middleware on a route. Encapsulates the logic
   * needed to pass the middleware via the trace calls
   */
  #applyAuthMiddleware(
    routesFinder: RoutesFinder<RouteDescriptor>,
    route: string,
    actorType: string | string[],
    authType: AuthType | AuthType[],
    options?: { allowUnauthenticated?: boolean; allowUnregistered?: boolean }
  ) {
    logger.debug(`Registering auth middleware for prefix ${route}`)
    let authenticateMiddleware = authenticate(actorType, authType, options)

    this.#app.use(route, (req, res, next) => {
      const path = `${route}${req.path}`
      const matchingRoute = routesFinder.find(path, req.method)
      if (matchingRoute && matchingRoute.optedOutOfAuth) {
        logger.debug(`Skipping auth ${req.method}:${path}`)
        return next()
      }

      logger.debug(`Authenticating route ${req.method}:${path}`)
      return authenticateMiddleware(req, res, next)
    })
  }

  /**
   * Apply the most specific body parser middleware to the router
   */
  #applyBodyParserMiddleware(
    route: string,
    routesFinder: RoutesFinder<BodyParserConfigRoute>
  ): void {
    logger.debug(`Registering bodyparser middleware for prefix ${route}`)
    this.#app.use(route, createBodyParserMiddlewaresStack(routesFinder))
  }

  /**
   * Applies the middleware to authenticate the headers to contain
   * a `x-publishable-key` header
   */
  #applyStorePublishableKeyMiddleware(route: string | RegExp) {
    logger.debug(`Registering publishable key middleware for prefix ${route}`)
    let middleware = ensurePublishableApiKeyMiddleware as unknown as
      | RequestHandler
      | MiddlewareFunction

    this.#app.use(route, middleware as RequestHandler)
  }

  #createCorsOptions(origin: string): CorsOptions {
    return {
      origin: parseCorsOrigins(origin),
      credentials: true,
    }
  }

  async load() {
    const {
      errorHandler: sourceErrorHandler,
      middlewares,
      routes,
      routesFinder,
      bodyParserConfigRoutes,
    } = await this.#loadHttpResources()

    /**
     * Parse request body on all the requests and use the routes finder
     * to pick the best matching config for the given route.
     */
    const bodyParserRoutesFinder = new RoutesFinder<BodyParserConfigRoute>(
      new RoutesSorter(bodyParserConfigRoutes).sort([
        "static",
        "params",
        "regex",
        "wildcard",
        "global",
      ])
    )
    this.#applyBodyParserMiddleware("/", bodyParserRoutesFinder)

    /**
     * CORS and Auth setup for admin routes
     */
    this.#applyCorsMiddleware(
      routesFinder,
      "/admin",
      "shouldAppendAdminCors",
      this.#createCorsOptions(configManager.config.projectConfig.http.adminCors)
    )
    this.#applyAuthMiddleware(routesFinder, "/admin", "user", [
      "bearer",
      "session",
      "api-key",
    ])

    /**
     * Publishable key check, CORS and auth setup for store routes.
     */
    this.#applyStorePublishableKeyMiddleware("/store")
    this.#applyCorsMiddleware(
      routesFinder,
      "/store",
      "shouldAppendStoreCors",
      this.#createCorsOptions(configManager.config.projectConfig.http.storeCors)
    )
    this.#applyAuthMiddleware(
      routesFinder,
      "/store",
      "customer",
      ["bearer", "session"],
      {
        allowUnauthenticated: true,
      }
    )

    /**
     * Apply CORS middleware for "/auth" routes
     */
    this.#applyCorsMiddleware(
      routesFinder,
      "/auth",
      "shouldAppendAuthCors",
      this.#createCorsOptions(configManager.config.projectConfig.http.authCors)
    )

    const collectionToSort = ([] as (MiddlewareDescriptor | RouteDescriptor)[])
      .concat(middlewares)
      .concat(routes)

    const sortedRoutes = new RoutesSorter(collectionToSort).sort()
    sortedRoutes.forEach((route) => {
      if ("isRoute" in route) {
        routesFinder.add(route)
      }
      this.#registerExpressHandler(route)
    })

    /**
     * Registering error handler as the final handler
     */
    this.#app.use(sourceErrorHandler ?? errorHandler())
  }
}
