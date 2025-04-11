'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarRange, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getSupabaseConfigStatus } from '@/lib/supabase'

export default function TestEnvPage() {
  const [configStatus, setConfigStatus] = useState<ReturnType<typeof getSupabaseConfigStatus> | null>(null)

  useEffect(() => {
    // Get detailed configuration status
    const status = getSupabaseConfigStatus()
    setConfigStatus(status)
  }, [])

  const StatusIcon = ({ isSuccess }: { isSuccess: boolean }) => (
    isSuccess ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  )

  return (
    <div className="container mx-auto py-8">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-emerald-500" />
            <span className="text-2xl font-bold">Specyf</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Environment Test</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check your Supabase configuration status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Supabase Configuration Status</CardTitle>
            <CardDescription>Detailed diagnostics for your Supabase setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Environment Variables Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Environment Variables</h3>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <StatusIcon isSuccess={configStatus?.urlSet ?? false} />
                  <span>NEXT_PUBLIC_SUPABASE_URL: {configStatus?.urlSet ? 'Set' : 'Not Set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon isSuccess={configStatus?.keySet ?? false} />
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY: {configStatus?.keySet ? 'Set' : 'Not Set'}</span>
                </div>
              </div>
            </div>

            {/* Configuration Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuration Status</h3>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <StatusIcon isSuccess={configStatus?.urlValid ?? false} />
                  <span>URL Format Valid: {configStatus?.urlValid ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusIcon isSuccess={configStatus?.isConfigured ?? false} />
                  <span>Supabase Configured: {configStatus?.isConfigured ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Configuration Help */}
            {!configStatus?.isConfigured && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Configuration Required</AlertTitle>
                <AlertDescription>
                  <p className="mt-2">Please update your <code className="text-xs bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">.env.local</code> file with your Supabase credentials:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to Project Settings {'>'} API</li>
                    <li>Copy the "Project URL" and "anon/public" key</li>
                    <li>Update your .env.local file with these values</li>
                    <li>Restart your development server</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 