import { memoize } from "lodash"
import logger from "@medusajs/cli/dist/reporter"
import { json, RequestHandler, text, urlencoded } from "express"

import type {
  MedusaRequest,
  MedusaResponse,
  ParserConfigArgs,
  BodyParserConfigRoute,
} from "../types"
import type { RoutesFinder } from "../routes-finder"

/**
 * Parsers to use for parsing the HTTP request body
 */
const parsers = {
  json: memoize(function jsonParserMiddleware(
    sizeLimit?: ParserConfigArgs["sizeLimit"],
    preserveRawBody?: ParserConfigArgs["preserveRawBody"]
  ) {
    return json({
      limit: sizeLimit,
      verify: preserveRawBody
        ? (req: MedusaRequest, res: MedusaResponse, buf: Buffer) => {
            req.rawBody = buf
          }
        : undefined,
    })
  }),
  text: memoize(function textParser(sizeLimit?: ParserConfigArgs["sizeLimit"]) {
    return text({
      limit: sizeLimit,
    })
  }),
  urlencoded: memoize(function urlencodedParserMiddleware(
    sizeLimit?: ParserConfigArgs["sizeLimit"]
  ) {
    return urlencoded({
      limit: sizeLimit,
      extended: true,
    })
  }),
}

/**
 * Creates the bodyparser middlewares stack that creates custom bodyparsers
 * during an HTTP request based upon the defined config. The bodyparser
 * instances are cached for re-use.
 */
export function createBodyParserMiddlewaresStack(
  routesFinder: RoutesFinder<BodyParserConfigRoute>
) {
  return ["json", "text", "urlencoded"].map((parser) => {
    return ((req, res, next) => {
      const matchingRoute = routesFinder.find(req.path, req.method)
      const parserMiddleware = parsers[parser]

      if (!matchingRoute) {
        return parserMiddleware()(req, res, next)
      }

      if (matchingRoute.config === false) {
        logger.debug(
          `skipping ${parser} bodyparser middleware ${req.method}${req.path}`
        )
        return next()
      }

      logger.debug(
        `using custom ${parser} bodyparser config ${req.method}${req.path}`
      )

      if (parser === "json") {
        return parserMiddleware(
          matchingRoute.config.sizeLimit,
          matchingRoute.config.preserveRawBody
        )(req, res, next)
      }

      return parserMiddleware()(req, res, next)
    }) as RequestHandler
  })
}
