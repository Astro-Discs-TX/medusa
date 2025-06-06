import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

// List of valid country codes that we support
const VALID_COUNTRY_CODES = ["us", "gb", "dk", "de", "se", "fr", "es", "it", "ca", "au", "jp"] // Add all supported country codes

/**
 * Middleware to handle region selection and onboarding status.
 */
export async function middleware(request: NextRequest) {
  try {
    // Get country code from URL
    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
    
    // If URL already has a valid country code, just proceed
    if (VALID_COUNTRY_CODES.includes(urlCountryCode)) {
      // Set cache ID cookie if not already set
      let cacheIdCookie = request.cookies.get("_medusa_cache_id")
      if (!cacheIdCookie) {
        const response = NextResponse.next()
        response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
          maxAge: 60 * 60 * 24,
        })
        return response
      }
      return NextResponse.next()
    }

    // Check if the URL is a static asset
    if (request.nextUrl.pathname.includes(".")) {
      return NextResponse.next()
    }

    // If no valid country code in URL, redirect to default region
    const redirectPath = 
      request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
    const queryString = request.nextUrl.search ? request.nextUrl.search : ""
    
    const redirectUrl = `${request.nextUrl.origin}/${DEFAULT_REGION}${redirectPath}${queryString}`
    const response = NextResponse.redirect(redirectUrl, 307)
    
    // Set cache ID cookie
    response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
      maxAge: 60 * 60 * 24,
    })
    
    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of any error, just proceed with the request
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
