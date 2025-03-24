import { ChangeActionType } from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.PROMOTION_REMOVE, {
  operation({ action, currentOrder, options }) {},
  validate({ action }) {},
})
