import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-4 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
      <div className="w-full bg-white flex flex-col p-8 rounded-md shadow-sm border border-[#e2d9cf]">
        <Heading
          level="h2"
          className="font-serif text-[#43372f] text-2xl mb-6"
        >
          In your Cart
        </Heading>
        <CartTotals totals={cart} />
        <Divider className="my-6 border-[#e2d9cf]" />
        <ItemsPreviewTemplate cart={cart} />
        <Divider className="my-6 border-[#e2d9cf]" />
        <div className="mt-2">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
