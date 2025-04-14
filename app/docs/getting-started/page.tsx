'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentationLayout } from '@/components/documentation-layout';

export default function GettingStartedPage() {
  return (
    <DocumentationLayout section="getting-started" title="Getting Started">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Getting Started with Specyf</h1>
      
      <div className="bg-emerald-50 p-4 rounded-lg mb-8">
        <p className="text-emerald-800">
          Welcome to Specyf! This guide will help you get started with our platform and show you how to
          create and manage your first event.
        </p>
      </div>

      {/* Platform Overview */}
      <section id="overview" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Platform Overview</h2>
        <p className="mb-4">
          Specyf is an all-in-one event management platform designed to simplify every aspect of running successful events. 
          From creating invitations to tracking RSVPs, managing guest lists, and communicating with attendees, 
          our platform provides the tools you need to ensure your events run smoothly.
        </p>
        
        <div className="bg-white border rounded-lg overflow-hidden my-6">
          <div className="aspect-video relative bg-gray-100">
            {/* Placeholder for an image of the platform dashboard */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              Platform Dashboard Preview
            </div>
          </div>
        </div>
        
        <p className="mb-4">
          With Specyf, you can:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Create events of various types with customized settings</li>
          <li>Manage guest lists with detailed tracking of responses</li>
          <li>Send personalized invitations and communications</li>
          <li>Create polls and collect feedback from attendees</li>
          <li>Access real-time analytics to track engagement</li>
          <li>Organize team members and assign specific roles</li>
        </ul>
      </section>

      {/* Creating an Account */}
      <section id="account" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Creating an Account</h2>
        <p className="mb-4">
          Getting started with Specyf is easy. Follow these steps to create your account:
        </p>
        
        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <strong>Sign Up</strong>: Visit our <Link href="/auth/signup" className="text-emerald-600 hover:underline">signup page</Link> and enter your email address.
          </li>
          <li>
            <strong>Verify Your Email</strong>: Check your inbox for a verification email and click the link to confirm your account.
          </li>
          <li>
            <strong>Complete Your Profile</strong>: Add your name, organization details, and profile picture.
          </li>
          <li>
            <strong>Choose Your Plan</strong>: Select from our available subscription plans or start with the free trial.
          </li>
        </ol>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">
              <strong>Note</strong>: All new accounts include a 14-day free trial of our Pro features. No credit card is required to get started.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Dashboard Navigation */}
      <section id="dashboard" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Dashboard Navigation</h2>
        <p className="mb-4">
          After logging in, you'll be taken to your dashboard which serves as your command center for all event activities.
        </p>
        
        <div className="grid gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Main Navigation</h3>
            <p className="text-gray-600 mb-2">The left sidebar contains the main navigation menu:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Home</strong>: Overview of your upcoming events and recent activity</li>
              <li><strong>Events</strong>: List of all your events with creation and management options</li>
              <li><strong>Guests</strong>: Central guest management across all events</li>
              <li><strong>Communications</strong>: Email templates and messaging history</li>
              <li><strong>Analytics</strong>: Insights and reports for your events</li>
              <li><strong>Settings</strong>: Account configurations and preferences</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Top Bar Features</h3>
            <p className="text-gray-600 mb-2">The top navigation bar provides quick access to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Profile Menu</strong>: Account settings and logout options</li>
              <li><strong>Notifications</strong>: Updates on guest responses and system alerts</li>
              <li><strong>Search</strong>: Find events, guests, or content quickly</li>
              <li><strong>Help</strong>: Access to documentation and support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section id="quickstart" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Start Guide</h2>
        <p className="mb-4">
          Ready to create your first event? Here's how to get up and running in minutes:
        </p>
        
        <div className="bg-white rounded-lg border overflow-hidden mb-8">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="font-medium">Creating Your First Event</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 rounded-full bg-emerald-100 text-emerald-600 h-6 w-6 flex items-center justify-center mr-3 mt-1">1</div>
              <div>
                <h4 className="font-medium">Navigate to Events</h4>
                <p className="text-gray-600">From your dashboard, click on "Events" in the sidebar menu.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 rounded-full bg-emerald-100 text-emerald-600 h-6 w-6 flex items-center justify-center mr-3 mt-1">2</div>
              <div>
                <h4 className="font-medium">Create New Event</h4>
                <p className="text-gray-600">Click the "Create Event" button in the top-right corner.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 rounded-full bg-emerald-100 text-emerald-600 h-6 w-6 flex items-center justify-center mr-3 mt-1">3</div>
              <div>
                <h4 className="font-medium">Choose Event Type</h4>
                <p className="text-gray-600">Select the type of event you're planning (workshop, corporate event, wedding, etc.).</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 rounded-full bg-emerald-100 text-emerald-600 h-6 w-6 flex items-center justify-center mr-3 mt-1">4</div>
              <div>
                <h4 className="font-medium">Enter Basic Details</h4>
                <p className="text-gray-600">Fill in the event name, date, time, and location information.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 rounded-full bg-emerald-100 text-emerald-600 h-6 w-6 flex items-center justify-center mr-3 mt-1">5</div>
              <div>
                <h4 className="font-medium">Add Guests</h4>
                <p className="text-gray-600">Add guests individually or import them from a spreadsheet.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 rounded-full bg-emerald-100 text-emerald-600 h-6 w-6 flex items-center justify-center mr-3 mt-1">6</div>
              <div>
                <h4 className="font-medium">Send Invitations</h4>
                <p className="text-gray-600">Create an invitation message and send it to your guests.</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mb-6">
          After creating your event, you can access the event dashboard to track RSVPs, send updates, 
          and manage all aspects of your event.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline">
            <Link href="/docs/events">Learn More About Events</Link>
          </Button>
        </div>
      </section>

      {/* Next Steps */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-bold mb-4">Next Steps</h3>
        <p className="mb-4">
          Now that you're familiar with the basics, explore these topics to make the most of Specyf:
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link href="/docs/events">
            <div className="border rounded-lg p-4 hover:border-emerald-500 hover:shadow-sm transition-all">
              <h4 className="font-medium flex items-center">
                <ChevronRight className="h-4 w-4 text-emerald-500 mr-1" />
                Event Management
              </h4>
              <p className="text-sm text-gray-500">Create and manage different types of events</p>
            </div>
          </Link>
          
          <Link href="/docs/guests">
            <div className="border rounded-lg p-4 hover:border-emerald-500 hover:shadow-sm transition-all">
              <h4 className="font-medium flex items-center">
                <ChevronRight className="h-4 w-4 text-emerald-500 mr-1" />
                Guest Management
              </h4>
              <p className="text-sm text-gray-500">Handle guest lists and RSVPs effectively</p>
            </div>
          </Link>
          
          <Link href="/docs/communications">
            <div className="border rounded-lg p-4 hover:border-emerald-500 hover:shadow-sm transition-all">
              <h4 className="font-medium flex items-center">
                <ChevronRight className="h-4 w-4 text-emerald-500 mr-1" />
                Communications
              </h4>
              <p className="text-sm text-gray-500">Create effective emails and announcements</p>
            </div>
          </Link>
          
          <Link href="/docs/analytics">
            <div className="border rounded-lg p-4 hover:border-emerald-500 hover:shadow-sm transition-all">
              <h4 className="font-medium flex items-center">
                <ChevronRight className="h-4 w-4 text-emerald-500 mr-1" />
                Analytics & Reporting
              </h4>
              <p className="text-sm text-gray-500">Understanding event performance data</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="border-t border-gray-200 pt-8 mt-12">
        <div className="flex justify-between">
          <Button variant="ghost" disabled>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="ghost">
            <Link href="/docs/events" className="flex items-center">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </DocumentationLayout>
  );
} 