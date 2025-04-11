'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import DatabaseFixer from '@/app/dashboard/components/DatabaseFixer'

export default function DatabaseSettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    setLoading(false)
  }, [user, authLoading, router])

  if (loading || authLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost"
          onClick={() => router.push('/dashboard/settings')}
          className="mr-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Settings
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Database Tools</h1>
        <p className="text-gray-500">
          Advanced tools to fix issues with your database. Only use these if you're experiencing specific errors.
        </p>
      </div>

      <DatabaseFixer />

      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-medium mb-4">About Database Fixes</h2>
        <div className="prose prose-sm max-w-none">
          <p>
            These tools use Supabase RPC functions to fix common issues that might occur with your database. 
            They are completely safe to use and will only modify database elements that need to be fixed.
          </p>
          <p>
            <strong>When to use these tools:</strong>
          </p>
          <ul>
            <li>If you see errors about missing relationships between tables</li>
            <li>If you encounter messages about missing columns or constraints</li>
            <li>If you're instructed by support to run a specific fix</li>
          </ul>
          <p>
            After running a fix, you might need to refresh your application or log out and back in to see the changes take effect.
          </p>
        </div>
      </div>
    </div>
  )
} 