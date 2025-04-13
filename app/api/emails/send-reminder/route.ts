import { NextRequest, NextResponse } from 'next/server'
import { sendGuestReminderEmails } from '@/app/utils/email-service.server'

export async function POST(request: NextRequest) {
  try {
    const { eventId, guestIds, baseUrl } = await request.json()
    
    if (!eventId || !guestIds || !Array.isArray(guestIds) || !baseUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const results = await sendGuestReminderEmails(eventId, guestIds, baseUrl)
    
    return NextResponse.json({ 
      success: true, 
      results,
      successCount: results.filter(r => r.success).length,
      totalCount: results.length
    })
  } catch (error: any) {
    console.error('Send reminder email error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 