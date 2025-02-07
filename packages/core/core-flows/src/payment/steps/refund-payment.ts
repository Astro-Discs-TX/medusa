import {
  BigNumberInput,
  IPaymentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to refund a payment.
 */
export type RefundPaymentStepInput = {
  /**
   * The ID of the payment to refund.
   */
  payment_id: string
  /**
   * The ID of the user that refunded the payment.
   */
  created_by?: string
  /**
   * The amount to refund. If not provided, the full refundable amount is refunded.
   */
  amount?: BigNumberInput
}

export const refundPaymentStepId = "refund-payment-step"
/**
 * This step refunds a payment.
 */
export const refundPaymentStep = createStep(
  refundPaymentStepId,
  async (input: RefundPaymentStepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const payment = await paymentModule.refundPayment(input)

    return new StepResponse(payment)
  },
  async (payment, { container }) => {
    if (!payment) {
      return
    }

    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    // Every time we refund a payment, we create a new refund. We want to delete the newset refund if we refund a payment again.
    const latestRefund = (payment.refunds ?? []).sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })[0]

    if (!latestRefund) {
      return
    }

    await paymentModule.deleteRefunds([latestRefund.id])
  }
)
