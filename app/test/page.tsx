'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarRange, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TestPage() {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    error?: string;
  } | null>(null)

  const testConnection = async () => {
    try {
      const supabase = createClientComponentClient()
      
      // Try to get the auth configuration
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setStatus({ isConnected: false, error: error.message })
        return
      }

      setStatus({ isConnected: true })
    } catch (error: any) {
      setStatus({ 
        isConnected: false, 
        error: error.message || 'Failed to connect to Supabase'
      })
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getProjectUrl = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return 'Not configured'
    try {
      const parsed = new URL(url)
      return parsed.host
    } catch {
      return url
    }
  }

  const getProjectId = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return 'Not configured'
    try {
      const parsed = new URL(url)
      return parsed.host.split('.')[0]
    } catch {
      return 'Invalid URL'
    }
  }

  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const getUrlValidationMessage = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url) return 'URL is not configured'
    if (!isValidUrl(url)) return 'URL format is invalid'
    if (!url.includes('.supabase.co')) return 'URL should contain .supabase.co'
    return 'URL format is valid'
  }

  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">Specyf</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Connection Test</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check your Supabase connection status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Testing connection to your Supabase project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {status === null ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent" />
                ) : status.isConnected ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">
                  {status === null
                    ? 'Testing connection...'
                    : status.isConnected
                    ? 'Connected successfully'
                    : 'Connection failed'}
                </span>
              </div>

              {status?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>{status.error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={testConnection} variant="outline" className="w-full">
                Test Connection Again
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connection Details</h3>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Project URL:</span>
                  <span className="font-mono">{getProjectUrl()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Project ID:</span>
                  <span className="font-mono">{getProjectId()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">URL Validation:</span>
                  <span className={`font-mono ${isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) ? 'text-green-500' : 'text-red-500'}`}>
                    {getUrlValidationMessage()}
                  </span>
                </div>
              </div>
            </div>

            {!isValidUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>URL Format Issue</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">Your Supabase URL appears to be invalid. The correct format should be:</p>
                  <code className="block p-2 bg-gray-100 dark:bg-gray-800 rounded mb-2">
                    https://your-project-id.supabase.co
                  </code>
                  <p>Make sure:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The URL starts with <code>https://</code></li>
                    <li>It contains your project ID</li>
                    <li>It ends with <code>.supabase.co</code></li>
                    <li>There are no extra spaces or characters</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>
            If you're seeing connection errors, make sure your environment variables are set correctly in{' '}
            <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800">.env.local</code>
          </p>
        </div>
      </div>
    </div>
  )
}