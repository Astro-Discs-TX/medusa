import {
  ChangeActionType,
  OrderChangeStatus,
  PromotionActions,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
} from "@medusajs/framework/workflows-sdk"
import { OrderChangeDTO, OrderDTO, PromotionDTO } from "@medusajs/types"
import { useRemoteQueryStep } from "../../common"
import { deleteOrderChangesStep, deleteOrderShippingMethods } from "../../order"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { refreshDraftOrderAdjustmentsWorkflow } from "./refresh-draft-order-adjustments"

export const cancelDraftOrderEditWorkflowId = "cancel-draft-order-edit"

export interface CancelDraftOrderEditWorkflowInput {
  order_id: string
}

export const cancelDraftOrderEditWorkflow = createWorkflow(
  cancelDraftOrderEditWorkflowId,
  function (input: WorkflowData<CancelDraftOrderEditWorkflowInput>) {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["version", ...draftOrderFieldsForRefreshSteps],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const shippingToRemove = transform(
      { orderChange, input },
      ({ orderChange }) => {
        return (orderChange.actions ?? [])
          .filter((a) => a.action === ChangeActionType.SHIPPING_ADD)
          .map(({ id }) => id)
      }
    )

    const promotionsToRemove = transform(
      { orderChange, input },
      ({ orderChange }) => {
        return (orderChange.actions ?? [])
          .filter((a) => a.action === ChangeActionType.PROMOTION_ADD)
          .map(({ id }) => id)
      }
    )

    parallelize(
      deleteOrderChangesStep({ ids: [orderChange.id] }),
      deleteOrderShippingMethods({ ids: shippingToRemove })
    )

    when(promotionsToRemove, (ids) => {
      return !!ids?.length
    }).then(() => {
      const promotions: PromotionDTO[] = useRemoteQueryStep({
        entry_point: "promotions",
        fields: ["id", "code"],
        variables: { ids: promotionsToRemove },
        list: true,
      }).config({ name: "promotions-query" })

      const promoCodes = transform(
        { promotions },
        ({ promotions }) =>
          promotions.map(({ code }) => code).filter(Boolean) as string[]
      )

      refreshDraftOrderAdjustmentsWorkflow.runAsStep({
        input: {
          order: order,
          promo_codes: promoCodes,
          action: PromotionActions.REMOVE,
        },
      })
    })
  }
)
