'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function GuestManagementDocs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/docs" className="hover:text-emerald-600">
            Documentation
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <Link href="/docs/events" className="hover:text-emerald-600">
            Events
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-emerald-600 font-medium">Guest Management</span>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <aside className="md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="font-medium mb-4">On This Page</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#overview" className="text-gray-600 hover:text-emerald-600">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="#adding-guests" className="text-gray-600 hover:text-emerald-600">
                    Adding Guests
                  </Link>
                </li>
                <li>
                  <Link href="#managing-guests" className="text-gray-600 hover:text-emerald-600">
                    Managing Guests
                  </Link>
                </li>
                <li>
                  <Link href="#bulk-operations" className="text-gray-600 hover:text-emerald-600">
                    Bulk Operations
                  </Link>
                </li>
                <li>
                  <Link href="#tracking-rsvp" className="text-gray-600 hover:text-emerald-600">
                    Tracking RSVP Status
                  </Link>
                </li>
              </ul>

              <h3 className="font-medium mt-8 mb-4">Related Topics</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs/events/communications" className="text-gray-600 hover:text-emerald-600">
                    Communications
                  </Link>
                </li>
                <li>
                  <Link href="/docs/events/analytics" className="text-gray-600 hover:text-emerald-600">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Guest Management</h1>
            
            <section id="overview" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Overview</h2>
              <p className="mb-4">
                The Guest Management feature allows you to add, edit, and track your event attendees. You can add guests individually or in bulk, 
                send invitations, and track RSVP status.
              </p>
            </section>
            
            <section id="adding-guests" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Adding Guests</h2>
              <p className="mb-4">
                There are several ways to add guests to your event:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Add individual guests manually</li>
                <li>Import guests from a CSV file</li>
                <li>Bulk add guests by pasting a list of emails</li>
              </ul>
              <p className="mb-4">
                To add an individual guest:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li>Navigate to your event dashboard</li>
                <li>Click on the "Guests" tab</li>
                <li>Click the "Add Guest" button</li>
                <li>Fill in the guest's name and email address</li>
                <li>Click "Save" to add the guest</li>
              </ol>
            </section>
            
            <section id="managing-guests" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Managing Guests</h2>
              <p className="mb-4">
                Once guests are added, you can:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Edit guest information</li>
                <li>Delete guests from the event</li>
                <li>Send invitation emails</li>
                <li>Mark guests as VIPs</li>
              </ul>
              <p className="mb-4">
                To edit a guest's information:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li>Find the guest in your guest list</li>
                <li>Click the "Edit" button next to their name</li>
                <li>Update their information</li>
                <li>Click "Save" to apply changes</li>
              </ol>
            </section>
            
            <section id="bulk-operations" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Bulk Operations</h2>
              <p className="mb-4">
                You can perform operations on multiple guests at once:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Select multiple guests using checkboxes</li>
                <li>Send invitations to all selected guests</li>
                <li>Remove multiple guests at once</li>
                <li>Export selected guests to CSV</li>
              </ul>
              <p className="mb-4">
                For bulk adding guests:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li>Click the "Bulk Add" button</li>
                <li>Paste a list of emails or names and emails</li>
                <li>The system will validate the format</li>
                <li>Click "Add Guests" to complete the process</li>
              </ol>
            </section>
            
            <section id="tracking-rsvp" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold tracking-tight mb-4">Tracking RSVP Status</h2>
              <p className="mb-4">
                Monitor the RSVP status of your guests:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Pending: Guest has not responded</li>
                <li>Attending: Guest has confirmed attendance</li>
                <li>Declined: Guest has declined the invitation</li>
                <li>Maybe: Guest has responded with "Maybe"</li>
              </ul>
              <p className="mb-4">
                You can filter your guest list by RSVP status to see who has responded and who hasn't. This helps you follow up with guests who haven't responded yet.
              </p>
            </section>
            
            <div className="flex justify-between mt-10 pt-6 border-t">
              <Button asChild variant="outline">
                <Link href="/docs/events">
                  <ChevronLeft size={16} className="mr-2" />
                  Events
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/docs/events/communications">
                  Communications
                  <ChevronRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 