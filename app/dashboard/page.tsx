'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarRange, LogOut, Plus, Users, BarChart2, Layout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/hooks/useSupabase'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import CustomDashboard from './components/CustomDashboard'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalAttendees: number;
  confirmedAttendees: number;
  responseRate: string;
  recentActivity: {
    title: string;
    description: string;
    time: string;
  }[];
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut, supabase, loading: authLoading, initialized } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useCustomDashboard, setUseCustomDashboard] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    totalAttendees: 0,
    confirmedAttendees: 0,
    responseRate: '0%',
    recentActivity: []
  })

  // Fetch dashboard stats when component mounts
  useEffect(() => {
    if (initialized && !user) {
      console.log('No authenticated user found, redirecting to login...')
      router.replace('/auth/login')
    } else if (initialized && user && supabase) {
      fetchDashboardStats()
    }
  }, [user, router, initialized, supabase])

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        setError('Please log in to view dashboard');
        setLoading(false);
        return;
      }
      
      // Fetch all events for organizer
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id);
      
      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setError('Error fetching event data');
        setLoading(false);
        return;
      }
      
      if (!events || events.length === 0) {
        console.log('No events found for organizer');
        // Set default stats with zeros
        setStats({
          totalEvents: 0,
          upcomingEvents: 0,
          totalAttendees: 0,
          confirmedAttendees: 0,
          responseRate: '0%',
          recentActivity: []
        });
        setLoading(false);
        return;
      }
      
      console.log(`Found ${events.length} events`);
      
      // Split events into upcoming and past
      const now = new Date();
      const upcomingEvents = events.filter(event => new Date(event.date) > now);
      
      // Get all event IDs for guest count query
      const eventIds = events.map(event => event.id);
      
      // Check if guests table exists before querying
      const { data: tableInfo } = await supabase
        .rpc('check_table_exists', { table_name: 'guests' });
      
      let totalGuests = 0;
      let confirmedGuests = 0;
      
      if (tableInfo && tableInfo.exists) {
        // Count total guests for all events
        const { data: guestsData, error: guestsError } = await supabase
          .from('guests')
          .select('id, status')
          .in('event_id', eventIds);
        
        if (!guestsError && guestsData) {
          totalGuests = guestsData.length;
          confirmedGuests = guestsData.filter(guest => guest.status === 'confirmed').length;
        } else {
          console.error('Error fetching guests:', guestsError);
        }
      } else {
        console.log('Guests table does not exist yet');
      }
      
      // Format recent activity from events, most recent first
      const recentActivity = events.slice(0, 5).map(event => ({
        title: event.title,
        description: `Event ${new Date(event.start_date) > new Date() ? 'upcoming' : 'happened'}`,
        time: formatTimeAgo(event.created_at),
      }));
      
      // Update stats with actual data
      setStats({
        totalEvents: events.length,
        upcomingEvents: upcomingEvents.length,
        totalAttendees: totalGuests,
        confirmedAttendees: confirmedGuests,
        responseRate: totalGuests > 0 ? `${Math.round((confirmedGuests / totalGuests) * 100)}%` : '0%',
        recentActivity: recentActivity,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchDashboardStats:', error);
      setError('Error loading dashboard data');
      setLoading(false);
    }
  };
  
  // Helper function to format time ago
  const formatTimeAgo = (dateInput: string | Date) => {
    // Ensure we have a Date object
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      router.replace('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setLoading(false)
    }
  }

  const handleRefreshData = () => {
    fetchDashboardStats()
  }

  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (useCustomDashboard) {
    return <CustomDashboard />
  }

  if (!user) {
    return null
  }

  const displayName = user.email ? user.email.split('@')[0] : 'User'

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Event Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="dashboard-toggle"
              checked={useCustomDashboard}
              onCheckedChange={setUseCustomDashboard}
            />
            <Label htmlFor="dashboard-toggle" className="text-sm font-medium">
              Modern Layout
            </Label>
          </div>
          <Button onClick={handleRefreshData} variant="outline" size="sm">
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* ... keep rest of original dashboard ... */}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Events</CardTitle>
            <CardDescription>Events scheduled in the future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <CalendarRange className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              </div>
              <Button asChild size="sm">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" />
                  New Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Guests</CardTitle>
            <CardDescription>Across all your events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{stats.totalAttendees}</div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/guests">
                  Manage Guests
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Past Events</CardTitle>
            <CardDescription>Completed events history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BarChart2 className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/events">
                  View History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Your most recently created events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Event
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/events">
                  <CalendarRange className="mr-2 h-4 w-4" />
                  Manage Events
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/guests">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Guests
                </Link>
              </Button>
              <Button asChild className="w-full justify-start" variant="outline">
                <Link href="/dashboard/analytics">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 