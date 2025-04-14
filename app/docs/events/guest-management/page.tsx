'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/components/documentation-layout';

export default function GuestManagementDocs() {
  return (
    <DocumentationLayout 
      section="guests" 
      title="Guest Management" 
      isSubSection={true}
      parentSection="events"
    >
      <h1 className="text-3xl font-bold mb-6">Guest Management</h1>
      
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          Our guest management system helps you efficiently organize and track attendees for your events. From creating guest lists to managing RSVPs and check-ins, our platform provides all the tools you need for comprehensive guest management.
        </p>
        <p>
          Access guest management features from the event dashboard by selecting an event and clicking on the <span className="font-medium">Guests</span> tab.
        </p>
      </section>
      
      <section id="adding-guests" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Adding Guests</h2>
        <p className="mb-4">
          Multiple options for adding guests to your event:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">Individual entries:</span> Add guests one by one with detailed information.
          </li>
          <li>
            <span className="font-medium">Bulk import:</span> Upload a CSV or Excel file with guest information.
          </li>
          <li>
            <span className="font-medium">Copy and paste:</span> Add multiple guests by pasting comma-separated or line-separated data.
          </li>
          <li>
            <span className="font-medium">Import from contacts:</span> Import guests from your contact list or previous events.
          </li>
          <li>
            <span className="font-medium">Self-registration:</span> Allow guests to register through a shareable link.
          </li>
        </ul>
        <p>
          For each guest, you can collect standard information (name, email, phone) and custom fields based on your event needs.
        </p>
      </section>
      
      <section id="guest-lists" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Managing Guest Lists</h2>
        <p className="mb-4">
          Organize your guests effectively:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">Segmentation:</span> Create different guest categories (VIP, Regular, Press, etc.).
          </li>
          <li>
            <span className="font-medium">Filtering:</span> Filter guests by status, category, or custom attributes.
          </li>
          <li>
            <span className="font-medium">Searching:</span> Quickly find guests using the search function.
          </li>
          <li>
            <span className="font-medium">Editing:</span> Update guest information individually or in bulk.
          </li>
          <li>
            <span className="font-medium">Exporting:</span> Export guest lists in various formats (CSV, Excel, PDF).
          </li>
          <li>
            <span className="font-medium">Duplication check:</span> Automatic detection of duplicate entries.
          </li>
        </ul>
        <p>
          Guest list capacity varies by subscription plan:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Starter plan: Up to 50 guests per event</li>
          <li>Pro Organizer plan: Up to 250 guests per event</li>
          <li>Event Pro+ plan: Up to 2000 guests per event</li>
        </ul>
      </section>
      
      <section id="rsvp" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">RSVP Tracking</h2>
        <p className="mb-4">
          Track guest responses and attendance plans:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">RSVP status tracking:</span> Monitor who has responded (Attending, Not Attending, Maybe).
          </li>
          <li>
            <span className="font-medium">Customizable RSVP forms:</span> Collect additional information during RSVP.
          </li>
          <li>
            <span className="font-medium">Plus-one management:</span> Allow guests to bring additional attendees.
          </li>
          <li>
            <span className="font-medium">Automated reminders:</span> Send reminders to guests who haven't responded.
          </li>
          <li>
            <span className="font-medium">RSVP deadline:</span> Set a cutoff date for responses.
          </li>
          <li>
            <span className="font-medium">Waiting list:</span> Manage overflow guests when event capacity is reached.
          </li>
        </ul>
        <p>
          RSVP tracking allows you to plan effectively and make informed decisions about venue size, catering, and other logistics.
        </p>
      </section>
      
      <section id="check-in" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Guest Check-in</h2>
        <p className="mb-4">
          Streamline the arrival process:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <span className="font-medium">Mobile check-in app:</span> Check guests in using a smartphone or tablet.
          </li>
          <li>
            <span className="font-medium">QR code check-in:</span> Scan guest QR codes sent with confirmations.
          </li>
          <li>
            <span className="font-medium">Self-check-in kiosk:</span> Set up a kiosk for guests to check themselves in.
          </li>
          <li>
            <span className="font-medium">Check-in analytics:</span> Monitor arrival patterns and peak check-in times.
          </li>
          <li>
            <span className="font-medium">Special instructions:</span> Add notes for specific guests (seating, allergies, etc.).
          </li>
          <li>
            <span className="font-medium">Name tag printing:</span> Print name tags upon check-in (Pro Organizer and Event Pro+ plans).
          </li>
        </ul>
        <p>
          The check-in system provides real-time attendance tracking and helps identify no-shows or unexpected guests.
        </p>
      </section>
      
      <div className="flex justify-between pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href="/docs/events/account-settings" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Account Settings
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs/events/communications" className="flex items-center">
            Communications
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </DocumentationLayout>
  );
} 