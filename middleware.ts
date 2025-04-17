'use middleware'

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Get the pathname
  const pathname = req.nextUrl.pathname
  
  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protect dashboard routes (organizer routes)
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/events') || 
      pathname.startsWith('/profile') || 
      pathname.startsWith('/settings')) {
    
    // If no session, redirect to login
    if (!session) {
      console.log('No authenticated session, redirecting to login')
      const redirectUrl = new URL('/auth/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    console.log('Authenticated session found, allowing access to organizer routes')
  }
  
  // Protect guest routes
  if (pathname.startsWith('/guest/dashboard') || 
      pathname.startsWith('/guest/events')) {
    
    // If no session, redirect to guest login
    if (!session) {
      console.log('No authenticated session, redirecting to guest login')
      const redirectUrl = new URL('/auth/guest-login', req.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    console.log('Authenticated session found for guest routes, user email:', session.user.email)
    
    // Log user metadata to help with debugging
    console.log('User metadata:', session.user.user_metadata)
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/events/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/:path*',
    '/guest/dashboard/:path*',
    '/guest/events/:path*'
  ]
} 