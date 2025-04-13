import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { generateGuestInvitationEmail, generateGuestReminderEmail } from "./email-templates"
import nodemailer from 'nodemailer'
import 'server-only'

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
  const supabase = createServerComponentClient({ cookies })
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
        
        // Send the actual email
        await transporter.sendMail({
          from: `"Specyf Events" <${process.env.EMAIL_FROM || 'events@specyf.com'}>`,
          to: guest.email,
          subject,
          html: body,
        });
        
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
  const supabase = createServerComponentClient({ cookies })
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
        
        // Send the actual email
        await transporter.sendMail({
          from: `"Specyf Events" <${process.env.EMAIL_FROM || 'events@specyf.com'}>`,
          to: guest.email,
          subject,
          html: body,
        });
        
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