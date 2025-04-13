import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { eventId, announcementTitle, announcementContent, baseUrl } = await request.json()
    
    if (!eventId || !announcementTitle || !announcementContent || !baseUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const supabase = createServerComponentClient({ cookies })
    const results = [] as Array<{ success: boolean; email: string; error?: string }>
    
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    
    // Get the event details
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle()
    
    if (eventError) throw new Error(`Failed to fetch event: ${eventError.message}`)
    if (!eventData) throw new Error('Event not found')
    
    // Get all guests for this event
    const { data: guestsData, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId)
    
    if (guestsError) throw new Error(`Failed to fetch guests: ${guestsError.message}`)
    if (!guestsData || guestsData.length === 0) throw new Error('No guests found')
    
    const subject = `[${eventData.title}] ${announcementTitle}`
    
    // Send emails to each guest
    for (const guest of guestsData) {
      try {
        // Create HTML email body with announcement
        const body = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header { 
              background-color: #10b981; 
              color: white; 
              padding: 20px;
              border-radius: 5px 5px 0 0;
              text-align: center;
            }
            .content { 
              padding: 20px;
              border: 1px solid #ddd;
              border-top: none;
              border-radius: 0 0 5px 5px;
            }
            .button {
              background-color: #10b981;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 4px;
              display: inline-block;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              margin-top: 20px;
              font-size: 0.8em;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${announcementTitle}</h1>
          </div>
          <div class="content">
            <p>Hello ${guest.name},</p>
            
            <p>There's an update about <strong>${eventData.title}</strong>:</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f8f8; border-left: 4px solid #10b981;">
              ${announcementContent.replace(/\n/g, '<br />')}
            </div>

            <a href="${baseUrl}/guest/events/${eventId}?guestId=${guest.id}" class="button">View Event Details</a>
            
            <p>Best regards,<br>The Event Team</p>
          </div>
          <div class="footer">
            <p>This announcement was sent via Specyf, an event management platform.</p>
            <p>If you've already responded or believe you received this in error, please disregard this email.</p>
          </div>
        </body>
        </html>
        `
        
        // Send the actual email
        await transporter.sendMail({
          from: `"Specyf Events" <${process.env.EMAIL_FROM || 'events@specyf.com'}>`,
          to: guest.email,
          subject,
          html: body,
        })
        
        results.push({ 
          success: true, 
          email: guest.email 
        })
      } catch (err: any) {
        console.error(`Failed to send announcement to ${guest.email}:`, err)
        results.push({ 
          success: false, 
          email: guest.email,
          error: err.message || 'Unknown error'
        })
      }
    }
    
    // Log this communication in the database
    await supabase.from('email_logs').insert({
      event_id: eventId,
      type: 'announcement',
      subject: announcementTitle,
      content: announcementContent,
      sent_at: new Date().toISOString(),
      recipient_count: guestsData.length,
      success_count: results.filter(r => r.success).length
    })
    
    // Insert the announcement into the event_announcements table
    await supabase.from('event_announcements').insert({
      event_id: eventId,
      title: announcementTitle,
      content: announcementContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    return NextResponse.json({ 
      success: true, 
      results,
      successCount: results.filter(r => r.success).length,
      totalCount: results.length
    })
  } catch (error: any) {
    console.error('Send announcement email error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
} 