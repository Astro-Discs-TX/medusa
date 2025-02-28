import pathToRegExp from "path-to-regexp"
import { MiddlewareVerb } from "./types"

export class RoutesMatcher<
  T extends { matcher: string; method: MiddlewareVerb | MiddlewareVerb[] }
> {
  #routes: (T & { matchExpression: RegExp })[]
  constructor(routes: T[]) {}

  add(route: T) {
    this.#routes.push({
      ...route,
      matchExpression: pathToRegExp(route.matcher),
    })
  }

  find(uri: string, method: MiddlewareVerb) {
    return this.#routes.find((route) => {
      if (Array.isArray(route.method)) {
        return route.method.includes(method) && route.matchExpression.test(uri)
      }
      return route.method === method && route.matchExpression.test(uri)
    })
  }
}
