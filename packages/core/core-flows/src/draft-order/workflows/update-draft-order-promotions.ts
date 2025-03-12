import { PromotionActions } from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CartDTO, OrderDTO } from "@medusajs/types"
import {
  getActionsToComputeFromPromotionsStep,
  getPromotionCodesToApply,
  prepareAdjustmentsFromPromotionActionsStep,
} from "../../cart"
import { useRemoteQueryStep } from "../../common"
import { validateDraftOrderStep } from "../steps"
import { createDraftOrderLineItemAdjustmentsStep } from "../steps/create-draft-order-line-item-adjustments"
import { createDraftOrderShippingMethodAdjustmentsStep } from "../steps/create-draft-order-shipping-method-adjustments"
import { removeDraftOrderLineItemAdjustmentsStep } from "../steps/remove-draft-order-line-item-adjustments"
import { removeDraftOrderShippingMethodAdjustmentsStep } from "../steps/remove-draft-order-shipping-method-adjustments"
import { updateDraftOrderPromotionsStep } from "../steps/update-draft-order-promotions"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"

export const updateDraftOrderPromotionsWorkflowId =
  "update-draft-order-promotions"

interface UpdateDraftOrderPromotionsWorkflowInput {
  id: string
  promo_codes: string[]
  action?: PromotionActions
}

export const updateDraftOrderPromotionsWorkflow = createWorkflow(
  updateDraftOrderPromotionsWorkflowId,
  function (input: WorkflowData<UpdateDraftOrderPromotionsWorkflowInput>) {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: {
        id: input.id,
      },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    validateDraftOrderStep({ order })

    const action = transform({ input }, (data) => {
      return data.input.action || PromotionActions.ADD
    })

    const promotionCodesToApply = getPromotionCodesToApply({
      cart: order,
      promo_codes: input.promo_codes,
      action: action as PromotionActions,
    })

    const actions = getActionsToComputeFromPromotionsStep({
      cart: order as CartDTO,
      promotionCodesToApply,
    })

    const {
      lineItemAdjustmentsToCreate,
      lineItemAdjustmentIdsToRemove,
      shippingMethodAdjustmentsToCreate,
      shippingMethodAdjustmentIdsToRemove,
      computedPromotionCodes,
    } = prepareAdjustmentsFromPromotionActionsStep({ actions })

    parallelize(
      removeDraftOrderLineItemAdjustmentsStep({
        lineItemAdjustmentIdsToRemove,
      }),
      removeDraftOrderShippingMethodAdjustmentsStep({
        shippingMethodAdjustmentIdsToRemove,
      }),
      createDraftOrderLineItemAdjustmentsStep({
        lineItemAdjustmentsToCreate,
        order_id: input.id,
      }),
      createDraftOrderShippingMethodAdjustmentsStep({
        shippingMethodAdjustmentsToCreate,
      }),
      updateDraftOrderPromotionsStep({
        id: input.id,
        promo_codes: computedPromotionCodes,
        action: action as PromotionActions,
      })
    )

    return new WorkflowResponse(input)
  }
)
