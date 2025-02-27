import { promiseAll } from "@medusajs/utils"
import { type Express, RequestHandler, Router } from "express"
import { logger } from "../logger"
import {
  FileSystemRouteDescriptor,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  ScannedMiddlewareDescriptor,
  ScannedRouteDescriptor,
} from "./types"
import { RestrictedFields } from "./utils/restricted-fields"
import { RoutesLoader } from "./routes-loader"
import { MiddlewareFileLoader } from "./middleware-file-loader"
import { RoutesSorter } from "./routes-sorter"
import { errorHandler } from "./middlewares/error-handler"

const log = ({
  activityId,
  message,
}: {
  activityId?: string
  message: string
}) => {
  if (activityId) {
    logger.progress(activityId, message)
    return
  }

  logger.debug(message)
}

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
  readonly #sourceDir: string | string[]

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
    this.#sourceDir = sourceDir
    this.#assignRestrictedFields(baseRestrictedFields ?? [])
  }

  #registerRoute(
    route:
      | ScannedMiddlewareDescriptor
      | ScannedRouteDescriptor
      | FileSystemRouteDescriptor
  ) {
    if ("isRoute" in route) {
      console.log("route>>", route.handler.toString())
      this.#app[route.method.toLowerCase()](route.matcher, route.handler)
      return
    }

    if (!route.method) {
      console.log("global middleware>>", route.handler.toString())
      this.#app.use(route.matcher, route.handler as unknown as RequestHandler)
      return
    }

    const methods = Array.isArray(route.method) ? route.method : [route.method]
    methods.forEach((method) => {
      console.log("route middleware>>", route.handler.toString())
      this.#app[method.toLowerCase()](route.matcher, route.handler)
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

  async load() {
    const normalizedSourcePath = Array.isArray(this.#sourceDir)
      ? this.#sourceDir
      : [this.#sourceDir]

    const routesLoader = new RoutesLoader({ activityId: this.#activityId })
    const middlewareLoader = new MiddlewareFileLoader({
      activityId: this.#activityId,
    })

    await promiseAll(
      normalizedSourcePath.map(async (sourcePath) => {
        return routesLoader.scanDir(sourcePath)
      })
    )
    await promiseAll(
      normalizedSourcePath.map(async (sourcePath) => {
        return middlewareLoader.scanDir(sourcePath)
      })
    )

    const collectionToSort = (
      [] as (
        | ScannedMiddlewareDescriptor
        | ScannedRouteDescriptor
        | FileSystemRouteDescriptor
      )[]
    )
      .concat(middlewareLoader.getMiddlewares())
      .concat(routesLoader.getRoutes())

    const sortedRoutes = new RoutesSorter(collectionToSort).sort()
    console.log(sortedRoutes)
    sortedRoutes.forEach((route) => this.#registerRoute(route))

    this.#app.use((req, res, next) => {
      try {
        next()
      } catch (e) {
        console.log("e", e)
        next(e)
      }
    })
    this.#app.use(errorHandler())
  }
}
