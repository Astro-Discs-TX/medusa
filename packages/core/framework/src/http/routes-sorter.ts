import { MiddlewareVerb } from "./types"

/**
 * Route represents both the middleware/routes defined via the
 * "defineMiddlewares" method and the routes scanned from
 * the filesystem.
 */
type Route = {
  /**
   * The route path.
   */
  matcher: string

  /**
   * Function to handle the request
   */
  handler?: any

  /**
   * The HTTP methods this route is supposed to handle.
   */
  methods?: MiddlewareVerb | MiddlewareVerb[]
}

/**
 * RoutesBranch represents a branch in a tree of routes. All routes are
 * part of a node in a branch. Following is the list of nodes a branch
 * can have.
 *
 * - global: Global routes for the current branch
 * - regex: Routes using Regex patterns for the current branch
 * - wildcard: Routes using the wildcard character for the current branch
 * - params: Routes using params for the current branch
 * - static: Routes with no dynamic segments for the current branch
 *
 * We separate routes under these nodes, so that we can register them with
 * their priority. Priorities are as follows:
 *
 * - global
 * - regex
 * - wildcard
 * - static
 * - params
 */
type RoutesBranch<T extends Route> = {
  global: {
    routes: T[]
    children?: {
      [segment: string]: RoutesBranch<T>
    }
  }

  regex: {
    routes: T[]
    children?: {
      [segment: string]: RoutesBranch<T>
    }
  }

  wildcard: {
    routes: T[]
    children?: {
      [segment: string]: RoutesBranch<T>
    }
  }

  params: {
    routes: T[]
    children?: {
      [segment: string]: RoutesBranch<T>
    }
  }

  static: {
    routes: T[]
    children?: {
      [segment: string]: RoutesBranch<T>
    }
  }
}

/**
 * RoutesSorter exposes the API to sort middleware and inApp route handlers
 * by their priorities. The class converts an array of matchers to a tree
 * like structure and then sort them back to a flat array based upon the
 * priorities of different types of nodes.
 */
export class RoutesSorter<T extends Route> {
  /**
   * Input routes
   */
  #routesToProcess: T[]

  /**
   * Intermediate tree representation for sorting routes
   */
  #routesTree: {
    [segment: string]: RoutesBranch<T>
  } = {
    root: this.#createBranch(),
  }

  constructor(routes: T[]) {
    this.#routesToProcess = routes
  }

  /**
   * Creates an empty branch with known nodes
   */
  #createBranch(): RoutesBranch<T> {
    return {
      global: {
        routes: [],
      },
      regex: {
        routes: [],
      },
      wildcard: {
        routes: [],
      },
      static: {
        routes: [],
      },
      params: {
        routes: [],
      },
    }
  }

  /**
   * Processes the route by splitting it with a "/" and then placing
   * each segment into a specific node of a specific branch.
   *
   * The tree structure for a "/admin/products/:id" will look as follows
   *
   * ```
   * root: {
   *   static: {
   *     routes: [],
   *     children: {
   *       admin: {
   *         static: {
   *           routes: [],
   *           children: {
   *             products: {
   *               routes: [],
   *               params: {
   *                 routes: [{ matcher: '/admin/products/:id', ... }]
   *               }
   *             }
   *           }
   *         }
   *       }
   *     }
   *   }
   * }
   * ```
   */
  #processRoute(route: T) {
    const segments = route.matcher.split("/").filter((s) => s.length)
    let parent = this.#routesTree["root"]

    segments.forEach((segment, index) => {
      let bucket: keyof RoutesBranch<T> = "static"

      if (!route.methods) {
        bucket = "global"
      } else if (segment.startsWith("*")) {
        bucket = "wildcard"
      } else if (segment.startsWith(":")) {
        bucket = "params"
      } else if (/[\(\+\*\[\]\)\!]/.test(segment)) {
        bucket = "regex"
      }

      if (index + 1 === segments.length) {
        parent[bucket].routes.push(route)
        return
      }

      parent[bucket].children = parent[bucket].children ?? {}
      parent[bucket].children![segment] =
        parent[bucket].children![segment] ?? this.#createBranch()
      parent = parent[bucket].children![segment]
    })
  }

  /**
   * Returns an array of sorted routes for a given branch.
   */
  #sortBranch(routeBranch: { [segment: string]: RoutesBranch<T> }) {
    const branchRoutes = Object.keys(routeBranch).reduce<{
      global: T[]
      wildcard: T[]
      regex: T[]
      params: T[]
      static: T[]
    }>(
      (result, branchKey) => {
        const node = routeBranch[branchKey]

        result.global.push(...node.global.routes)
        if (node.global.children) {
          result.global.push(...this.#sortBranch(node.global.children))
        }

        result.wildcard.push(...node.wildcard.routes)
        if (node.wildcard.children) {
          result.wildcard.push(...this.#sortBranch(node.wildcard.children))
        }

        result.regex.push(...node.regex.routes)
        if (node.regex.children) {
          result.regex.push(...this.#sortBranch(node.regex.children))
        }

        result.static.push(...node.static.routes)
        if (node.static.children) {
          result.static.push(...this.#sortBranch(node.static.children))
        }

        result.params.push(...node.params.routes)
        if (node.params.children) {
          result.params.push(...this.#sortBranch(node.params.children))
        }

        return result
      },
      {
        global: [],
        wildcard: [],
        regex: [],
        params: [],
        static: [],
      }
    )

    /**
     * Concatenating routes as per their priority.
     */
    const routes: T[] = branchRoutes.global
      .concat(branchRoutes.wildcard)
      .concat(branchRoutes.regex)
      .concat(branchRoutes.static)
      .concat(branchRoutes.params)
    return routes
  }

  /**
   * Sort the input routes
   */
  sort() {
    this.#routesToProcess.map((route) => this.#processRoute(route))
    return this.#sortBranch(this.#routesTree)
  }
}
