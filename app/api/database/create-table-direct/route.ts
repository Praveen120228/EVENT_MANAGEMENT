import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // First check if table already exists to avoid error
    const { data: existingTable, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'event_announcements')
      .maybeSingle()
    
    if (existingTable) {
      return NextResponse.json({
        success: true,
        message: 'Table already exists'
      })
    }
    
    // Use fetch to directly access Supabase API
    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!apiKey || !projectUrl) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }
    
    // Get JWT token for REST API authorization
    const { data: { session } } = await supabase.auth.getSession()
    const authToken = session?.access_token
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication token missing' },
        { status: 401 }
      )
    }
    
    // Make REST API call to create table
    const response = await fetch(`${projectUrl}/rest/v1/rpc/create_event_announcements_table`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({})
    })
    
    if (!response.ok) {
      let errorText = 'Failed to create table'
      try {
        const errorData = await response.json()
        errorText = errorData.message || errorText
      } catch (e) {}
      
      // If REST API fails, try SQL approach
      await createTableWithSQL(supabase)
      
      // If we reach here, the SQL approach worked
      return NextResponse.json({
        success: true,
        message: 'Table created successfully using backup method'
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Table created successfully'
    })
    
  } catch (error) {
    console.error('Error creating table:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

async function createTableWithSQL(supabase: any) {
  // Try to create the table by running multiple simple queries directly
  
  // 1. First create the table
  await supabase.schema.createTable('event_announcements', [
    { name: 'id', type: 'uuid', primaryKey: true, defaultValue: { type: 'uuid_generate_v4' } },
    { name: 'event_id', type: 'uuid', notNull: true, references: 'events.id', onDelete: 'cascade' },
    { name: 'title', type: 'text', notNull: true },
    { name: 'content', type: 'text', notNull: true },
    { name: 'created_at', type: 'timestamptz', defaultValue: { type: 'now' } },
    { name: 'updated_at', type: 'timestamptz', defaultValue: { type: 'now' } },
    { name: 'created_by', type: 'uuid', references: 'auth.users.id' },
    { name: 'is_published', type: 'boolean', defaultValue: true }
  ])
  
  // 2. Enable RLS
  await supabase.query(`
    ALTER TABLE public.event_announcements ENABLE ROW LEVEL SECURITY;
  `)
  
  // 3. Add policy for owners
  await supabase.query(`
    CREATE POLICY "Event owners can manage announcements" 
    ON public.event_announcements 
    USING (
      event_id IN (
        SELECT id FROM public.events 
        WHERE organizer_id = auth.uid()
      )
    );
  `)
  
  // 4. Add policy for guests
  await supabase.query(`
    CREATE POLICY "Guests can view published announcements" 
    ON public.event_announcements 
    FOR SELECT
    USING (
      is_published = TRUE AND
      event_id IN (
        SELECT event_id FROM public.guests
        WHERE email = (
          SELECT email FROM auth.users
          WHERE id = auth.uid()
        )
      )
    );
  `)
} 