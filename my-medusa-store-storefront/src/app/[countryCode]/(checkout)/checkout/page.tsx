import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { parallelFetch } from "@lib/util/parallel-fetch"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import CheckoutSkeleton from "@modules/skeletons/templates/checkout-skeleton"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import "./checkout.css"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export const metadata: Metadata = {
  title: "Checkout | Marble Luxe",
}

export default async function Checkout() {
  // Fetch cart and customer in parallel
  const [cart, customer] = await parallelFetch([
    async () => {
      try {
        return await retrieveCart()
      } catch (error) {
        console.error(error)
        return null
      }
    },
    async () => {
      try {
        return await retrieveCustomer()
      } catch (error) {
        console.error(error)
        return null
      }
    }
  ])

  if (!cart) {
    return notFound()
  }

  return (
    <div className="bg-[#f9f6f2] checkout-container py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LocalizedClientLink
          href="/cart"
          className="text-small-semi text-luxury-charcoal/70 flex items-center gap-x-2 uppercase transition-colors duration-150 ease-in-out hover:text-luxury-gold mb-6"
          data-testid="back-to-cart-link"
        >
          <ChevronDown className="rotate-90" size={16} />
          <span className="mt-px font-medium tracking-wider">
            Back to shopping cart
          </span>
        </LocalizedClientLink>
        
        <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] gap-x-8 small:gap-x-16 py-6 fade-in">
          <Suspense fallback={<CheckoutSkeleton />}>
            <PaymentWrapper cart={cart}>
              <CheckoutForm cart={cart} customer={customer} />
            </PaymentWrapper>
          </Suspense>
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
