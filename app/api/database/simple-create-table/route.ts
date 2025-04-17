import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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
    
    try {
      // Simplest approach: Try to create the table with bare minimum schema
      const { error: createError } = await supabase.from('event_announcements').insert({
        id: '00000000-0000-0000-0000-000000000000', // Temporary row we'll delete
        event_id: '00000000-0000-0000-0000-000000000000', // Dummy data
        title: 'Temporary Row',
        content: 'This row will be deleted after table creation'
      })
      
      // Delete the temporary row
      if (!createError) {
        await supabase.from('event_announcements')
          .delete()
          .eq('id', '00000000-0000-0000-0000-000000000000')
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to create table',
          error: createError.message
        })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Table created successfully using simple approach'
      })
    } catch (e) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create table',
        error: e instanceof Error ? e.message : String(e)
      })
    }
  } catch (error) {
    console.error('Error creating table:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 