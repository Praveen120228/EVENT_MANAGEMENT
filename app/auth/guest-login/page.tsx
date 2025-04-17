'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CalendarRange, CheckCircle } from 'lucide-react'

export default function GuestLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [autoCheckDone, setAutoCheckDone] = useState(false)
  
  // Create a direct Supabase client
  const supabase = createClientComponentClient()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        console.log('Already logged in, redirecting to guest dashboard...')
        window.location.href = '/guest/dashboard'
      }
    }
    checkSession()
  }, [])

  // Auto-check and send magic link when user enters email
  const handleEmailCheck = async (emailValue: string) => {
    if (!emailValue || autoCheckDone) return;
    
    // Check if this is a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) return;
    
    setAutoCheckDone(true);
    await checkGuestAndSendLink(emailValue);
  };

  // Function to check guest and send login link
  const checkGuestAndSendLink = async (emailValue: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const normalizedEmail = emailValue.toLowerCase().trim();
      console.log('Auto-checking guest with email:', normalizedEmail);
      
      // Create a public client with anon key to bypass RLS for this check
      const publicClient = createClientComponentClient({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      });
      
      // Check if email exists in guests table
      const { data: guestData, error: guestError } = await publicClient
        .from('guests')
        .select('email, name, id, event_id')
        .ilike('email', normalizedEmail)
        .limit(1);
      
      if (guestError) {
        console.error('Error checking guest:', guestError);
        setLoading(false);
        return;
      }
      
      if (!guestData || guestData.length === 0) {
        console.log('No guest found with email:', normalizedEmail);
        setLoading(false);
        return;
      }
      
      console.log('Found guest with email:', normalizedEmail, 'Sending login link...');
      
      // Send magic link
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/guest/dashboard`,
          data: { role: 'guest' }
        }
      });
      
      if (signInError) {
        if (signInError.message && (
          signInError.message.includes('security purposes') || 
          signInError.message.includes('only request this after')
        )) {
          console.log('Rate limit hit, not showing error to user');
          // Don't show rate limit errors for auto-send
        } else {
          console.error('Sign in error:', signInError);
        }
        setLoading(false);
        return;
      }
      
      setSuccess('Check your email! We\'ve sent you a magic link to sign in.');
      setLoading(false);
    } catch (err) {
      console.error('Error in auto-check:', err);
      setLoading(false);
    }
  };

  // When email changes, trigger the auto check
  useEffect(() => {
    if (email && !loading && !success) {
      handleEmailCheck(email);
    }
  }, [email]);

  // Manual form submission handler
  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAutoCheckDone(false); // Reset the auto-check flag
    await checkGuestAndSendLink(email);
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 flex items-center gap-2">
        <CalendarRange className="h-6 w-6 text-emerald-500" />
        <span className="text-xl font-bold">Specyf</span>
      </Link>
      
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Guest Access</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to access your event invitations
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Event Guest Login</CardTitle>
            <CardDescription>
              Access your event invitations and RSVPs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleGuestLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email address where you received your invitation
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending login link...' : 'Resend Login Link'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Are you an event organizer?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Organizer Login
              </Link>
            </div>
            <div className="text-sm text-muted-foreground text-center">
              Need help? <Link href="/contact" className="text-primary hover:underline">Contact support</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 