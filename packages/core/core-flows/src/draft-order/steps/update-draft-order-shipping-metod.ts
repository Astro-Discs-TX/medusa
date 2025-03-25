import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { BigNumberInput, IOrderModuleService } from "@medusajs/types"

export const updateDraftOrderShippingMethodStepId =
  "update-draft-order-shipping-method"

interface UpdateDraftOrderShippingMethodStepInput {
  order_id: string
  shipping_method_id: string
  shipping_option_id?: string
  amount?: BigNumberInput
  metadata?: Record<string, unknown> | null
}

export const updateDraftOrderShippingMethodStep = createStep(
  updateDraftOrderShippingMethodStepId,
  async function (
    input: UpdateDraftOrderShippingMethodStepInput,
    { container }
  ) {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const allMethods = await service.listOrderShippingMethods(
      {
        order_id: input.order_id,
      },
      {
        select: ["id", "shipping_option_id", "amount"],
      }
    )

    console.log("allMethods", allMethods)

    const [beforeUpdate] = await service.listOrderShippingMethods(
      {
        id: input.shipping_method_id,
      },
      {
        take: 1,
        select: ["id", "shipping_option_id", "amount"],
      }
    )

    if (!beforeUpdate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A shipping method with id ${input.shipping_method_id} was not found`
      )
    }

    const updatedMethods = await service.updateOrderShippingMethods([
      {
        id: input.shipping_method_id,
        shipping_option_id: input.shipping_option_id,
        amount: input.amount,
      },
    ])

    console.log("updatedMethods", updatedMethods)

    return new StepResponse(void 0, beforeUpdate)
  },
  (input, { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (!input) {
      return
    }

    service.updateOrderShippingMethods([input])
  }
)
