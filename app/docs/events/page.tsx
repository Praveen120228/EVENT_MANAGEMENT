import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function EventsDocPage() {
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
              <span className="text-gray-900 font-medium">Event Management</span>
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
                  <Link href="#creating" className="block text-sm hover:text-emerald-600 py-1">Creating Events</Link>
                  <Link href="#types" className="block text-sm hover:text-emerald-600 py-1">Event Types</Link>
                  <Link href="#rsvps" className="block text-sm hover:text-emerald-600 py-1">Managing RSVPs</Link>
                  <Link href="#settings" className="block text-sm hover:text-emerald-600 py-1">Event Settings</Link>
                </div>
                
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Documentation</p>
                  <Link href="/docs/getting-started" className="block text-sm hover:text-emerald-600 py-1">Getting Started</Link>
                  <Link href="/docs/events" className="block text-sm text-emerald-600 font-medium py-1">Event Management</Link>
                  <Link href="/docs/guests" className="block text-sm hover:text-emerald-600 py-1">Guest Management</Link>
                  <Link href="/docs/communications" className="block text-sm hover:text-emerald-600 py-1">Communications</Link>
                  <Link href="/docs/analytics" className="block text-sm hover:text-emerald-600 py-1">Analytics</Link>
                  <Link href="/docs/account" className="block text-sm hover:text-emerald-600 py-1">Account Settings</Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
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
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 