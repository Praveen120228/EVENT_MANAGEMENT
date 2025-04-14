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
      description: "Email templates and messaging strategies",
      icon: MessageSquare,
      sections: [
        { title: "Email Templates", href: "/docs/communications#templates" },
        { title: "Invitation Emails", href: "/docs/communications#invitations" },
        { title: "Reminder Emails", href: "/docs/communications#reminders" },
        { title: "Email Campaigns", href: "/docs/communications#campaigns" },
      ]
    },
    {
      title: "Analytics",
      description: "Track performance and gather insights",
      icon: BarChart,
      sections: [
        { title: "Event Analytics", href: "/docs/analytics#events" },
        { title: "Guest Reporting", href: "/docs/analytics#guests" },
        { title: "Email Performance", href: "/docs/analytics#emails" },
        { title: "Data Export", href: "/docs/analytics#export" },
      ]
    },
    {
      title: "Account Settings",
      description: "Manage your account and team members",
      icon: Settings,
      sections: [
        { title: "Profile Management", href: "/docs/account#profile" },
        { title: "Subscription Plans", href: "/docs/account#subscription" },
        { title: "Team Management", href: "/docs/account#team" },
        { title: "Billing & Invoices", href: "/docs/account#billing" },
      ]
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12">
          <h1 className="text-3xl font-bold mb-2">Documentation</h1>
          <p className="text-gray-500 mb-12">
            Get to know Specyf and learn how to use all its features.
          </p>

          {/* Getting Started Highlight Box */}
          <div className="bg-emerald-50 p-6 rounded-lg mb-12 border border-emerald-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-emerald-800 mb-2">New to Specyf?</h2>
                <p className="text-emerald-700 mb-2">
                  Start with our comprehensive guide to get your account set up and create your first event in minutes.
                </p>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href="/docs/getting-started">
                  Getting Started Guide
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docsCategories.map((category, index) => (
              <Card key={index} className="border h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-2">
                      <category.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.sections.map((section, i) => (
                      <li key={i}>
                        <Link href={section.href} className="text-sm text-emerald-600 hover:underline flex items-center">
                          <span className="mr-1">•</span> {section.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href={`/docs/${category.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-emerald-700 font-medium hover:text-emerald-800 flex items-center">
                      View {category.title} Documentation
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 