'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Settings, BarChart3, LayoutDashboard, MessageSquare } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check if user is an admin by email
  useEffect(() => {
    async function checkAdminStatus() {
      setLoading(true);
      
      try {
        const supabase = getSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          return;
        }
        
        // List of admin emails
        const adminEmails = [
          'admin@specyf.com',
          'dev@specyf.com'
          // Add more admin emails as needed
        ];
        
        setIsAdmin(adminEmails.includes(user.email || ''));
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    
    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this area.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin/database-fixes', label: 'Database Fixes', icon: Database },
    { href: '/admin/storage', label: 'Storage', icon: Settings },
    { href: '/admin/db-analyzer', label: 'DB Analyzer', icon: BarChart3 },
    { href: '/admin/demo-requests', label: 'Demo Requests', icon: MessageSquare },
    { href: '/dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
  ];

  const isActive = (path: string) => {
    return pathname === path || (path !== '/dashboard' && pathname?.startsWith(path));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* Admin top navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto py-3 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className="flex-shrink-0"
                  >
                    <Button 
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className={`${active ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'text-gray-700'}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
} 