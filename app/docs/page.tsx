import Link from 'next/link';
import { ChevronRight, Book, Users, Calendar, Settings, MessageSquare, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function DocsPage() {
  const docsCategories = [
    {
      title: "Getting Started",
      description: "Learn the basics of Specyf and set up your first event",
      icon: Book,
      sections: [
        { title: "Platform Overview", href: "/docs/getting-started#overview" },
        { title: "Creating an Account", href: "/docs/getting-started#account" },
        { title: "Dashboard Navigation", href: "/docs/getting-started#dashboard" },
        { title: "Quick Start Guide", href: "/docs/getting-started#quickstart" },
      ]
    },
    {
      title: "Event Management",
      description: "Create and manage events effortlessly",
      icon: Calendar,
      sections: [
        { title: "Creating Events", href: "/docs/events#creating" },
        { title: "Event Types", href: "/docs/events#types" },
        { title: "Managing RSVPs", href: "/docs/events#rsvps" },
        { title: "Event Settings", href: "/docs/events#settings" },
      ]
    },
    {
      title: "Guest Management",
      description: "Handle guest lists and communications",
      icon: Users,
      sections: [
        { title: "Adding Guests", href: "/docs/guests#adding" },
        { title: "Guest Statuses", href: "/docs/guests#statuses" },
        { title: "Bulk Actions", href: "/docs/guests#bulk" },
        { title: "Guest Messaging", href: "/docs/guests#messaging" },
      ]
    },
    {
      title: "Communications",
      description: "Send invitations and event updates",
      icon: MessageSquare,
      sections: [
        { title: "Email Templates", href: "/docs/communications#templates" },
        { title: "Sending Invitations", href: "/docs/communications#invitations" },
        { title: "Event Updates", href: "/docs/communications#updates" },
        { title: "Guest Responses", href: "/docs/communications#responses" },
      ]
    },
    {
      title: "Analytics",
      description: "Track event performance and engagement",
      icon: BarChart,
      sections: [
        { title: "Event Analytics", href: "/docs/analytics#events" },
        { title: "Guest Engagement", href: "/docs/analytics#engagement" },
        { title: "Response Metrics", href: "/docs/analytics#responses" },
        { title: "Reports & Exports", href: "/docs/analytics#reports" },
      ]
    },
    {
      title: "Account Settings",
      description: "Manage your account and preferences",
      icon: Settings,
      sections: [
        { title: "Profile Settings", href: "/docs/account#profile" },
        { title: "Subscription Management", href: "/docs/account#subscription" },
        { title: "Team Members", href: "/docs/account#team" },
        { title: "Security", href: "/docs/account#security" },
      ]
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Specyf Documentation</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                  Everything you need to know about using the Specyf platform to manage your events.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-center">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/docs/getting-started">Get Started Guide</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {docsCategories.map((category, i) => {
                const Icon = category.icon;
                return (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <Icon className="h-8 w-8 text-emerald-500 mb-2" />
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.sections.map((section, j) => (
                          <li key={j}>
                            <Link 
                              href={section.href}
                              className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center"
                            >
                              <ChevronRight className="h-4 w-4 mr-1" />
                              {section.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Links & Resources */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter">Popular Resources</h2>
              <p className="text-gray-500 md:text-xl/relaxed max-w-[700px] mx-auto mt-2">
                Frequently accessed guides and tutorials to help you get the most out of Specyf.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/docs/getting-started#quickstart">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">Quick Start Guide</h3>
                  <p className="text-gray-500 text-sm">Get your first event up and running in minutes</p>
                </div>
              </Link>
              
              <Link href="/docs/guests#adding">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">Managing Guest Lists</h3>
                  <p className="text-gray-500 text-sm">Learn how to efficiently manage your event attendees</p>
                </div>
              </Link>
              
              <Link href="/docs/communications#templates">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">Email Templates</h3>
                  <p className="text-gray-500 text-sm">Create beautiful email templates for your events</p>
                </div>
              </Link>
              
              <Link href="/docs/analytics#reports">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg mb-2">Event Analytics</h3>
                  <p className="text-gray-500 text-sm">Track and analyze your event performance</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter">Video Tutorials</h2>
              <p className="text-gray-500 md:text-xl/relaxed max-w-[700px] mx-auto mt-2">
                Watch and learn with our detailed video guides.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="rounded-full size-12 flex items-center justify-center" variant="secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span className="sr-only">Play</span>
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">Getting Started with Specyf</h3>
                  <p className="text-gray-500 text-sm mt-1">A complete walkthrough of the platform</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="rounded-full size-12 flex items-center justify-center" variant="secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span className="sr-only">Play</span>
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">Creating Your First Event</h3>
                  <p className="text-gray-500 text-sm mt-1">Step-by-step guide to event creation</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="rounded-full size-12 flex items-center justify-center" variant="secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span className="sr-only">Play</span>
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg">Advanced Guest Management</h3>
                  <p className="text-gray-500 text-sm mt-1">Learn all the guest management features</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
              <p className="text-gray-500 md:text-xl/relaxed max-w-[700px] mx-auto mt-2">
                Common questions about using the Specyf platform.
              </p>
            </div>
            
            <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium text-lg mb-2">How do I create my first event?</h3>
                  <p className="text-gray-500">
                    Creating an event is simple. Just log in to your dashboard, click on the "Create Event" button,
                    and follow the step-by-step guide to set up your event details.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium text-lg mb-2">Can I invite guests without them creating an account?</h3>
                  <p className="text-gray-500">
                    Yes! Guests don't need to create an account to RSVP to your events. They will receive an email invitation
                    with a unique link that allows them to respond directly.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium text-lg mb-2">How do I send reminders to my guests?</h3>
                  <p className="text-gray-500">
                    You can schedule automatic reminders or send manual updates through the Communications tab in your
                    event dashboard. Set the timing and customize the message for your guests.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium text-lg mb-2">What types of events can I create?</h3>
                  <p className="text-gray-500">
                    Specyf supports various event types including corporate events, workshops, meetups, conferences,
                    weddings, and private gatherings. Each type comes with tailored features.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium text-lg mb-2">How can I track guest responses?</h3>
                  <p className="text-gray-500">
                    All guest responses are tracked in real-time in your guest management dashboard. You'll see
                    statistics for confirmed, declined, and pending responses with detailed breakdowns.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-medium text-lg mb-2">Can I export my guest list?</h3>
                  <p className="text-gray-500">
                    Yes, you can export your guest list and their responses to CSV or Excel format at any time from
                    the guest management page of your event.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Help & Support */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Need More Help?</h2>
              <p className="text-gray-500 md:text-xl/relaxed max-w-[700px] mx-auto mb-8">
                Our support team is ready to assist you with any questions you might have.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline">
                  <Link href="/docs/faq">View All FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
} 