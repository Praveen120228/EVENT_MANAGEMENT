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
    
    // First check if table exists
    const { data: tableExists, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'event_announcements')
      .maybeSingle()
    
    if (!tableExists) {
      return NextResponse.json({
        success: false,
        message: 'Table does not exist, please create it first'
      })
    }
    
    // Get events for this user
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title')
      .eq('organizer_id', user.id)
      .limit(5)
    
    if (eventsError || !events || events.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No events found to add announcements to'
      })
    }
    
    // Add sample announcements for each event
    let successCount = 0
    let errorCount = 0
    
    for (const event of events) {
      try {
        const { error: insertError } = await supabase
          .from('event_announcements')
          .insert({
            event_id: event.id,
            title: `Important update for ${event.title}`,
            content: 'This is a sample announcement to test the feature. It was automatically created by the database fix tool.',
            created_by: user.id,
            is_published: true
          })
        
        if (!insertError) {
          successCount++
        } else {
          errorCount++
        }
      } catch (e) {
        errorCount++
      }
    }
    
    return NextResponse.json({
      success: successCount > 0,
      message: `Added ${successCount} sample announcements${errorCount > 0 ? ` (${errorCount} failed)` : ''}`
    })
    
  } catch (error) {
    console.error('Error seeding announcements:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 