'use middleware'

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Get the pathname
  const pathname = req.nextUrl.pathname
  
  // Only protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session, redirect to login
    if (!session) {
      console.log('No authenticated session, redirecting to login')
      const redirectUrl = new URL('/auth/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    console.log('Authenticated session found, allowing access')
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/:path*'
  ]
} 