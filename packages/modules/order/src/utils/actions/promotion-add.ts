import { ChangeActionType } from "@medusajs/framework/utils"
import { OrderChangeProcessing } from "../calculate-order-change"

OrderChangeProcessing.registerActionType(ChangeActionType.PROMOTION_ADD, {
  operation({ action, currentOrder, options }) {},
  validate({ action }) {},
})
