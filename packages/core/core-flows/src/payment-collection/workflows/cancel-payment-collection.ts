import { PaymentCollectionDTO } from "@medusajs/framework/types"
import { MedusaError, PaymentCollectionStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { updatePaymentCollectionStep } from "../steps/update-payment-collection"
import { cancelPaymentStep } from "../steps/cancel-payment"

const validatePaymentCollectionCancellationStep = createStep(
  "validate-payment-collection-cancellation",
  async (input: { paymentCollection: PaymentCollectionDTO }) => {
    const { paymentCollection } = input

    if (paymentCollection.status === PaymentCollectionStatus.COMPLETED) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot cancel a completed payment collection"
      )
    }

    if (paymentCollection.status == PaymentCollectionStatus.CANCELED) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Payment collection is already canceled"
      )
    }
  }
)

/**
 * The data to cancel a payment collection.
 */
export interface CancelPaymentCollectionWorkflowInput {
  /**
   * The id of the payment collection to cancel.
   */
  payment_collection_id: string
}

export const cancelPaymentCollectionWorkflowId = "cancel-payment-collection"
/**
 * This workflow cancels a payment collection that is either not paid or authorized.
 *
 * Payment colelction that is completed or already canceled cannot be canceled.
 *
 * @example
 * const data = cancelPaymentCollectionStep({
 *   payment_collection_id: "paycol_123",
 * })
 */
export const cancelPaymentCollectionWorkflow = createWorkflow(
  cancelPaymentCollectionWorkflowId,
  (
    input: WorkflowData<CancelPaymentCollectionWorkflowInput>
  ): WorkflowResponse<PaymentCollectionDTO> => {
    const paymentCollectionQuery = useQueryGraphStep({
      entity: "payment_collection",
      fields: ["id", "status", "payments.id", "payments.captured_at"],
      filters: { id: input.payment_collection_id },
    }).config({ name: "get-payment-collection" })

    const paymentCollection = transform(
      { paymentCollectionQuery },
      ({ paymentCollectionQuery }) => paymentCollectionQuery.data[0]
    )

    validatePaymentCollectionCancellationStep({
      paymentCollection,
    })

    /**
     * Only cancel authorized payments, not captured payments.
     */
    const authorizedPaymentIds = transform(
      { paymentCollection },
      ({ paymentCollection }) =>
        paymentCollection.payments
          ?.filter((p) => !p.captured_at)
          .map((p) => p.id) ?? []
    )

    cancelPaymentStep({
      ids: authorizedPaymentIds,
    })

    const updatedPaymentCollections = updatePaymentCollectionStep({
      selector: { id: paymentCollection.id },
      update: {
        status: PaymentCollectionStatus.CANCELED, // TODO: should it be PARTIALLY_CAPTURED if there is caputred amount?
      },
    })

    const resultPaymentCollection = transform(
      { updatedPaymentCollections },
      ({ updatedPaymentCollections }) => updatedPaymentCollections[0]
    )

    return new WorkflowResponse(resultPaymentCollection)
  }
)
