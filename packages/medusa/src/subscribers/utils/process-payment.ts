import {
  authorizePaymentSessionWorkflow,
  capturePaymentWorkflow,
  completeCartWorkflow,
} from "@medusajs/core-flows"
import { MedusaContainer, WebhookActionResult } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  PaymentActions,
} from "@medusajs/framework/utils"

export async function processPayment({
  processedEvent,
  container,
}: {
  processedEvent: WebhookActionResult
  container: MedusaContainer
}) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const paymentData = await query.graph({
    entity: "payment",
    fields: ["id", "payment_session", "payment_session.payment_collection_id"],
    filters: {
      payment_session_id: processedEvent.data?.session_id,
    },
  })

  const paymentCollectionId =
    paymentData.data[0].payment_session.payment_collection_id

  const cartPaymentCollection = await query.graph({
    entity: "cart_payment_collection",
    fields: ["cart_id"],
    filters: {
      payment_collection_id: paymentCollectionId,
    },
  })

  // Capture payment, if it exists
  if (
    processedEvent.action === PaymentActions.SUCCESSFUL &&
    !!paymentData.data.length
  ) {
    await capturePaymentWorkflow(container).run({
      input: {
        payment_id: paymentData.data[0].id,
        amount: processedEvent.data?.amount,
      },
      throwOnError: false,
    })
  }

  // Authorize payment session and create payment, if there is no payment yet
  if (
    !cartPaymentCollection.data.length &&
    processedEvent.action === PaymentActions.AUTHORIZED &&
    !!processedEvent.data?.session_id
  ) {
    await authorizePaymentSessionWorkflow(container).run({
      input: {
        id: processedEvent.data?.session_id,
      },
      throwOnError: false,
    })
  }

  // Complete cart, if the payment is authorized and associated with a cart
  if (cartPaymentCollection.data.length) {
    await completeCartWorkflow(container).run({
      input: {
        id: cartPaymentCollection.data[0].cart_id,
      },
      throwOnError: false,
      context: {
        // We pass the transactionId here and in `POST /carts/:id/complete` to ensure only one cart-completion workflow can run at a time
        transactionId: cartPaymentCollection.data[0].cart_id,
      },
    })
  }
}
