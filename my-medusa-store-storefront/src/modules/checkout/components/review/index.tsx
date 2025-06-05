"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-8">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row font-serif text-[#43372f] text-2xl gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-8">
            <div className="w-full">
              <Text className="text-[#8a7f72] mb-1">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Marble
                Luxe&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <div className="w-full">
            <PaymentButton 
              cart={cart} 
              data-testid="submit-order-button" 
              className="w-full bg-[#43372f] hover:bg-[#2a221e] text-white border-none px-8 py-3 rounded-md"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Review
