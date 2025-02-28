import pathToRegexp from "path-to-regexp"
import { MiddlewareVerb } from "./types"

export class RoutesFinder<
  T extends { matcher: string; methods: MiddlewareVerb | MiddlewareVerb[] }
> {
  #routes: (Omit<T, "methods"> & {
    matchRegex: RegExp
    methods: string[]
  })[] = []
  constructor(routes?: T[]) {
    if (routes) {
      routes.forEach((route) => this.add(route))
    }
  }

  add(route: T) {
    this.#routes.push({
      ...route,
      methods: Array.isArray(route.methods) ? route.methods : [route.methods],
      matchRegex: pathToRegexp(route.matcher),
    })
  }

  find(url: string, method: string) {
    return this.#routes.find((route) => {
      if (Array.isArray(route.methods)) {
        return route.methods.includes(method) && route.matchRegex.test(url)
      }
      return route.methods === method && route.matchRegex.test(url)
    })
  }
}
