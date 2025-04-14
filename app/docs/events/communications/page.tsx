'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/components/documentation-layout';

export default function CommunicationsDocs() {
  return (
    <DocumentationLayout 
      section="communications" 
      title="Communications" 
      isSubSection={true}
      parentSection="events"
    >
      <h1 className="text-3xl font-bold mb-6">Event Communications</h1>
      
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          Effective communication is key to successful event management. Our platform provides powerful tools to create, send, and track communications with your event attendees.
        </p>
        <p>
          Access communication features from the main dashboard or by navigating to <span className="font-medium">Events → [Your Event] → Communications</span>.
        </p>
      </section>
      
      <section id="email-templates" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Email Templates</h2>
        <p className="mb-4">
          Create professional and engaging emails with our template system:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Pre-designed templates for common event communications</li>
          <li>Customizable layouts with drag-and-drop editor</li>
          <li>Brand customization with logo, colors, and fonts</li>
          <li>Dynamic content with personalization tags</li>
          <li>Mobile-responsive designs for all devices</li>
        </ul>
        <p className="mb-4">
          Our template library includes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Save the Date announcements</li>
          <li>Formal invitations</li>
          <li>Registration confirmations</li>
          <li>Event reminders</li>
          <li>Post-event thank you messages</li>
          <li>Feedback requests</li>
        </ul>
      </section>
      
      <section id="invitation-management" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Invitation Management</h2>
        <p className="mb-4">
          Create and manage digital invitations that drive engagement:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Customizable invitation designs</li>
          <li>RSVP tracking with response options</li>
          <li>Personalized guest information</li>
          <li>QR codes for check-in</li>
          <li>Calendar integration (Google, Apple, Outlook)</li>
          <li>Automatic reminders for non-responders</li>
        </ul>
        <p>
          Manage all invitations from <span className="font-medium">Events → [Your Event] → Communications → Invitations</span>.
        </p>
      </section>
      
      <section id="automated-messaging" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Automated Messaging</h2>
        <p className="mb-4">
          Set up automated communication workflows based on time or user actions:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Time-based sequences (e.g., 1 week before event, day of event)</li>
          <li>Trigger-based emails (e.g., after registration, upon check-in)</li>
          <li>Conditional messaging based on guest attributes</li>
          <li>Multi-channel communication (email, SMS*, push notifications*)</li>
          <li>A/B testing for messaging optimization (Pro and Enterprise plans)</li>
        </ul>
        <p className="mb-4">
          <span className="text-sm italic">*SMS and push notifications available on Pro and Enterprise plans only</span>
        </p>
        <p>
          Set up automation sequences from <span className="font-medium">Events → [Your Event] → Communications → Automation</span>.
        </p>
      </section>
      
      <section id="engagement-tracking" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Engagement Tracking</h2>
        <p className="mb-4">
          Monitor how recipients interact with your communications:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Email delivery and open rates</li>
          <li>Click-through tracking on links</li>
          <li>RSVP and registration conversion rates</li>
          <li>Engagement analytics dashboard</li>
          <li>Detailed individual recipient activity</li>
          <li>Comparative performance metrics (Pro and Enterprise plans)</li>
        </ul>
        <p className="mb-4">
          Use engagement data to optimize your communication strategy and increase attendance rates.
        </p>
        <p>
          View engagement metrics from <span className="font-medium">Events → [Your Event] → Communications → Analytics</span>.
        </p>
      </section>
      
      <div className="flex justify-between pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href="/docs/events/guest-management" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Guest Management
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/docs/events/analytics" className="flex items-center">
            Analytics
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </DocumentationLayout>
  );
} 