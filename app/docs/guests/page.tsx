import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function GuestsDocPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex items-center text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link href="/docs" className="hover:text-gray-900">Documentation</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-gray-900 font-medium">Guest Management</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">On This Page</p>
                  <Link href="#inviting" className="block text-sm hover:text-emerald-600 py-1">Inviting Guests</Link>
                  <Link href="#tracking" className="block text-sm hover:text-emerald-600 py-1">Tracking Responses</Link>
                  <Link href="#bulk" className="block text-sm hover:text-emerald-600 py-1">Bulk Guest Management</Link>
                  <Link href="#templates" className="block text-sm hover:text-emerald-600 py-1">Guest List Templates</Link>
                </div>
                
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Documentation</p>
                  <Link href="/docs/getting-started" className="block text-sm hover:text-emerald-600 py-1">Getting Started</Link>
                  <Link href="/docs/events" className="block text-sm hover:text-emerald-600 py-1">Event Management</Link>
                  <Link href="/docs/guests" className="block text-sm text-emerald-600 font-medium py-1">Guest Management</Link>
                  <Link href="/docs/communications" className="block text-sm hover:text-emerald-600 py-1">Communications</Link>
                  <Link href="/docs/analytics" className="block text-sm hover:text-emerald-600 py-1">Analytics</Link>
                  <Link href="/docs/account" className="block text-sm hover:text-emerald-600 py-1">Account Settings</Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Guest Management</h1>
                
                <div className="bg-emerald-50 p-4 rounded-lg mb-8">
                  <p className="text-emerald-800">
                    Learn how to efficiently manage guests for your events, from inviting attendees to tracking responses.
                  </p>
                </div>

                <section id="inviting" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Inviting Guests</h2>
                  <p className="mb-4">
                    Learn how to add guests individually or import them from external sources.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Add guests individually with name, email, and optional details</li>
                    <li>Send personalized invitations directly through the platform</li>
                    <li>Import guest lists from CSV files or spreadsheets</li>
                    <li>Create custom invitation links for sharing</li>
                  </ul>
                  <p className="mb-4">
                    To invite guests to your event, navigate to your event dashboard and select the "Guests" tab. From there, you can add guests manually or import a list.
                  </p>
                </section>
                
                <section id="tracking" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Tracking Responses</h2>
                  <p className="mb-4">
                    Monitor your guest list and keep track of RSVPs in real-time.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Track confirmed, declined, and pending responses</li>
                    <li>View response statistics and attendance projections</li>
                    <li>Send follow-up reminders to guests who haven't responded</li>
                    <li>Set guest capacity limits with waitlist functionality</li>
                  </ul>
                </section>
                
                <section id="bulk" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Bulk Guest Management</h2>
                  <p className="mb-4">
                    Efficiently handle large guest lists with bulk operations.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Bulk invite guests using CSV templates</li>
                    <li>Send batch communications to filtered guest segments</li>
                    <li>Export guest data for external processing</li>
                    <li>Perform bulk status updates for multiple guests</li>
                  </ul>
                </section>
                
                <section id="templates" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Guest List Templates</h2>
                  <p className="mb-4">
                    Save time by creating reusable guest list templates.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Create and save templates for different event types</li>
                    <li>Apply saved templates to new events with one click</li>
                    <li>Share templates across your organization</li>
                    <li>Update templates as your guest lists evolve</li>
                  </ul>
                </section>

                {/* Page Navigation */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <div className="flex justify-between">
                    <Button variant="ghost">
                      <Link href="/docs/events" className="flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous: Event Management
                      </Link>
                    </Button>
                    <Button variant="ghost">
                      <Link href="/docs/communications" className="flex items-center">
                        Next: Communications
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 