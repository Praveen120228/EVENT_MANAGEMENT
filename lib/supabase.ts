'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

// Create a single instance of the Supabase client
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Helper function to validate URL
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Create a function to get the Supabase client
export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>()
  }
  return supabaseClient
}

// Export a singleton instance for convenience
export const supabase = getSupabaseClient()

// Export a function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey && !!supabase && isValidUrl(supabaseUrl)
}

// Helper function to get detailed configuration status
export function getSupabaseConfigStatus() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const urlSet = !!url
  const keySet = !!key
  const urlValid = urlSet ? isValidUrl(url) : false
  
  return {
    urlSet,
    keySet,
    urlValid,
    isConfigured: urlSet && keySet && urlValid
  }
}

// Helper function to test database connection
export async function testDatabaseConnection() {
  try {
    if (!supabase) {
      return { error: 'Supabase client not initialized' }
    }

    // Try to fetch a simple query that should always work
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1)
    
    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Helper function to get a more user-friendly error message
export function getSupabaseErrorMessage(error: any) {
  const status = getSupabaseConfigStatus()
  
  if (!status.urlSet || !status.keySet) {
    return 'Database connection is not configured. Please check your environment variables.'
  }
  
  if (!status.urlValid) {
    return 'Invalid database URL format. Please check your configuration.'
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'An unexpected error occurred. Please try again.'
} 