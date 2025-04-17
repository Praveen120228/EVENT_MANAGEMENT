'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AnalyticsDocs() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <Link href="/docs" className="hover:text-emerald-600">Docs</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/docs/events" className="hover:text-emerald-600">Events</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-emerald-600 font-medium">Analytics</span>
        </div>

        <h1 className="text-3xl font-bold mb-6">Event Analytics</h1>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-4">
              <h3 className="font-medium text-lg">On this page</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#overview" className="text-emerald-600 hover:underline">Overview</a>
                </li>
                <li>
                  <a href="#dashboard" className="text-emerald-600 hover:underline">Analytics Dashboard</a>
                </li>
                <li>
                  <a href="#attendance" className="text-emerald-600 hover:underline">Attendance Metrics</a>
                </li>
                <li>
                  <a href="#engagement" className="text-emerald-600 hover:underline">Engagement Analysis</a>
                </li>
                <li>
                  <a href="#reports" className="text-emerald-600 hover:underline">Custom Reports</a>
                </li>
              </ul>
              
              <h3 className="font-medium text-lg mt-8">Related</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/events/communications" className="text-emerald-600 hover:underline">Communications</Link>
                </li>
                <li>
                  <Link href="/docs/events/account-settings" className="text-emerald-600 hover:underline">Account Settings</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-12">
            <section id="overview">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="mb-4">
                Our analytics tools provide detailed insights into your event performance, helping you understand attendee behavior, measure engagement, and improve future events.
              </p>
              <p>
                Access analytics from the main dashboard or by navigating to <span className="font-medium">Events → [Your Event] → Analytics</span>.
              </p>
            </section>
            
            <section id="dashboard">
              <h2 className="text-2xl font-semibold mb-4">Analytics Dashboard</h2>
              <p className="mb-4">
                The analytics dashboard provides a comprehensive overview of your event metrics:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Real-time attendance tracking</li>
                <li>Registration conversion rates</li>
                <li>Communication engagement metrics</li>
                <li>Geographic distribution of attendees</li>
                <li>Device and platform usage</li>
                <li>Response rate trends</li>
              </ul>
              <p>
                The dashboard is customizable, allowing you to prioritize the metrics that matter most to your event.
              </p>
            </section>
            
            <section id="attendance">
              <h2 className="text-2xl font-semibold mb-4">Attendance Metrics</h2>
              <p className="mb-4">
                Track detailed attendance data throughout your event lifecycle:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Invitation to RSVP conversion rate</li>
                <li>RSVP to attendance conversion rate</li>
                <li>No-show percentage and patterns</li>
                <li>Check-in time distribution</li>
                <li>Attendee demographics (Pro and Enterprise plans)</li>
                <li>Comparative metrics against previous events (Pro and Enterprise plans)</li>
              </ul>
              <p>
                Use these insights to optimize your invitation strategy, guest list management, and check-in processes.
              </p>
            </section>
            
            <section id="engagement">
              <h2 className="text-2xl font-semibold mb-4">Engagement Analysis</h2>
              <p className="mb-4">
                Measure how attendees engage with your event content and communications:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Email open and click-through rates</li>
                <li>Event website page views and time spent</li>
                <li>Document download statistics</li>
                <li>Poll and survey participation rates</li>
                <li>Social media shares and mentions (Pro and Enterprise plans)</li>
                <li>Heatmaps of attendee activity (Enterprise plan only)</li>
              </ul>
              <p>
                These metrics help you understand which content resonates with your audience and how to improve engagement in future communications.
              </p>
            </section>
            
            <section id="reports">
              <h2 className="text-2xl font-semibold mb-4">Custom Reports</h2>
              <p className="mb-4">
                Create tailored reports to focus on specific aspects of your event:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Export data in multiple formats (CSV, Excel, PDF)</li>
                <li>Schedule automated report delivery</li>
                <li>Select specific metrics to include</li>
                <li>Filter data by date ranges, guest segments, or channels</li>
                <li>Compare performance across multiple events (Pro and Enterprise plans)</li>
                <li>White-label reporting for client presentation (Enterprise plan only)</li>
              </ul>
              <p className="mb-4">
                Custom reports can be shared with stakeholders or used for internal event performance reviews.
              </p>
              <p>
                Generate and manage reports from <span className="font-medium">Events → [Your Event] → Analytics → Reports</span>.
              </p>
            </section>
            
            <div className="flex justify-between pt-8 border-t">
              <Button variant="outline" asChild>
                <Link href="/docs/events/communications" className="flex items-center">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Communications
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/events/account-settings" className="flex items-center">
                  Account Settings
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