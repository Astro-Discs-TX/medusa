"use client"

import { useEffect, useState } from "react"
import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CartButton() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await retrieveCart()
        setCart(cartData)
      } catch (error) {
        console.error("Error fetching cart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  if (loading) {
    return (
      <LocalizedClientLink
        className="hover:text-luxury-gold transition-colors duration-300 flex gap-2 uppercase tracking-wider text-small-semi"
        href="/cart"
        data-testid="nav-cart-link"
      >
        Cart (0)
      </LocalizedClientLink>
    )
  }

  return <CartDropdown cart={cart} />
}
