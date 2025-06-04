import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DEFAULT_REGION = 'us'

/**
 * Simplified middleware that bypasses region checks and always redirects to /us
 * This is a temporary fix to get the storefront working while we debug API issues
 */
export function middleware(request: NextRequest) {
  // Clone the request url
  const url = request.nextUrl.clone()
  
  // If already at /us, just continue
  if (url.pathname.startsWith('/us')) {
    return NextResponse.next()
  }
  
  // Otherwise redirect to /us
  url.pathname = `/us${url.pathname === '/' ? '' : url.pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
