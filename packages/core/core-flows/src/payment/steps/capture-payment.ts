import {
  BigNumberInput,
  IPaymentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to capture a payment.
 */
export type CapturePaymentStepInput = {
  /**
   * The ID of the payment to capture.
   */
  payment_id: string
  /**
   * The ID of the user that captured the payment.
   */
  captured_by?: string
  /**
   * The amount to capture. If not provided, the full payment amount will be captured.
   */
  amount?: BigNumberInput
}

export const capturePaymentStepId = "capture-payment-step"
/**
 * This step captures a payment.
 */
export const capturePaymentStep = createStep(
  capturePaymentStepId,
  async (input: CapturePaymentStepInput, { container }) => {
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const payment = await paymentModule.capturePayment(input)

    return new StepResponse(payment, payment)
  },
  async (payment, { container }) => {
    if (!payment) {
      return
    }

    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    // Every time we capture a payment, we create a new capture. We want to delete the newset capture if we capture a payment again.
    const latestCapture = (payment.captures ?? []).sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })[0]

    if (!latestCapture) {
      return
    }

    await paymentModule.deleteCaptures([latestCapture.id])
  }
)
