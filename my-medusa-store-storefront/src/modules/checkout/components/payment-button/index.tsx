"use client"

import { isManual, isStripe } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
  className?: string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
  className,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
          className={className}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton 
          notReady={notReady} 
          data-testid={dataTestId}
          className={className}
        />
      )
    default:
      return <Button disabled className={className}>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
  className,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
  className?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [orderProcessing, setOrderProcessing] = useState<boolean>(false)

  const onPaymentCompleted = async () => {
    try {
      setOrderProcessing(true)
      
      // Set a minimum loading time for better UX
      const startTime = Date.now()
      
      // Place the order
      await placeOrder()
      
      // Ensure loading state shows for at least 500ms for better UX
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime))
      }
      
      // Note: We don't need to manually reset state here as the redirect will unmount the component
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while placing your order")
      setSubmitting(false)
      setOrderProcessing(false)
    }
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    if (submitting || orderProcessing) return
    
    setSubmitting(true)
    setErrorMessage(null)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    try {
      // Use Promise.race to add a timeout for Stripe operations
      const { error, paymentIntent } = await Promise.race([
        stripe.confirmCardPayment(session?.data.client_secret as string, {
          payment_method: {
            card: card,
            billing_details: {
              name:
                cart.billing_address?.first_name +
                " " +
                cart.billing_address?.last_name,
              address: {
                city: cart.billing_address?.city ?? undefined,
                country: cart.billing_address?.country_code ?? undefined,
                line1: cart.billing_address?.address_1 ?? undefined,
                line2: cart.billing_address?.address_2 ?? undefined,
                postal_code: cart.billing_address?.postal_code ?? undefined,
                state: cart.billing_address?.province ?? undefined,
              },
              email: cart.email,
              phone: cart.billing_address?.phone ?? undefined,
            },
          },
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Payment processing timed out")), 15000)
        )
      ]) as any;

      if (error) {
        const pi = error.payment_intent

        if (
          (pi && pi.status === "requires_capture") ||
          (pi && pi.status === "succeeded")
        ) {
          return onPaymentCompleted()
        }

        setErrorMessage(error.message || "Payment failed")
        setSubmitting(false)
        return
      }

      if (
        (paymentIntent && paymentIntent.status === "requires_capture") ||
        paymentIntent.status === "succeeded"
      ) {
        return onPaymentCompleted()
      }

      setSubmitting(false)
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during payment processing")
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={disabled || notReady || orderProcessing}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
        className={className || "bg-[var(--color-luxury-gold)] hover:bg-[var(--color-luxury-darkgold)] text-white border-none px-8 py-3 rounded-md luxury-btn"}
      >
        {orderProcessing ? "Processing order..." : "Place order"}
      </Button>
      {errorMessage && (
        <ErrorMessage
          error={errorMessage}
          data-testid="stripe-payment-error-message"
        />
      )}
    </>
  )
}

const ManualTestPaymentButton = ({ 
  notReady,
  "data-testid": dataTestId,
  className,
}: { 
  notReady: boolean
  "data-testid"?: string
  className?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [orderProcessing, setOrderProcessing] = useState<boolean>(false)

  const onPaymentCompleted = async () => {
    try {
      setOrderProcessing(true)
      
      // Set a minimum loading time for better UX
      const startTime = Date.now()
      
      // Place the order
      await placeOrder()
      
      // Ensure loading state shows for at least 500ms for better UX
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < 500) {
        await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime))
      }
      
      // Note: We don't need to manually reset state here as the redirect will unmount the component
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while placing your order")
      setSubmitting(false)
      setOrderProcessing(false)
    }
  }

  const handlePayment = () => {
    if (submitting || orderProcessing) return
    
    setSubmitting(true)
    setErrorMessage(null)
    
    // Use requestAnimationFrame to ensure UI updates before heavy processing
    requestAnimationFrame(() => {
      onPaymentCompleted()
    })
  }

  return (
    <>
      <Button
        disabled={notReady || orderProcessing}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId || "submit-order-button"}
        className={className || "bg-[var(--color-luxury-gold)] hover:bg-[var(--color-luxury-darkgold)] text-white border-none px-8 py-3 rounded-md luxury-btn"}
      >
        {orderProcessing ? "Processing order..." : "Place order"}
      </Button>
      {errorMessage && (
        <ErrorMessage
          error={errorMessage}
          data-testid="manual-payment-error-message"
        />
      )}
    </>
  )
}

export default PaymentButton
