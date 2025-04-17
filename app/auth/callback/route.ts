import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirectParam = requestUrl.searchParams.get('redirect')
    
    console.log('Auth callback triggered with code:', code ? 'provided' : 'missing')
    console.log('Redirect parameter:', redirectParam || 'not provided')

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
      
      // Determine the appropriate redirect based on user role or the redirect parameter
      let redirectTo = '/dashboard' // default redirect for organizers
      
      // Check for custom redirect parameter 
      if (redirectParam) {
        console.log('Using custom redirect from parameter:', redirectParam)
        redirectTo = redirectParam
      }
      // Check user metadata for role-based redirect
      else if (data?.session?.user?.user_metadata?.role === 'guest') {
        console.log('User has guest role in metadata:', data.session.user.user_metadata)
        redirectTo = '/guest/dashboard'
      } else {
        console.log('No guest role found in metadata, user metadata:', data?.session?.user?.user_metadata)
      }
      
      console.log('Redirecting to:', redirectTo)
      return NextResponse.redirect(new URL(redirectTo, request.url))
    } else {
      console.log('No code provided in callback')
    }

    // Fallback redirect if no code provided
    const fallbackRedirect = redirectParam || '/dashboard'
    console.log('Redirecting to fallback:', fallbackRedirect)
    return NextResponse.redirect(new URL(fallbackRedirect, request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    // Redirect to login with error
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('error', 'An unexpected error occurred. Please try again.')
    return NextResponse.redirect(redirectUrl)
  }
} 