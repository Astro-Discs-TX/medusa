import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

// List of valid country codes that we support
const VALID_COUNTRY_CODES = ["us", "gb", "dk", "de", "se", "fr", "es", "it", "ca", "au", "jp"] // Add all supported country codes

// Paths that should have longer cache times (static content)
const STATIC_PATHS = [
  '/api/static',
  '/_next/static',
  '/images',
  '/fonts',
  '/icons',
  '/favicon.ico',
]

// Paths that should never be cached
const DYNAMIC_PATHS = [
  '/api/auth',
  '/api/checkout',
  '/api/cart',
]

/**
 * Middleware to handle region selection, caching, and performance optimization.
 */
export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    
    // Get country code from URL
    const urlCountryCode = pathname.split("/")[1]?.toLowerCase()
    
    // Create a response object we can modify
    let response = NextResponse.next()
    
    // Add cache headers based on path
    if (process.env.NODE_ENV === 'production') {
      // Check if the path is for static assets
      if (STATIC_PATHS.some(path => pathname.startsWith(path))) {
        // Static assets can be cached longer
        response.headers.set(
          'Cache-Control',
          'public, max-age=31536000, immutable'
        )
      } 
      // Never cache dynamic endpoints
      else if (DYNAMIC_PATHS.some(path => pathname.startsWith(path))) {
        response.headers.set(
          'Cache-Control',
          'no-store, no-cache, must-revalidate, proxy-revalidate'
        )
        response.headers.set('Pragma', 'no-cache')
        response.headers.set('Expires', '0')
      } 
      // For regular pages, use a balanced approach
      else {
        response.headers.set(
          'Cache-Control',
          'public, max-age=10, s-maxage=30, stale-while-revalidate=59'
        )
      }
    }

    // If URL already has a valid country code, just proceed with cache headers
    if (VALID_COUNTRY_CODES.includes(urlCountryCode)) {
      // Set cache ID cookie if not already set
      let cacheIdCookie = request.cookies.get("_medusa_cache_id")
      if (!cacheIdCookie) {
        response.cookies.set("_medusa_cache_id", crypto.randomUUID(), {
          maxAge: 60 * 60 * 24,
        })
      }
      return response
    }

    // Check if the URL is a static asset
    if (pathname.includes(".")) {
      return response
    }

    // If no valid country code in URL, redirect to default region
    const redirectPath = 
      pathname === "/" ? "" : pathname
    const queryString = request.nextUrl.search ? request.nextUrl.search : ""
    
    const redirectUrl = `${request.nextUrl.origin}/${DEFAULT_REGION}${redirectPath}${queryString}`
    response = NextResponse.redirect(redirectUrl, 307)
    
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
