import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DocumentationNavProps {
  currentSection?: string;
}

export function DocumentationNav({ currentSection }: DocumentationNavProps) {
  const pathname = usePathname();
  
  // Determine active section based on the current path
  const isActive = (path: string) => {
    if (path === '/docs/getting-started' && pathname === '/docs/getting-started') {
      return true;
    }
    if (path === '/docs/events' && (pathname === '/docs/events' || pathname.startsWith('/docs/events/'))) {
      return true;
    }
    if (path === '/docs/guests' && (pathname === '/docs/guests' || pathname.startsWith('/docs/guests/'))) {
      return true;
    }
    if (path === '/docs/communications' && (pathname === '/docs/communications' || pathname.startsWith('/docs/communications/'))) {
      return true;
    }
    if (path === '/docs/analytics' && (pathname === '/docs/analytics' || pathname.startsWith('/docs/analytics/'))) {
      return true;
    }
    if (path === '/docs/account' && (pathname === '/docs/account' || pathname.startsWith('/docs/account/'))) {
      return true;
    }
    return false;
  };

  return (
    <div className="sticky top-20">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500 mb-2">On This Page</p>
        {currentSection === 'getting-started' && (
          <>
            <Link href="#overview" className="block text-sm hover:text-emerald-600 py-1">Platform Overview</Link>
            <Link href="#account" className="block text-sm hover:text-emerald-600 py-1">Creating an Account</Link>
            <Link href="#dashboard" className="block text-sm hover:text-emerald-600 py-1">Dashboard Navigation</Link>
            <Link href="#quickstart" className="block text-sm hover:text-emerald-600 py-1">Quick Start Guide</Link>
          </>
        )}
        {currentSection === 'events' && (
          <>
            <Link href="#creating" className="block text-sm hover:text-emerald-600 py-1">Creating Events</Link>
            <Link href="#types" className="block text-sm hover:text-emerald-600 py-1">Event Types</Link>
            <Link href="#rsvps" className="block text-sm hover:text-emerald-600 py-1">Managing RSVPs</Link>
            <Link href="#settings" className="block text-sm hover:text-emerald-600 py-1">Event Settings</Link>
          </>
        )}
        {currentSection === 'guests' && (
          <>
            <Link href="#adding" className="block text-sm hover:text-emerald-600 py-1">Adding Guests</Link>
            <Link href="#statuses" className="block text-sm hover:text-emerald-600 py-1">Guest Statuses</Link>
            <Link href="#bulk" className="block text-sm hover:text-emerald-600 py-1">Bulk Actions</Link>
            <Link href="#messaging" className="block text-sm hover:text-emerald-600 py-1">Guest Messaging</Link>
          </>
        )}
        {currentSection === 'communications' && (
          <>
            <Link href="#email-templates" className="block text-sm hover:text-emerald-600 py-1">Email Templates</Link>
            <Link href="#invitation" className="block text-sm hover:text-emerald-600 py-1">Invitation Emails</Link>
            <Link href="#reminders" className="block text-sm hover:text-emerald-600 py-1">Reminder Emails</Link>
            <Link href="#campaigns" className="block text-sm hover:text-emerald-600 py-1">Email Campaigns</Link>
          </>
        )}
        {currentSection === 'analytics' && (
          <>
            <Link href="#dashboard" className="block text-sm hover:text-emerald-600 py-1">Analytics Dashboard</Link>
            <Link href="#reports" className="block text-sm hover:text-emerald-600 py-1">Custom Reports</Link>
            <Link href="#metrics" className="block text-sm hover:text-emerald-600 py-1">Key Metrics</Link>
            <Link href="#export" className="block text-sm hover:text-emerald-600 py-1">Data Export</Link>
          </>
        )}
        {currentSection === 'account' && (
          <>
            <Link href="#profile" className="block text-sm hover:text-emerald-600 py-1">Profile Management</Link>
            <Link href="#subscription" className="block text-sm hover:text-emerald-600 py-1">Subscription Plans</Link>
            <Link href="#billing" className="block text-sm hover:text-emerald-600 py-1">Billing & Invoices</Link>
            <Link href="#security" className="block text-sm hover:text-emerald-600 py-1">Security Settings</Link>
            <Link href="#team" className="block text-sm hover:text-emerald-600 py-1">Team Management</Link>
          </>
        )}
        {/* Add any additional sections here */}
      </div>
      
      <div className="border-t border-gray-200 mt-6 pt-6">
        <p className="text-sm font-medium text-gray-500 mb-2">Documentation</p>
        
        <Link 
          href="/docs/getting-started" 
          className={`block text-sm py-1 ${isActive('/docs/getting-started') ? 'text-emerald-600 font-medium' : 'hover:text-emerald-600'}`}
        >
          Getting Started
        </Link>
        
        <Link 
          href="/docs/events" 
          className={`block text-sm py-1 ${isActive('/docs/events') ? 'text-emerald-600 font-medium' : 'hover:text-emerald-600'}`}
        >
          Event Management
        </Link>
        
        <Link 
          href="/docs/guests" 
          className={`block text-sm py-1 ${isActive('/docs/guests') ? 'text-emerald-600 font-medium' : 'hover:text-emerald-600'}`}
        >
          Guest Management
        </Link>
        
        <Link 
          href="/docs/communications" 
          className={`block text-sm py-1 ${isActive('/docs/communications') ? 'text-emerald-600 font-medium' : 'hover:text-emerald-600'}`}
        >
          Communications
        </Link>
        
        <Link 
          href="/docs/analytics" 
          className={`block text-sm py-1 ${isActive('/docs/analytics') ? 'text-emerald-600 font-medium' : 'hover:text-emerald-600'}`}
        >
          Analytics
        </Link>
        
        <Link 
          href="/docs/account" 
          className={`block text-sm py-1 ${isActive('/docs/account') ? 'text-emerald-600 font-medium' : 'hover:text-emerald-600'}`}
        >
          Account Settings
        </Link>
      </div>
    </div>
  );
} 