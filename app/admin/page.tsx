'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Calendar, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

interface SystemStats {
  totalUsers: number;
  totalDemoRequests: number;
  newDemoRequests: number;
  totalEvents: number;
  activeEvents: number;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalDemoRequests: 0,
    newDemoRequests: 0,
    totalEvents: 0,
    activeEvents: 0
  });

  useEffect(() => {
    fetchSystemStats();
  }, []);

  async function fetchSystemStats() {
    setLoading(true);
    
    try {
      const supabase = getSupabaseClient();
      
      // Get demo request stats
      const { data: demoRequests, error: demoError } = await supabase
        .from('demo_requests')
        .select('status');
      
      if (demoError) throw demoError;
      
      const newDemoRequests = demoRequests.filter(req => req.status === 'new').length;
      
      // Get user count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      
      if (userError) throw userError;
      
      // Get event stats
      const { data: events, error: eventError } = await supabase
        .from('events')
        .select('date');
      
      if (eventError) throw eventError;
      
      const now = new Date().toISOString();
      const activeEvents = events.filter(event => 
        event.date && event.date >= now
      ).length;
      
      setStats({
        totalUsers: userCount || 0,
        totalDemoRequests: demoRequests.length,
        newDemoRequests,
        totalEvents: events.length,
        activeEvents
      });
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const adminMenuItems = [
    {
      title: 'Database Fixes',
      description: 'Tools to fix common database issues',
      icon: Database,
      path: '/admin/database-fixes',
      color: 'text-indigo-500'
    },
    {
      title: 'Storage Management',
      description: 'Manage uploaded files and storage buckets',
      icon: Settings,
      path: '/admin/storage',
      color: 'text-blue-500'
    },
    {
      title: 'Database Analyzer',
      description: 'Analyze database structure and performance',
      icon: BarChart3,
      path: '/admin/db-analyzer',
      color: 'text-yellow-500'
    },
    {
      title: 'Demo Requests',
      description: 'Manage and respond to demo requests',
      icon: MessageSquare,
      path: '/admin/demo-requests',
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{loading ? '-' : stats.totalUsers}</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Demo Requests</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{loading ? '-' : stats.totalDemoRequests}</CardTitle>
              <MessageSquare className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New Requests</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{loading ? '-' : stats.newDemoRequests}</CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Events</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{loading ? '-' : stats.totalEvents}</CardTitle>
              <Calendar className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Events</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{loading ? '-' : stats.activeEvents}</CardTitle>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
        </Card>
      </div>
      
      {/* Admin Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <Card key={item.path} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <Icon className={`h-8 w-8 ${item.color}`} />
                <CardTitle className="mt-2">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={item.path} className="w-full">
                  <Button className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200">
                    <span>Go to {item.title}</span>
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 