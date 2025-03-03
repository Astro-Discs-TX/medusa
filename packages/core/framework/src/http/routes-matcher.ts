import pathToRegExp from "path-to-regexp"
import { MiddlewareVerb } from "./types"

/**
 * Provides the API to match a URL and method at runtime
 * with the pre-defined route patterns.
 */
export class RoutesMatcher<
  T extends { matcher: string; method: MiddlewareVerb | MiddlewareVerb[] }
> {
  #routes: (T & { matchExpression: RegExp })[]
  constructor(routes: T[]) {}

  /**
   * Register a new route
   */
  add(route: T) {
    this.#routes.push({
      ...route,
      matchExpression: pathToRegExp(route.matcher),
    })
  }

  /**
   * Find a route that matches the given URI and the HTTP
   * method
   */
  find(uri: string, method: MiddlewareVerb) {
    return this.#routes.find((route) => {
      if (Array.isArray(route.method)) {
        return route.method.includes(method) && route.matchExpression.test(uri)
      }
      return route.method === method && route.matchExpression.test(uri)
    })
  }
}
