import { updateDraftOrderPromotionsWorkflow } from "@medusajs/core-flows"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/types"
import { AdminUpdateDraftOrderPromotionsType } from "../../validators"

export const POST = async (
  req: MedusaRequest<AdminUpdateDraftOrderPromotionsType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { promo_codes } = req.validatedBody

  console.log("id", id)
  console.log("promo_codes", promo_codes)

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  await updateDraftOrderPromotionsWorkflow(req.scope).run({
    input: {
      id,
      promo_codes,
    },
  })

  const result = await query.graph({
    entity: "order",
    filters: { id: req.params.id },
    fields: req.queryConfig.fields,
  })

  res.status(200).json({ order: result[0] as HttpTypes.AdminOrder })
}
