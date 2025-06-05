import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <div className="bg-white p-8 rounded-md shadow-sm border border-[#e2d9cf]">
        <Addresses cart={cart} customer={customer} />
      </div>

      <div className="bg-white p-8 rounded-md shadow-sm border border-[#e2d9cf]">
        <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      </div>

      <div className="bg-white p-8 rounded-md shadow-sm border border-[#e2d9cf]">
        <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      </div>

      <div className="bg-white p-8 rounded-md shadow-sm border border-[#e2d9cf]">
        <Review cart={cart} />
      </div>
    </div>
  )
}
