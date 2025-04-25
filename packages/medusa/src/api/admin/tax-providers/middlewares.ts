import * as QueryConfig from "./query-config"

import { AdminGetTaxProvidersParams } from "./validators"

import { validateAndTransformQuery } from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"

export const adminTaxProviderRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "GET",
    matcher: "/admin/tax-providers",
    middlewares: [
      validateAndTransformQuery(
        AdminGetTaxProvidersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
]
