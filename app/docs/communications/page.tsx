import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function CommunicationsDocPage() {
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
              <span className="text-gray-900 font-medium">Communications</span>
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
                  <Link href="#email-templates" className="block text-sm hover:text-emerald-600 py-1">Email Templates</Link>
                  <Link href="#announcements" className="block text-sm hover:text-emerald-600 py-1">Event Announcements</Link>
                  <Link href="#reminders" className="block text-sm hover:text-emerald-600 py-1">RSVP Reminders</Link>
                  <Link href="#customization" className="block text-sm hover:text-emerald-600 py-1">Message Customization</Link>
                </div>
                
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Documentation</p>
                  <Link href="/docs/getting-started" className="block text-sm hover:text-emerald-600 py-1">Getting Started</Link>
                  <Link href="/docs/events" className="block text-sm hover:text-emerald-600 py-1">Event Management</Link>
                  <Link href="/docs/guests" className="block text-sm hover:text-emerald-600 py-1">Guest Management</Link>
                  <Link href="/docs/communications" className="block text-sm text-emerald-600 font-medium py-1">Communications</Link>
                  <Link href="/docs/analytics" className="block text-sm hover:text-emerald-600 py-1">Analytics</Link>
                  <Link href="/docs/account" className="block text-sm hover:text-emerald-600 py-1">Account Settings</Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Communications</h1>
                
                <div className="bg-emerald-50 p-4 rounded-lg mb-8">
                  <p className="text-emerald-800">
                    Learn how to effectively communicate with your guests before, during, and after your events.
                  </p>
                </div>

                <section id="email-templates" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Email Templates</h2>
                  <p className="mb-4">
                    Create and manage reusable email templates for consistent communications.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Access pre-designed templates for common event communications</li>
                    <li>Customize templates with your branding and messaging</li>
                    <li>Preview emails before sending to ensure proper formatting</li>
                    <li>Save custom templates for future use</li>
                  </ul>
                  <p className="mb-4">
                    To manage your email templates, navigate to the Communications section in your dashboard. From there, you can create new templates or edit existing ones.
                  </p>
                </section>
                
                <section id="announcements" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Event Announcements</h2>
                  <p className="mb-4">
                    Keep your guests informed with targeted announcements.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Send updates about event details, changes, or special instructions</li>
                    <li>Schedule announcements in advance</li>
                    <li>Target specific guest segments with relevant information</li>
                    <li>Track announcement delivery and open rates</li>
                  </ul>
                </section>
                
                <section id="reminders" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">RSVP Reminders</h2>
                  <p className="mb-4">
                    Increase response rates with automated reminder emails.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Set up automatic reminders for pending RSVPs</li>
                    <li>Configure reminder frequency and timing</li>
                    <li>Customize reminder content for each event</li>
                    <li>Send final reminders to confirmed guests as the event approaches</li>
                  </ul>
                </section>
                
                <section id="customization" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Message Customization</h2>
                  <p className="mb-4">
                    Personalize your communications for better engagement.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Use dynamic fields to personalize messages (guest name, event details, etc.)</li>
                    <li>Add your logo and brand colors to all communications</li>
                    <li>Incorporate custom images and formatting</li>
                    <li>Include interactive elements like buttons and survey links</li>
                  </ul>
                </section>

                {/* Page Navigation */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <div className="flex justify-between">
                    <Button variant="ghost">
                      <Link href="/docs/guests" className="flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous: Guest Management
                      </Link>
                    </Button>
                    <Button variant="ghost">
                      <Link href="/docs/analytics" className="flex items-center">
                        Next: Analytics
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