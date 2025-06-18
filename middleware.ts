import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define paths that require authentication
  const isCustomerPath = path.startsWith("/customer") || path.startsWith("/account")
  const isCheckoutPath = path.startsWith("/checkout") && !path.startsWith("/checkout/auth")

  if (isCustomerPath || isCheckoutPath) {
    // Check if user is authenticated by looking for the auth cookie
    // The name should match what your Express backend sets
    const authCookie = request.cookies.get("token")

    if (!authCookie) {
      // Redirect to login if no auth cookie
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Continue to the protected route
    // The actual token verification will be done by your Express backend
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/customer/:path*", "/checkout/:path*"],
}
