import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function AnalyticsDocPage() {
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
              <span className="text-gray-900 font-medium">Analytics</span>
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
                  <Link href="#dashboard" className="block text-sm hover:text-emerald-600 py-1">Analytics Dashboard</Link>
                  <Link href="#reports" className="block text-sm hover:text-emerald-600 py-1">Custom Reports</Link>
                  <Link href="#metrics" className="block text-sm hover:text-emerald-600 py-1">Key Metrics</Link>
                  <Link href="#export" className="block text-sm hover:text-emerald-600 py-1">Data Export</Link>
                </div>
                
                <div className="border-t border-gray-200 mt-6 pt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Documentation</p>
                  <Link href="/docs/getting-started" className="block text-sm hover:text-emerald-600 py-1">Getting Started</Link>
                  <Link href="/docs/events" className="block text-sm hover:text-emerald-600 py-1">Event Management</Link>
                  <Link href="/docs/guests" className="block text-sm hover:text-emerald-600 py-1">Guest Management</Link>
                  <Link href="/docs/communications" className="block text-sm hover:text-emerald-600 py-1">Communications</Link>
                  <Link href="/docs/analytics" className="block text-sm text-emerald-600 font-medium py-1">Analytics</Link>
                  <Link href="/docs/account" className="block text-sm hover:text-emerald-600 py-1">Account Settings</Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
                <h1 className="text-3xl font-bold tracking-tight mb-6">Analytics</h1>
                
                <div className="bg-emerald-50 p-4 rounded-lg mb-8">
                  <p className="text-emerald-800">
                    Gain valuable insights from your event data with our comprehensive analytics tools.
                  </p>
                </div>

                <section id="dashboard" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Analytics Dashboard</h2>
                  <p className="mb-4">
                    Get a high-level overview of your event performance with our intuitive dashboard.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>View important metrics at a glance with customizable widgets</li>
                    <li>Track RSVP rates and attendance patterns</li>
                    <li>Monitor communication engagement statistics</li>
                    <li>Analyze trends across multiple events</li>
                  </ul>
                  <p className="mb-4">
                    Access your Analytics Dashboard from the main navigation menu. You can customize the layout and select which metrics to display.
                  </p>
                </section>
                
                <section id="reports" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Custom Reports</h2>
                  <p className="mb-4">
                    Create tailored reports to focus on the metrics that matter most to you.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Build custom reports with specific metrics and timeframes</li>
                    <li>Schedule automatic report generation and delivery</li>
                    <li>Save report templates for repeated use</li>
                    <li>Share reports with team members or stakeholders</li>
                  </ul>
                </section>
                
                <section id="metrics" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Key Metrics</h2>
                  <p className="mb-4">
                    Understand the most important data points for measuring your event success.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>RSVP rate: Percentage of invitees who responded</li>
                    <li>Attendance rate: Percentage of confirmed guests who attended</li>
                    <li>Email engagement: Open rates, click rates, and response rates</li>
                    <li>Survey responses: Guest feedback and satisfaction metrics</li>
                    <li>Conversion metrics: Registration completion rates</li>
                  </ul>
                </section>
                
                <section id="export" className="mb-12 scroll-mt-20">
                  <h2 className="text-2xl font-bold tracking-tight mb-4">Data Export</h2>
                  <p className="mb-4">
                    Export your event data for external analysis or record-keeping.
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Export data in various formats (CSV, Excel, PDF)</li>
                    <li>Select specific data points to include in exports</li>
                    <li>Schedule automated data exports</li>
                    <li>Integrate with third-party analytics platforms</li>
                  </ul>
                </section>

                {/* Page Navigation */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <div className="flex justify-between">
                    <Button variant="ghost">
                      <Link href="/docs/communications" className="flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous: Communications
                      </Link>
                    </Button>
                    <Button variant="ghost">
                      <Link href="/docs/account" className="flex items-center">
                        Next: Account Settings
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