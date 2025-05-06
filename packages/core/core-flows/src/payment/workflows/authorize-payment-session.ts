import { PaymentDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { authorizePaymentSessionStep } from "../steps"

/**
 * The data to capture a payment.
 */
export type AuthorizePaymentSessionWorkflowInput = {
  /**
   * The ID of the payment to capture.
   */
  id: string
  /**
   * The context to authorize the payment session with.
   * This context is passed to the payment provider associated with the payment session.
   */
  context?: Record<string, unknown>
}

export const authorizePaymentSessionWorkflowId =
  "authorize-payment-session-workflow"
/**
 * This workflow captures a payment. It's used by the
 * [Capture Payment Admin API Route](https://docs.medusajs.com/api/admin#payments_postpaymentsidcapture).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to capture a payment in your custom flows.
 *
 * @example
 * const { result } = await authorizePaymentSessionWorkflow(container)
 * .run({
 *   input: {
 *     payment_session_id: "pay_123"
 *   }
 * })
 *
 * @summary
 *
 * Capture a payment.
 */
export const authorizePaymentSessionWorkflow = createWorkflow(
  authorizePaymentSessionWorkflowId,
  (
    input: WorkflowData<AuthorizePaymentSessionWorkflowInput>
  ): WorkflowResponse<PaymentDTO | null> => {
    const payment = authorizePaymentSessionStep(input)
    return new WorkflowResponse(payment)
  }
)
