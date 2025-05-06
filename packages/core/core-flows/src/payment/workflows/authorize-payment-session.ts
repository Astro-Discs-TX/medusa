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
 * This workflow authorizes a payment session. It's used by the
 * [Authorize Payment Session Admin API Route](https://docs.medusajs.com/api/admin#paymentsessions_postpaymentsessionsauthorize).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to authorize a payment session in your custom flows.
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
 * Authorize a payment session.
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
