import { sdk } from "@lib/config"
import { removeAuthToken, removeCartId, getCacheTag } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Logout from the API
    await sdk.auth.logout()

    // Remove auth token from cookies
    await removeAuthToken()

    // Revalidate cache tags
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    // Remove cart ID from cookies
    await removeCartId()

    // Revalidate cart cache tag
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error("Error during signout:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
} 