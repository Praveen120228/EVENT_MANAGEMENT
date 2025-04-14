'use client';

import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/components/documentation-layout';

export default function AccountDocPage() {
  return (
    <DocumentationLayout section="account" title="Account Settings">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Account Settings</h1>
      
      <div className="bg-emerald-50 p-4 rounded-lg mb-8">
        <p className="text-emerald-800">
          Manage your account preferences, subscription details, and team members in one convenient location.
        </p>
      </div>

      <section id="profile" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Profile Management</h2>
        <p className="mb-4">
          Keep your personal information up to date and customize your platform experience.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Update your name, email, and contact information</li>
          <li>Change your profile picture</li>
          <li>Manage notification preferences</li>
          <li>Set default language and timezone</li>
        </ul>
        <p className="mb-4">
          Access your profile settings by clicking on your account avatar in the top-right corner of the dashboard and selecting "Profile Settings."
        </p>
      </section>
      
      <section id="subscription" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Subscription Plans</h2>
        <p className="mb-4">
          View and manage your current subscription plan and explore upgrade options.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>See your current plan details and usage limits</li>
          <li>Compare available plans and features</li>
          <li>Upgrade or downgrade your subscription</li>
          <li>View subscription history</li>
        </ul>
        <p className="mb-4">
          Navigate to Account Settings {'>'}  Subscription to manage your subscription details.
        </p>
      </section>
      
      <section id="billing" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Billing & Invoices</h2>
        <p className="mb-4">
          Manage your payment methods and access your billing history.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Add or update payment methods</li>
          <li>View and download past invoices</li>
          <li>Update billing address and information</li>
          <li>Set automatic payment preferences</li>
        </ul>
        <p className="mb-4">
          Access billing information by navigating to Account Settings {'>'}  Billing.
        </p>
      </section>
      
      <section id="security" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Security Settings</h2>
        <p className="mb-4">
          Protect your account with enhanced security features.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Change your password</li>
          <li>Enable two-factor authentication</li>
          <li>Manage connected apps and services</li>
          <li>View account activity logs</li>
        </ul>
      </section>
      
      <section id="team" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Team Management</h2>
        <p className="mb-4">
          Invite team members and manage their roles and permissions.
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Invite new team members via email</li>
          <li>Assign and modify user roles (Admin, Editor, Viewer)</li>
          <li>Set custom permissions for specific events</li>
          <li>Remove team members when needed</li>
        </ul>
        <p className="mb-4">
          Team management features are available on Pro and Enterprise plans. Access these settings from Account Settings {'>'}  Team Management.
        </p>
      </section>

      {/* Page Navigation */}
      <div className="border-t border-gray-200 pt-8 mt-12">
        <div className="flex justify-between">
          <Button variant="ghost">
            <Link href="/docs/analytics" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous: Analytics
            </Link>
          </Button>
          <Button variant="ghost">
            <Link href="/docs/getting-started" className="flex items-center">
              Next: Getting Started
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </DocumentationLayout>
  );
} 