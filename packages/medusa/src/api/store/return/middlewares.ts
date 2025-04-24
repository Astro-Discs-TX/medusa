import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import * as QueryConfig from "./query-config"
import { ReturnsParams, StorePostReturnsReqSchema } from "./validators"

export const storeReturnRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["POST"],
    matcher: "/store/return",
    middlewares: [
      validateAndTransformBody(StorePostReturnsReqSchema),
      validateAndTransformQuery(
        ReturnsParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
