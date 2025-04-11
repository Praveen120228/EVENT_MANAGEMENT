'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useSupabase } from '@/hooks/useSupabase'
import { getSupabaseConfigStatus, testDatabaseConnection } from '@/lib/supabase'

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configStatus, setConfigStatus] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState<any>(null)
  const { signIn, user, signOut } = useSupabase()

  useEffect(() => {
    // Check Supabase configuration status
    const status = getSupabaseConfigStatus()
    setConfigStatus(status)

    // Test database connection
    const testConnection = async () => {
      const result = await testDatabaseConnection()
      setConnectionStatus(result)
    }
    testConnection()
  }, [])

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Attempting to sign in with:', { email, password })
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError)
        console.error('Sign in error:', signInError)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-8 text-3xl font-bold">Supabase Auth Test Page</h1>

      {/* Configuration Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Supabase Configuration Status</CardTitle>
          <CardDescription>Current status of your Supabase configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>URL Set: {configStatus?.urlSet ? '✅' : '❌'}</p>
            <p>URL Valid: {configStatus?.urlValid ? '✅' : '❌'}</p>
            <p>Key Set: {configStatus?.keySet ? '✅' : '❌'}</p>
            <p>Fully Configured: {configStatus?.isConfigured ? '✅' : '❌'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Connection Test */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
          <CardDescription>Status of the connection to your Supabase project</CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus?.error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{connectionStatus.error}</AlertDescription>
            </Alert>
          ) : connectionStatus?.success ? (
            <p className="text-green-600">✅ Successfully connected to database</p>
          ) : (
            <p>Testing connection...</p>
          )}
        </CardContent>
      </Card>

      {/* Authentication Test */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Test signing in and out</CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-4">
              <p>✅ Signed in as: {user.email}</p>
              <Button onClick={handleSignOut}>Sign Out</Button>
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
                {loading ? 'Signing in...' : 'Test Sign In'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>Additional details for troubleshooting</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap break-words text-sm">
            {JSON.stringify(
              {
                configStatus,
                connectionStatus,
                user: user ? { 
                  id: user.id,
                  email: user.email,
                  emailVerified: user.email_confirmed_at,
                  lastSignIn: user.last_sign_in_at
                } : null,
                error
              },
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 