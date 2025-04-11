'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export default function AuthDebugPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const supabase = getSupabaseClient()

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        addLog('Checking current session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          addLog(`Error checking session: ${error.message}`)
          setError(error.message)
          return
        }
        
        if (session) {
          addLog(`User is logged in: ${session.user.email}`)
          setLoggedIn(true)
          setUserData(session.user)
        } else {
          addLog('No active session')
          setLoggedIn(false)
        }
      } catch (err: any) {
        addLog(`Exception when checking session: ${err.message}`)
        setError(err.message)
      }
    }

    checkSession()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth state change: – "${event}" – "${session?.user?.id || 'no user'}"`)
      
      if (session) {
        setLoggedIn(true)
        setUserData(session.user)
      } else {
        setLoggedIn(false)
        setUserData(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      addLog(`Attempting to sign in with email: ${email}`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        addLog(`Sign in error: ${error.message}`)
        setError(error.message)
        return
      }
      
      addLog('Sign in successful')
      setLoggedIn(true)
      setUserData(data.user)
      
      // Force navigation to dashboard
      addLog('Redirecting to dashboard...')
      window.location.href = '/dashboard'
    } catch (err: any) {
      addLog(`Exception during sign in: ${err.message}`)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    setError(null)
    
    try {
      addLog('Attempting to sign out')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        addLog(`Sign out error: ${error.message}`)
        setError(error.message)
        return
      }
      
      addLog('Sign out successful')
      setLoggedIn(false)
      setUserData(null)
    } catch (err: any) {
      addLog(`Exception during sign out: ${err.message}`)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Auth Debugging Tool</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current login state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-muted">
                <p><strong>Status:</strong> {loggedIn ? 'Logged In' : 'Logged Out'}</p>
                {userData && (
                  <>
                    <p><strong>User ID:</strong> {userData.id}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Role:</strong> {userData.user_metadata?.role || 'Not set'}</p>
                  </>
                )}
              </div>
              
              {loggedIn ? (
                <Button onClick={handleSignOut} disabled={loading}>
                  {loading ? 'Signing Out...' : 'Sign Out'}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button onClick={handleSignIn} disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>Recent authentication events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto p-4 bg-muted rounded-md text-sm font-mono">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="pb-2">
                    {log}
                  </div>
                ))
              ) : (
                <div>No activity logged yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}