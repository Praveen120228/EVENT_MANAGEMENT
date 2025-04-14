'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';
import { DocumentationNav } from './documentation-nav';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface DocumentationLayoutProps {
  children: ReactNode;
  section: 'getting-started' | 'events' | 'guests' | 'communications' | 'analytics' | 'account';
  title: string;
  isSubSection?: boolean;
  parentSection?: string;
}

export function DocumentationLayout({ 
  children, 
  section, 
  title,
  isSubSection = false,
  parentSection = ''
}: DocumentationLayoutProps) {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Documentation', href: '/docs' },
  ];
  
  if (isSubSection && parentSection) {
    // If this is a subsection (like events/communications), add the parent section to breadcrumb
    const parentTitle = parentSection.charAt(0).toUpperCase() + parentSection.slice(1);
    breadcrumbItems.push({ label: parentTitle, href: `/docs/${parentSection}` });
  }
  
  // Add the current section as the final item
  breadcrumbItems.push({ label: title, href: '' });
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4 border-b">
          <div className="container px-4 md:px-6">
            <div className="flex items-center text-sm text-gray-500">
              {breadcrumbItems.map((item, index) => (
                <span key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                  {index === breadcrumbItems.length - 1 ? (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-gray-900">
                      {item.label}
                    </Link>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <DocumentationNav currentSection={section} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose max-w-none">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 