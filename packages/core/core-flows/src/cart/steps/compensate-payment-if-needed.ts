import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { Modules } from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import { IPaymentModuleService } from "@medusajs/framework/types"

/**
 * The cart's details.
 */
export interface CompensatePaymentIfNeededStepInput {
  /**
   * The payment to compensate.
   */
  payment_id: string
}

export const compensatePaymentIfNeededStepId = "compensate-payment-if-needed"
/**
 * Purpose of this step is to be a last compensation in cart completion workflow.
 * If the cart completion fails, this steps tries to cancel the payment.
 * The step returns the payment with provided id.
 *
 * @example
 * const data = compensatePaymentIfNeededStep({
 *   payment_id: "pay_123"
 * })
 */
export const compensatePaymentIfNeededStep = createStep(
  compensatePaymentIfNeededStepId,
  async (data: CompensatePaymentIfNeededStepInput, { container }) => {
    const { payment_id } = data

    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    const payment = await paymentModule.retrievePayment(payment_id, {
      relations: ["payment", "payment.captures"],
    })

    return new StepResponse(payment)
  },
  async (payment, { container }) => {
    if (!payment) {
      return
    }

    const logger = container.resolve<Logger>(ContainerRegistrationKeys.LOGGER)
    const paymentModule = container.resolve<IPaymentModuleService>(
      Modules.PAYMENT
    )

    try {
      await paymentModule.cancelPayment(payment.id)
    } catch (e) {
      logger.error(
        `Error was thrown trying to cancel payment - ${payment.id} - ${e}`
      )
    }
  }
)
