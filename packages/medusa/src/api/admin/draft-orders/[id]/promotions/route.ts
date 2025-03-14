import { updateDraftOrderPromotionsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { PromotionActions } from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/types"
import { AdminUpdateDraftOrderPromotionsType } from "../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateDraftOrderPromotionsType>,
  res: MedusaResponse
) => {
  const { id } = req.params
  const { promo_code } = req.validatedBody

  const { result } = await updateDraftOrderPromotionsWorkflow(req.scope).run({
    input: {
      id,
      promo_code,
      user_id: req.auth_context.actor_id,
      action: PromotionActions.REPLACE,
    },
  })

  res
    .status(200)
    .json({ order_preview: result as unknown as HttpTypes.AdminOrderPreview })
}
