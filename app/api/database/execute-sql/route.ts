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
    
    // Get the SQL from request body
    const { sql } = await request.json()
    
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL query is required' },
        { status: 400 }
      )
    }
    
    // Create the event_announcements table directly
    const createTableSQL = `
      DO $$
      BEGIN
        -- Create the table if it doesn't exist
        IF NOT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'event_announcements'
        ) THEN
          CREATE TABLE public.event_announcements (
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
        END IF;
      END
      $$;
    `
    
    // Execute the SQL directly
    const { error } = await supabase.rpc('pg_query', { query: createTableSQL })
    
    if (error) {
      console.error('SQL execution error:', error)
      return NextResponse.json(
        { error: `Failed to execute SQL: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'SQL executed successfully - event_announcements table has been created'
    })
    
  } catch (error) {
    console.error('Error executing SQL:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 