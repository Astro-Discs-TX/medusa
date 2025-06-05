import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-12 min-h-[calc(100vh-64px)] bg-[var(--color-luxury-ivory)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-6 max-w-4xl h-full w-full py-12 px-8 bg-white luxury-shadow-md rounded-md fade-in"
          data-testid="order-complete-container"
        >
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-luxury-lightgold)] flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-darkgold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <Heading
              level="h1"
              className="flex flex-col gap-y-3 text-[#43372f] font-serif text-3xl"
            >
              <span className="font-bold">Thank you!</span>
              <span>Your order was placed successfully.</span>
            </Heading>
          </div>
          
          <div className="p-6 bg-[var(--color-luxury-ivory)] rounded-md luxury-shadow-sm">
            <OrderDetails order={order} />
          </div>
          
          <Heading level="h2" className="flex flex-row text-2xl font-serif text-[#43372f] border-b border-[var(--color-luxury-lightgold)] pb-2 mt-4">
            Summary
          </Heading>
          
          <div className="bg-white rounded-md luxury-shadow-sm p-2">
            <Items order={order} />
          </div>
          
          <div className="bg-[var(--color-luxury-ivory)] rounded-md p-6 luxury-shadow-sm">
            <CartTotals totals={order} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white rounded-md p-6 luxury-shadow-sm">
              <ShippingDetails order={order} />
            </div>
            
            <div className="bg-white rounded-md p-6 luxury-shadow-sm">
              <PaymentDetails order={order} />
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-[var(--color-luxury-ivory)] rounded-md luxury-shadow-sm">
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
