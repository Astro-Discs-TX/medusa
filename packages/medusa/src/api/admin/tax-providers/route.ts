import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetTaxProvidersParams>,
  res: MedusaResponse<HttpTypes.AdminTaxProviderListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { rows: tax_providers, metadata } = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "tax_providers",
      variables: {
        filters: req.filterableFields,
        ...req.queryConfig.pagination,
      },
      fields: req.queryConfig.fields,
    })
  )

  res.status(200).json({
    tax_providers,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
