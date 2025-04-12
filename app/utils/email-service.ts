import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { generateGuestInvitationEmail, generateGuestReminderEmail } from "./email-templates"
import nodemailer from 'nodemailer'

interface Guest {
  id: string;
  event_id: string;
  name: string;
  email: string;
  status: 'pending' | 'confirmed' | 'declined';
  response_date: string | null;
  message: string | null;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string | null;
  location: string | null;
  organizer_id: string;
  organizer_name: string | null;
}

interface EmailResult {
  success: boolean;
  email: string;
  error?: string;
}

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send invitation emails to guests for an event
 * @param eventId The ID of the event
 * @param guestIds Array of guest IDs to send invitations to
 * @param baseUrl The base URL of the application (for generating links)
 */
export async function sendGuestInvitationEmails(
  eventId: string,
  guestIds: string[],
  baseUrl: string
): Promise<EmailResult[]> {
  const supabase = createClientComponentClient()
  const results: EmailResult[] = [];
  
  try {
    // First, get the event details
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle()
    
    if (eventError) throw new Error(`Failed to fetch event: ${eventError.message}`)
    if (!eventData) throw new Error('Event not found')
    
    // Get the guest details for all the selected guests
    const { data: guestsData, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId)
      .in('id', guestIds)
    
    if (guestsError) throw new Error(`Failed to fetch guests: ${guestsError.message}`)
    if (!guestsData || guestsData.length === 0) throw new Error('No guests found')
    
    // Send emails to each guest
    for (const guest of guestsData) {
      try {
        const { subject, body } = generateGuestInvitationEmail({
          eventTitle: eventData.title,
          eventDate: eventData.date,
          eventTime: eventData.time || undefined,
          eventLocation: eventData.location || undefined,
          eventDescription: eventData.description || undefined,
          guestName: guest.name,
          organizerName: eventData.organizer_name || 'The Event Organizer',
          responseLink: `${baseUrl}/guest/response/${eventId}/${guest.id}`
        });
        
        if (process.env.NODE_ENV === 'production') {
          // Send the actual email in production
          await transporter.sendMail({
            from: `"Specyf Events" <${process.env.EMAIL_FROM || 'events@specyf.com'}>`,
            to: guest.email,
            subject,
            html: body,
          });
        } else {
          // Just log the email in development
          console.log(`[DEV] Sending invitation email to ${guest.email}:`, { subject, body });
        }
        
        results.push({ 
          success: true, 
          email: guest.email 
        });
      } catch (err: any) {
        console.error(`Failed to send invitation to ${guest.email}:`, err);
        results.push({ 
          success: false, 
          email: guest.email,
          error: err.message || 'Unknown error'
        });
      }
    }
    
    // Log this communication in the database
    await supabase.from('email_logs').insert({
      event_id: eventId,
      type: 'invitation',
      sent_at: new Date().toISOString(),
      recipient_count: guestsData.length,
      success_count: results.filter(r => r.success).length
    });
    
    return results;
  } catch (error: any) {
    console.error('Error sending invitation emails:', error)
    throw error
  }
}

/**
 * Send reminder emails to guests for an event
 * @param eventId The ID of the event
 * @param guestIds Array of guest IDs to send reminders to
 * @param baseUrl The base URL of the application (for generating links)
 */
export async function sendGuestReminderEmails(
  eventId: string,
  guestIds: string[],
  baseUrl: string
): Promise<EmailResult[]> {
  const supabase = createClientComponentClient()
  const results: EmailResult[] = [];
  
  try {
    // First, get the event details
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle()
    
    if (eventError) throw new Error(`Failed to fetch event: ${eventError.message}`)
    if (!eventData) throw new Error('Event not found')
    
    // Get the guest details for all the selected guests
    const { data: guestsData, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .eq('event_id', eventId)
      .in('id', guestIds)
    
    if (guestsError) throw new Error(`Failed to fetch guests: ${guestsError.message}`)
    if (!guestsData || guestsData.length === 0) throw new Error('No guests found')
    
    // Send emails to each guest
    for (const guest of guestsData) {
      try {
        const { subject, body } = generateGuestReminderEmail({
          eventTitle: eventData.title,
          eventDate: eventData.date,
          eventTime: eventData.time || undefined,
          eventLocation: eventData.location || undefined,
          guestName: guest.name,
          responseLink: `${baseUrl}/guest/response/${eventId}/${guest.id}`
        });
        
        if (process.env.NODE_ENV === 'production') {
          // Send the actual email in production
          await transporter.sendMail({
            from: `"Specyf Events" <${process.env.EMAIL_FROM || 'events@specyf.com'}>`,
            to: guest.email,
            subject,
            html: body,
          });
        } else {
          // Just log the email in development
          console.log(`[DEV] Sending reminder email to ${guest.email}:`, { subject, body });
        }
        
        results.push({ 
          success: true, 
          email: guest.email 
        });
      } catch (err: any) {
        console.error(`Failed to send reminder to ${guest.email}:`, err);
        results.push({ 
          success: false, 
          email: guest.email,
          error: err.message || 'Unknown error'
        });
      }
    }
    
    // Log this communication in the database
    await supabase.from('email_logs').insert({
      event_id: eventId,
      type: 'reminder',
      sent_at: new Date().toISOString(),
      recipient_count: guestsData.length,
      success_count: results.filter(r => r.success).length
    });
    
    return results;
  } catch (error: any) {
    console.error('Error sending reminder emails:', error)
    throw error
  }
}

/**
 * Send an announcement email to all guests for an event
 * @param eventId The ID of the event
 * @param announcementTitle The announcement title
 * @param announcementContent The announcement content
 * @param baseUrl The base URL of the application
 */
export async function sendAnnouncementEmail(
  eventId: string,
  announcementTitle: string,
  announcementContent: string,
  baseUrl: string
): Promise<EmailResult[]> {
  const supabase = createClientComponentClient()
  const results: EmailResult[] = [];
  
  try {
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
    
    const subject = `[${eventData.title}] ${announcementTitle}`;
    
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
        `;
        
        if (process.env.NODE_ENV === 'production') {
          // Send the actual email in production
          await transporter.sendMail({
            from: `"Specyf Events" <${process.env.EMAIL_FROM || 'events@specyf.com'}>`,
            to: guest.email,
            subject,
            html: body,
          });
        } else {
          // Just log the email in development
          console.log(`[DEV] Sending announcement email to ${guest.email}:`, { subject });
        }
        
        results.push({ 
          success: true, 
          email: guest.email 
        });
      } catch (err: any) {
        console.error(`Failed to send announcement to ${guest.email}:`, err);
        results.push({ 
          success: false, 
          email: guest.email,
          error: err.message || 'Unknown error'
        });
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
    });
    
    // Insert the announcement into the event_announcements table
    await supabase.from('event_announcements').insert({
      event_id: eventId,
      title: announcementTitle,
      content: announcementContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    return results;
  } catch (error: any) {
    console.error('Error sending announcement emails:', error)
    throw error
  }
} 