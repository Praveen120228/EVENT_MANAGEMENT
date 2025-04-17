import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization and validate (this should be restricted to admins)
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile || !profile.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    // Get the table to create from request body
    const { table } = await request.json()
    
    if (!table) {
      return NextResponse.json(
        { error: 'Table name is required' },
        { status: 400 }
      )
    }
    
    let result
    
    // Handle different table creation based on the table name
    switch (table) {
      case 'event_announcements':
        result = await createEventAnnouncementsTable(supabase)
        break
      default:
        return NextResponse.json(
          { error: `Unknown table: ${table}` },
          { status: 400 }
        )
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error creating table:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

async function createEventAnnouncementsTable(supabase: any) {
  // First check if table exists
  const { data: existingTable, error: checkError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'event_announcements')
    .maybeSingle()
  
  if (checkError) {
    return { 
      success: false, 
      error: `Error checking if table exists: ${checkError.message}` 
    }
  }
  
  if (existingTable) {
    return { 
      success: true, 
      message: 'Table already exists' 
    }
  }
  
  // Create the table using raw SQL
  const { error: createError } = await supabase.rpc('execute_sql', {
    sql_query: `
      -- Enable UUID extension if not already enabled
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      -- Create event_announcements table
      CREATE TABLE IF NOT EXISTS public.event_announcements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_by UUID REFERENCES auth.users(id),
        is_published BOOLEAN DEFAULT TRUE
      );
      
      -- Add RLS policies
      ALTER TABLE public.event_announcements ENABLE ROW LEVEL SECURITY;
      
      -- Policy for owners (can do anything)
      CREATE POLICY "Event owners can manage announcements" 
      ON public.event_announcements 
      USING (
        event_id IN (
          SELECT id FROM public.events 
          WHERE organizer_id = auth.uid()
        )
      );
      
      -- Policy for guests (can only read published announcements)
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
    `
  })
  
  if (createError) {
    return { 
      success: false, 
      error: `Error creating table: ${createError.message}` 
    }
  }
  
  return { 
    success: true, 
    message: 'Table created successfully' 
  }
} 