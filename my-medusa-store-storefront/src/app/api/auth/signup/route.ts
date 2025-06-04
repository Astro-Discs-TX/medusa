import { sdk } from "@lib/config"
import { getCacheTag, getCartId, setAuthToken } from "@lib/data/cookies"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const password = formData.get("password") as string
    const customerForm = {
      email: formData.get("email") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
    }

    // Register the user
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      authorization: `Bearer ${token}`,
    }

    // Create the customer
    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    // Login the user
    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    // Revalidate cache
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    // Transfer cart
    const cartId = await getCartId()
    if (cartId) {
      await sdk.store.cart.transferCart(cartId, {}, { authorization: `Bearer ${loginToken}` })
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    }

    return NextResponse.json({ success: true, customer: createdCustomer })
  } catch (error: unknown) {
    console.error("Error during signup:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }, 
      { status: 500 }
    )
  }
} 