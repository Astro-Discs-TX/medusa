import { createStep } from "@medusajs/framework/workflows-sdk"
import { OrderChangeDTO } from "@medusajs/types"
import { throwIfOrderChangeIsNotActive } from "../../order/utils/order-validation"

export const validateDraftOrderOrderChangeStepId =
  "validate-draft-order-order-change"

interface ValidateDraftOrderOrderChangeStepInput {
  orderChange: OrderChangeDTO
}

export const validateDraftOrderOrderChangeStep = createStep(
  validateDraftOrderOrderChangeStepId,
  async ({ orderChange }: ValidateDraftOrderOrderChangeStepInput) => {
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)
