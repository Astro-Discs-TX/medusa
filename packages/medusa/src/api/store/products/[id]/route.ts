import {
  ContainerRegistrationKeys,
  isPresent,
  MedusaError,
} from "@medusajs/framework/utils"
import { MedusaResponse } from "@medusajs/framework/http"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "../../../utils/middlewares"
import {
  refetchProduct,
  RequestWithContext,
  wrapProductsWithTaxPrices,
} from "../helpers"
import { HttpTypes } from "@medusajs/framework/types"
import { featureFlagRouter } from "@medusajs/framework"
import IndexEngineFeatureFlag from "../../../../loaders/feature-flags/index-engine"

export const GET = async (
  req: RequestWithContext<HttpTypes.StoreProductParams>,
  res: MedusaResponse<HttpTypes.StoreProductResponse>
) => {
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  const filters: Record<string, any> = {
    id: req.params.id,
    ...req.filterableFields,
  }

  if (isPresent(req.pricingContext)) {
    filters["context"] = {
      "variants.calculated_price": { context: req.pricingContext },
    }
  }

  let product: any
  if (featureFlagRouter.isFeatureEnabled(IndexEngineFeatureFlag.key)) {
    if (
      isPresent(req.filterableFields.tags) ||
      isPresent(req.filterableFields.categories)
    ) {
      product = await refetchProduct(filters, req.scope, req.queryConfig.fields)
    } else {
      if (isPresent(filters.sales_channel_id)) {
        const salesChannelIds = filters.sales_channel_id

        filters["sales_channels"] ??= {}
        filters["sales_channels"]["id"] = salesChannelIds

        delete filters.sales_channel_id
      }

      const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
      const { data: products = [] } = await query.index({
        entity: "product",
        fields: req.queryConfig.fields,
        filters,
      })
      product = products[0]
    }
  } else {
    product = await refetchProduct(filters, req.scope, req.queryConfig.fields)
  }

  if (!product) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product with id: ${req.params.id} was not found`
    )
  }

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      product.variants || []
    )
  }

  await wrapProductsWithTaxPrices(req, [product])
  res.json({ product })
}
