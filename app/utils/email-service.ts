/**
 * Client-side email service
 * This file contains functions for sending emails via API calls
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { generateGuestInvitationEmail, generateGuestReminderEmail } from "./email-templates"

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

interface EmailResponse {
  success: boolean;
  results: EmailResult[];
  successCount: number;
  totalCount: number;
  error?: string;
}

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
): Promise<EmailResponse> {
  try {
    const response = await fetch('/api/emails/send-invitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        guestIds,
        baseUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send invitation emails');
    }

    return data;
  } catch (error: any) {
    console.error('Error sending invitation emails:', error);
    throw error;
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
): Promise<EmailResponse> {
  try {
    const response = await fetch('/api/emails/send-reminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        guestIds,
        baseUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send reminder emails');
    }

    return data;
  } catch (error: any) {
    console.error('Error sending reminder emails:', error);
    throw error;
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
): Promise<EmailResponse> {
  try {
    const response = await fetch('/api/emails/send-announcement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        announcementTitle,
        announcementContent,
        baseUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send announcement emails');
    }

    return data;
  } catch (error: any) {
    console.error('Error sending announcement emails:', error);
    throw error;
  }
} 