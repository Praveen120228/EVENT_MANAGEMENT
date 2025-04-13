import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get Supabase instance
    const supabase = createServerSupabaseClient()
    
    // Insert contact form data into database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        { 
          name, 
          email, 
          subject, 
          message, 
          status: 'new', 
          created_at: new Date().toISOString() 
        }
      ])
      .select()
    
    if (error) {
      console.error('Error saving contact form:', error)
      return NextResponse.json(
        { error: 'Failed to save your message' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Your message has been received' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 