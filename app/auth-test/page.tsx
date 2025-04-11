'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, InfoIcon } from 'lucide-react'

export default function AuthTestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('Initializing...')
  const [envInfo, setEnvInfo] = useState<any>({})
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  // Create a new client directly in the component
  const supabase = createClientComponentClient()

  const addLog = (message: string) => {
    console.log(message) // Also log to console for debugging
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  // Check environment variables
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setEnvInfo({
      url: supabaseUrl ? 'Set' : 'Missing',
      key: supabaseAnonKey ? 'Set' : 'Missing'
    })
    
    addLog(`Supabase URL: ${supabaseUrl ? 'Set' : 'Missing'}`)
    addLog(`Supabase Anon Key: ${supabaseAnonKey ? 'Set' : 'Missing'}`)
  }, [])

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        addLog('Checking for existing session...')
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          addLog(`Error getting session: ${error.message}`)
          setStatus('Error checking session')
          return
        }
        
        if (data?.session) {
          addLog(`Found existing session: ${data.session.user.email}`)
          setStatus('Logged in')
          setSessionInfo({
            user: data.session.user.email,
            id: data.session.user.id,
            role: data.session.user.user_metadata?.role || 'Not set'
          })
        } else {
          addLog('No active session found')
          setStatus('Not logged in')
        }
      } catch (err: any) {
        addLog(`Exception during session check: ${err.message}`)
        setError(err.message)
      }
    }
    
    checkSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth state change: ${event}`)
      
      if (session) {
        setStatus('Logged in')
        setSessionInfo({
          user: session.user.email,
          id: session.user.id,
          role: session.user.user_metadata?.role || 'Not set'
        })
      } else {
        setStatus('Not logged in')
        setSessionInfo(null)
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleDirectLogin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      addLog(`Attempting direct login with email: ${email}`)
      
      // Use direct login via Supabase client
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        addLog(`Login error: ${error.message}`)
        setError(error.message)
        setLoading(false)
        return
      }
      
      addLog('Login successful via direct method')
      addLog(JSON.stringify(data.user, null, 2))
      
      // Force hard navigation to dashboard
      addLog('Forcing navigation to dashboard...')
      window.location.href = '/dashboard'
      
    } catch (err: any) {
      addLog(`Exception during login: ${err.message}`)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      addLog('Signing out...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        addLog(`Sign out error: ${error.message}`)
        setError(error.message)
      } else {
        addLog('Sign out successful')
        setStatus('Not logged in')
        setSessionInfo(null)
      }
    } catch (err: any) {
      addLog(`Exception during sign out: ${err.message}`)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Authentication Tester</h1>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Environment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span>Supabase URL:</span>
                <span>{envInfo.url}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span>Supabase Anon Key:</span>
                <span>{envInfo.key}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span>Current Status:</span>
                <span className="font-bold">{status}</span>
              </div>
              {sessionInfo && (
                <>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>User Email:</span>
                    <span>{sessionInfo.user}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>User ID:</span>
                    <span className="text-xs">{sessionInfo.id}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>User Role:</span>
                    <span>{sessionInfo.role}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {sessionInfo ? 'Current Session' : 'Authentication'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionInfo ? (
              <div className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Logged In</AlertTitle>
                  <AlertDescription>
                    You are currently logged in as {sessionInfo.user}
                  </AlertDescription>
                </Alert>
                <Button onClick={handleSignOut} disabled={loading} variant="destructive">
                  {loading ? 'Signing Out...' : 'Sign Out'}
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'} className="ml-2">
                  Go to Dashboard
                </Button>
              </div>
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
                <Button onClick={handleDirectLogin} disabled={loading} className="w-full">
                  {loading ? 'Signing In...' : 'Sign In (Direct Method)'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>Authentication process logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 overflow-y-auto p-4 bg-muted rounded-md text-xs font-mono">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="pb-1">
                  {log}
                </div>
              ))
            ) : (
              <div>No logs yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 