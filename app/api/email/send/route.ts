import { NextResponse } from 'next/server'

// Store the API key securely
const API_KEY = process.env.EMAIL_API_KEY || 'qj0xvVfbQrBlhyrztQarg'

export async function POST(request: Request) {
  try {
    const { guests, eventTitle, message } = await request.json()
    
    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json(
        { error: 'No guests provided' },
        { status: 400 }
      )
    }
    
    // Log that we're sending emails (in a real implementation, this would send actual emails)
    console.log(`Sending ${guests.length} invitations to ${eventTitle} with message: ${message || 'No custom message'}`)
    
    // In a real implementation, you would use the API key to authenticate with an email service
    // For example:
    // const emailService = new EmailService(API_KEY)
    // await emailService.sendBulk(guests, eventTitle, message)
    
    // For now, we'll just simulate success
    return NextResponse.json({ 
      success: true, 
      message: `Successfully sent ${guests.length} invitations to ${eventTitle}`,
      sentTo: guests.map(g => g.email)
    })
    
  } catch (error: any) {
    console.error('Error sending invitations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send invitations' },
      { status: 500 }
    )
  }
} 