import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Create a Supabase client with the service role key
// This allows us to bypass RLS policies and perform privileged operations
const getServiceSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or service role key not configured')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()
    const { fixType, adminToken } = body
    
    // Simple security check - in production you would use a more secure authorization method
    const expectedToken = process.env.ADMIN_API_TOKEN
    if (!expectedToken || adminToken !== expectedToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get the service role client
    const supabase = getServiceSupabase()
    
    // Run the appropriate fix based on the fixType
    if (fixType === 'events-profiles') {
      // Run the fix for events-profiles relationship
      const { data, error } = await supabase.rpc('fix_events_profiles_relationship')
      
      if (error) {
        console.error('Error fixing events-profiles relationship:', error)
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to fix events-profiles relationship',
            error: error.message,
            details: error.details || error.hint
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(data)
    } else if (fixType === 'sub-events') {
      // Run the fix for sub_events table
      const { data, error } = await supabase.rpc('fix_sub_events_table')
      
      if (error) {
        console.error('Error fixing sub_events table:', error)
        return NextResponse.json(
          { 
            success: false, 
            message: 'Failed to fix sub_events table',
            error: error.message,
            details: error.details || error.hint
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { success: false, message: 'Unknown fix type' },
        { status: 400 }
      )
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred',
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 