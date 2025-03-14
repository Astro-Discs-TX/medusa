import {
  ChangeActionType,
  OrderChangeStatus,
  PromotionActions,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { OrderChangeDTO, OrderDTO, PromotionDTO } from "@medusajs/types"
import {
  getActionsToComputeFromPromotionsStep,
  getPromotionCodesToApply,
  prepareAdjustmentsFromPromotionActionsStep,
} from "../../cart"
import { useRemoteQueryStep } from "../../common"
import {
  createOrderChangeActionsWorkflow,
  previewOrderChangeStep,
} from "../../order"
import { validateDraftOrderStep } from "../steps"
import { createDraftOrderLineItemAdjustmentsStep } from "../steps/create-draft-order-line-item-adjustments"
import { createDraftOrderShippingMethodAdjustmentsStep } from "../steps/create-draft-order-shipping-method-adjustments"
import { removeDraftOrderLineItemAdjustmentsStep } from "../steps/remove-draft-order-line-item-adjustments"
import { removeDraftOrderShippingMethodAdjustmentsStep } from "../steps/remove-draft-order-shipping-method-adjustments"
import { updateDraftOrderPromotionsStep } from "../steps/update-draft-order-promotions"
import { validateDraftOrderOrderChangeStep } from "../steps/validate-draft-order-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"

export const updateDraftOrderPromotionsWorkflowId =
  "update-draft-order-promotions"

interface UpdateDraftOrderPromotionsWorkflowInput {
  id: string
  promo_code: string
  action?: PromotionActions.REPLACE | PromotionActions.REMOVE
  user_id: string
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

    const promotion: PromotionDTO = useRemoteQueryStep({
      entry_point: "promotion",
      fields: ["id", "code"],
      variables: { code: input.promo_code },
      list: false,
    }).config({ name: "promotion-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: {
        filters: {
          order_id: input.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderStep({ order })
    validateDraftOrderOrderChangeStep({ orderChange })

    const action = transform({ input }, (data) => {
      return data.input.action || PromotionActions.REPLACE
    })

    const promotionCodesToApply = getPromotionCodesToApply({
      cart: order,
      promo_codes: [input.promo_code],
      action: action as PromotionActions,
    })

    const actions = getActionsToComputeFromPromotionsStep({
      cart: order as any,
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

    const orderChangeActionInput = transform(
      { order, orderChange, promotion, action },
      ({ order, orderChange, promotion, action }) => {
        return {
          action:
            action === PromotionActions.REPLACE
              ? ChangeActionType.PROMOTION_REPLACE
              : ChangeActionType.PROMOTION_REMOVE,
          reference: "order_promotion",
          order_change_id: orderChange.id,
          reference_id: promotion.id,
          order_id: order.id,
        }
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput],
    })

    return new WorkflowResponse(previewOrderChangeStep(input.id))
  }
)
