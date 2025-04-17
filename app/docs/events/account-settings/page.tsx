'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AccountSettingsDocs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-emerald-600">Docs</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/docs/events" className="hover:text-emerald-600">Events</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-emerald-600 font-medium">Account Settings</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-4">
              <h3 className="font-medium text-lg">On this page</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#overview" className="text-emerald-600 hover:underline">Overview</a>
                </li>
                <li>
                  <a href="#profile" className="text-emerald-600 hover:underline">Profile Management</a>
                </li>
                <li>
                  <a href="#subscription" className="text-emerald-600 hover:underline">Subscription Plans</a>
                </li>
                <li>
                  <a href="#team" className="text-emerald-600 hover:underline">Team Management</a>
                </li>
                <li>
                  <a href="#branding" className="text-emerald-600 hover:underline">Branding & Customization</a>
                </li>
              </ul>
              
              <h3 className="font-medium text-lg mt-8">Related</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/events/analytics" className="text-emerald-600 hover:underline">Analytics</Link>
                </li>
                <li>
                  <Link href="/docs/events/guest-management" className="text-emerald-600 hover:underline">Guest Management</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-12">
            <section id="overview">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                Account settings allow you to manage your profile information, subscription details, team permissions, and customize your event branding.
              </p>
              <p>
                Access account settings by clicking on your profile icon in the top right corner and selecting <span className="font-medium">Account Settings</span> from the dropdown menu.
              </p>
            </section>
            
            <section id="profile">
              <h2 className="text-2xl font-semibold mb-4">Profile Management</h2>
              <p className="mb-4">
                Manage your personal information and account security:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Update personal details (name, email, phone number)</li>
                <li>Change password and set up two-factor authentication</li>
                <li>Manage notification preferences</li>
                <li>Set default time zone and language</li>
                <li>Link social media accounts for easy login</li>
                <li>View account activity log</li>
              </ul>
              <p>
                Keep your contact information up to date to ensure you receive important notifications about your events and account.
              </p>
            </section>
            
            <section id="subscription">
              <h2 className="text-2xl font-semibold mb-4">Subscription Plans</h2>
              <p className="mb-4">
                Manage your subscription and billing information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>View current plan details and usage limits</li>
                <li>Upgrade or downgrade your subscription</li>
                <li>Update payment methods</li>
                <li>View billing history and download invoices</li>
                <li>Set up automatic renewals</li>
                <li>Apply promotional codes or discounts</li>
              </ul>
              <p className="mb-4">
                Our flexible subscription options include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Starter:</span> Free plan with basic features for small events (up to 2 events/month, 50 guests/event)</li>
                <li><span className="font-medium">Pro Organizer:</span> ₹299/month for growing event organizers (up to 10 events/month, 250 guests/event)</li>
                <li><span className="font-medium">Event Pro+:</span> ₹799/month for professional event managers (unlimited events, up to 2000 guests/event)</li>
              </ul>
            </section>
            
            <section id="team">
              <h2 className="text-2xl font-semibold mb-4">Team Management</h2>
              <p className="mb-4">
                Collaborate with team members by assigning roles and permissions:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Invite team members to your account</li>
                <li>Assign role-based permissions:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Admin: Full access to all features and settings</li>
                    <li>Event Manager: Create and manage events, but cannot modify account settings</li>
                    <li>Content Creator: Edit event content and communications</li>
                    <li>Guest Manager: Manage guest lists and RSVPs</li>
                    <li>Viewer: View-only access to events and analytics</li>
                  </ul>
                </li>
                <li>Remove team members or update their permissions</li>
                <li>Set event-specific access permissions</li>
                <li>Track team member activity</li>
              </ul>
              <p>
                Team management features are available on Pro Organizer and Event Pro+ plans.
              </p>
            </section>
            
            <section id="branding">
              <h2 className="text-2xl font-semibold mb-4">Branding & Customization</h2>
              <p className="mb-4">
                Customize your event materials with your brand identity:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Upload your logo and set brand colors</li>
                <li>Customize email templates with your branding</li>
                <li>Set default email signature</li>
                <li>Create custom URL for event pages (Pro and Event Pro+ plans)</li>
                <li>Remove platform branding (Event Pro+ plan only)</li>
                <li>Set up custom domain (Event Pro+ plan only)</li>
              </ul>
              <p>
                Consistent branding across all touchpoints helps create a professional and cohesive experience for your event attendees.
              </p>
            </section>
            
            <div className="flex justify-between pt-8 border-t">
              <Button variant="outline" asChild>
                <Link href="/docs/events/analytics" className="flex items-center">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/events/guest-management" className="flex items-center">
                  Guest Management
                  <ChevronRight className="ml-2 h-4 w-4" />
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