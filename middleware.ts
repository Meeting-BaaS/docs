import { auth } from "@/auth"
import { NextResponse } from "next/server"

// Routes that require internal access (meetingbaas.com email)
const INTERNAL_ROUTES = ["/internal", "/docs/internal"]

export default auth((req) => {
  const { pathname } = req.nextUrl

  // Check if this is an internal route
  const isInternalRoute = INTERNAL_ROUTES.some(route =>
    pathname.startsWith(route) || pathname.includes("/internal")
  )

  if (!isInternalRoute) {
    // Public route - allow access
    return NextResponse.next()
  }

  // Internal route - check authentication
  if (!req.auth) {
    // Not logged in - redirect to sign in
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check if user has internal access (meetingbaas.com domain)
  const email = req.auth.user?.email
  if (!email) {
    return NextResponse.redirect(new URL("/auth/error?error=NoEmail", req.url))
  }

  const domain = email.split("@")[1]
  const isInternal = domain === "meetingbaas.com"

  if (!isInternal) {
    // Wrong domain - show access denied
    return NextResponse.redirect(new URL("/auth/access-denied", req.url))
  }

  // Internal user - allow access
  return NextResponse.next()
})

export const config = {
  // Match internal doc routes
  matcher: [
    "/internal/:path*",
    "/docs/internal/:path*",
  ],
}
