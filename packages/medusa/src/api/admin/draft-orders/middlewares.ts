import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import * as QueryConfig from "./query-config"
import {
  AdminCreateDraftOrder,
  AdminGetDraftOrderParams,
  AdminGetDraftOrdersParams,
  AdminUpdateDraftOrder,
  AdminUpdateDraftOrderPromotions,
} from "./validators"

export const adminDraftOrderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrdersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders",
    middlewares: [
      validateAndTransformBody(AdminCreateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateDraftOrder),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/convert",
    middlewares: [
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/draft-orders/:id/promotions",
    middlewares: [
      validateAndTransformBody(AdminUpdateDraftOrderPromotions),
      validateAndTransformQuery(
        AdminGetDraftOrderParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
