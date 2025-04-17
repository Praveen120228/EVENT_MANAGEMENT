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
    
    // Get announcement data from request
    const { eventId, title, content } = await request.json()
    
    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }
    
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }
    
    // Verify user has access to this event
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .eq('organizer_id', user.id)
      .single()
    
    if (eventError || !eventData) {
      return NextResponse.json(
        { error: 'You do not have permission to create announcements for this event' },
        { status: 403 }
      )
    }
    
    // Insert the announcement
    const { data: announcement, error: insertError } = await supabase
      .from('event_announcements')
      .insert({
        event_id: eventId,
        title: title.trim(),
        content: content.trim(),
        created_by: user.id,
        is_published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Failed to insert announcement:', insertError)
      return NextResponse.json(
        { error: 'Failed to create announcement' },
        { status: 500 }
      )
    }
    
    // Get the count of guests for this event for the response
    const { count: guestCount, error: countError } = await supabase
      .from('guests')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
    
    return NextResponse.json({
      success: true,
      message: `Announcement sent to ${guestCount || 0} guests`,
      data: announcement
    })
    
  } catch (error) {
    console.error('Error sending announcement:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 