import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle undefined or null pathname
  if (!pathname) {
    return NextResponse.next()
  }

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/profile', '/settings']
  const authRoutes = ['/login', '/register']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Get the auth token from cookies
  const token = request.cookies.get('sb-access-token')?.value
  
  // Redirect logic
  if (isProtectedRoute && !token) {
    // Redirect to login if accessing protected route without token
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
  
  if (isAuthRoute && token) {
    // Redirect to dashboard if accessing auth routes with token
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}