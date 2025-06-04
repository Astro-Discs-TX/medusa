import { sdk } from "@lib/config"
import { getCacheTag, getAuthHeaders, getCartId } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const cartId = await getCartId()
    
    if (!cartId) {
      return NextResponse.json({ success: false, error: "No cart found" })
    }

    const headers = await getAuthHeaders()
    
    if (!Object.keys(headers).length) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await sdk.store.cart.transferCart(cartId, {}, headers)
    
    // Revalidate cache
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error transferring cart:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
} 