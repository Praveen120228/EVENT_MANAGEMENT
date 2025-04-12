'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarRange, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getSupabaseClient } from '@/lib/supabase'

export default function GuestLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Use magic link authentication for guests - simpler than passwords
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/guest/events`,
          data: {
            role: 'guest'
          }
        }
      })
      
      if (signInError) {
        throw signInError
      }
      
      setSuccess('Check your email for a login link')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to send login link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">Specyf</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Guest Access</h1>
          <p className="text-gray-500">
            Enter your email to access your event invitations
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="bg-emerald-50 text-emerald-800 border-emerald-100">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Event Guest</CardTitle>
              <CardDescription>
                Sign in to view and respond to your event invitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {success ? 'Email Sent' : 'Continue with Email'}
              </Button>
              <div className="text-center text-sm text-gray-500">
                <p>We'll send you a secure link to access your invitations</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 