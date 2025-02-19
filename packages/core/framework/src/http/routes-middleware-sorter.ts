import { MiddlewareVerb } from "./types"

type Route = {
  matcher: string
  handler?: any
  isRoute?: boolean
  methods?: MiddlewareVerb[]
}

type RouteTreeNode = {
  global: {
    routes: Route[]
    children?: {
      [segment: string]: RouteTreeNode
    }
  }

  regex: {
    routes: Route[]
    children?: {
      [segment: string]: RouteTreeNode
    }
  }

  wildcard: {
    routes: Route[]
    children?: {
      [segment: string]: RouteTreeNode
    }
  }

  params: {
    routes: Route[]
    children?: {
      [segment: string]: RouteTreeNode
    }
  }

  static: {
    routes: Route[]
    children?: {
      [segment: string]: RouteTreeNode
    }
  }
}

export class RoutesSorter {
  #routesToProcess: Route[]
  #routesTree: {
    [segment: string]: RouteTreeNode
  } = {
    root: this.#createNode(),
  }

  constructor(routes: Route[]) {
    this.#routesToProcess = routes
    console.log("Processing routes", this.#routesToProcess)
  }

  #createNode(): RouteTreeNode {
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

  #processRoute(route: Route) {
    const segments = route.matcher.split("/").filter((s) => s.length)
    let parent = this.#routesTree["root"]

    segments.forEach((segment, index) => {
      let bucket: keyof RouteTreeNode = "static"

      if (!route.methods) {
        bucket = "global"
      } else if (segment.startsWith("*")) {
        bucket = "wildcard"
      } else if (segment.startsWith(":")) {
        bucket = "params"
      } else if (/[\(\+\[\]\)\!]/.test(segment)) {
        bucket = "regex"
      }

      if (index + 1 === segments.length) {
        parent[bucket].routes.push(route)
        return
      }

      parent[bucket].children = parent[bucket].children ?? {}
      parent[bucket].children![segment] =
        parent[bucket].children![segment] ?? this.#createNode()
      parent = parent[bucket].children![segment]
    })
  }

  #sortNode(routeBranch: { [segment: string]: RouteTreeNode }) {
    const nodeRoutes = Object.keys(routeBranch).reduce<{
      global: Route[]
      wildcard: Route[]
      regex: Route[]
      params: Route[]
      static: Route[]
    }>(
      (result, branchKey) => {
        const node = routeBranch[branchKey]

        result.global.push(...node.global.routes)
        if (node.global.children) {
          result.global.push(...this.#sortNode(node.global.children))
        }

        result.wildcard.push(...node.wildcard.routes)
        if (node.wildcard.children) {
          result.wildcard.push(...this.#sortNode(node.wildcard.children))
        }

        result.regex.push(...node.regex.routes)
        if (node.regex.children) {
          result.regex.push(...this.#sortNode(node.regex.children))
        }

        result.static.push(...node.static.routes)
        if (node.static.children) {
          result.static.push(...this.#sortNode(node.static.children))
        }

        result.params.push(...node.params.routes)
        if (node.params.children) {
          result.params.push(...this.#sortNode(node.params.children))
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

    const routes: Route[] = nodeRoutes.global
      .concat(nodeRoutes.wildcard)
      .concat(nodeRoutes.regex)
      .concat(nodeRoutes.static)
      .concat(nodeRoutes.params)
    return routes
  }

  process() {
    this.#routesToProcess.map((route) => {
      this.#processRoute(route)
    })

    return this.#sortNode(this.#routesTree)
  }
}
