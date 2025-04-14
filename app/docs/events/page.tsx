'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/components/documentation-layout';

export default function EventsDocPage() {
  return (
    <DocumentationLayout section="events" title="Event Management">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Event Management</h1>
      
      <div className="bg-emerald-50 p-4 rounded-lg mb-8">
        <p className="text-emerald-800">
          This section covers everything you need to know about creating and managing events in Specyf.
        </p>
      </div>

      {/* Content sections would go here - replaced with placeholder */}
      <section id="creating" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Creating Events</h2>
        <p className="mb-4">
          This section will guide you through the process of creating various types of events in Specyf.
        </p>
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-center">This section is under development. <br/>Check back soon for detailed content!</p>
        </div>
      </section>
      
      <section id="types" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Event Types</h2>
        <p className="mb-4">
          Learn about the different event types supported by Specyf and their unique features.
        </p>
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-center">This section is under development. <br/>Check back soon for detailed content!</p>
        </div>
      </section>
      
      <section id="rsvps" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Managing RSVPs</h2>
        <p className="mb-4">
          Discover how to track and manage RSVPs for your events efficiently.
        </p>
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-center">This section is under development. <br/>Check back soon for detailed content!</p>
        </div>
      </section>
      
      <section id="settings" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Event Settings</h2>
        <p className="mb-4">
          Explore the various configuration options available for your events.
        </p>
        <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-center">This section is under development. <br/>Check back soon for detailed content!</p>
        </div>
      </section>

      {/* Page Navigation */}
      <div className="border-t border-gray-200 pt-8 mt-12">
        <div className="flex justify-between">
          <Button variant="ghost">
            <Link href="/docs/getting-started" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous: Getting Started
            </Link>
          </Button>
          <Button variant="ghost">
            <Link href="/docs/guests" className="flex items-center">
              Next: Guest Management
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </DocumentationLayout>
  );
} 