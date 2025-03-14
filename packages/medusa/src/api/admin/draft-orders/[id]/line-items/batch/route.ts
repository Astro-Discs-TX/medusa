import { batchDraftOrderItemsWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminBatchDraftOrderLineItemsType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminBatchDraftOrderLineItemsType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const { add, update, remove } = req.body

  const result = await batchDraftOrderItemsWorkflow(req.scope).run({
    input: {
      id,
      user_id: req.auth_context.actor_id,
      add_items: add,
      update_items: update,
      remove_items: remove,
    },
  })

  res.json({ order: result.result })
}
