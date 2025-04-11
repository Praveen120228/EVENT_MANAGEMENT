'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarRange, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function TestDbPage() {
  const [status, setStatus] = useState<{
    isConnected: boolean;
    error?: string;
  } | null>(null)

  const testConnection = async () => {
    try {
      if (!supabase) {
        setStatus({ isConnected: false, error: 'Supabase client not initialized' })
        return
      }

      // Try to get the authenticated user to test the connection
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        setStatus({ isConnected: false, error: error.message })
        return
      }

      setStatus({ isConnected: true })
    } catch (error: any) {
      setStatus({ isConnected: false, error: error.message })
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">Specyf</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Database Test</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check your database connection status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Database Connection Status</CardTitle>
            <CardDescription>Testing connection to your Supabase database</CardDescription>
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
                    ? 'Connected to database'
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
                  <span className="text-gray-500 dark:text-gray-400">Database URL:</span>
                  <span className="font-mono">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, '')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Project ID:</span>
                  <span className="font-mono">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].split('//')[1]}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 