import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { parallelFetch } from "@lib/util/parallel-fetch"
import CartTemplate from "@modules/cart/templates"
import CartSkeleton from "@modules/skeletons/templates/cart-skeleton"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Cart | Marble Luxe",
  description: "View your cart and proceed to checkout",
}

export default async function Cart() {
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
    <Suspense fallback={<CartSkeleton />}>
      <CartTemplate cart={cart} customer={customer} />
    </Suspense>
  )
}
