import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    console.log('Auth callback triggered with code:', code ? 'provided' : 'missing')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // Exchange the code for a session
      console.log('Exchanging code for session...')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        // Redirect to login with error
        const redirectUrl = new URL('/auth/login', request.url)
        redirectUrl.searchParams.set('error', 'Authentication failed. Please try again.')
        return NextResponse.redirect(redirectUrl)
      }
      
      console.log('Session established successfully, user:', data?.session?.user?.email)
    } else {
      console.log('No code provided in callback')
    }

    // URL to redirect to after sign in process completes
    console.log('Redirecting to dashboard...')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    // Redirect to login with error
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('error', 'An unexpected error occurred. Please try again.')
    return NextResponse.redirect(redirectUrl)
  }
} 