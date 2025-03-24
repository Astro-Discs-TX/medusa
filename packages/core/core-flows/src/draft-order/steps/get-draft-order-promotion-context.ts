import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { IOrderModuleService, OrderDTO } from "@medusajs/types"

interface GetDraftOrderPromotionContextStepInput {
  orderId: string
  order: OrderDTO
}

export const getDraftOrderPromotionContextStep = createStep(
  "get-draft-order-promotion-context",
  async (
    { orderId, order }: GetDraftOrderPromotionContextStepInput,
    { container }
  ) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const preview = await service.previewOrderChange(orderId)

    const orderWithPreviewItemsAndAShipping: OrderDTO = {
      ...order,
      items: preview.items,
      shipping_methods: preview.shipping_methods,
    }

    return new StepResponse(orderWithPreviewItemsAndAShipping)
  }
)
