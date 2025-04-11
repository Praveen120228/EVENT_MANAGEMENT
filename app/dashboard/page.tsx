'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarRange, LogOut, Plus, Users, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSupabase } from '@/hooks/useSupabase'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DashboardStats {
  upcomingEvents: number
  totalGuests: number
  pastEvents: number
  recentActivity: { id: string; title: string; date: string; type: string }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut, supabase, loading: authLoading, initialized } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    upcomingEvents: 0,
    totalGuests: 0,
    pastEvents: 0,
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
    if (!supabase || !user) return
    
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching dashboard stats...')
      
      // Fetch upcoming events (events with date >= today)
      const today = new Date().toISOString().split('T')[0]
      console.log('Today\'s date for comparison:', today)
      
      const { data: upcomingEventsData, error: upcomingError } = await supabase
        .from('events')
        .select('id')
        .eq('organizer_id', user.id)
        .gte('date', today)
      
      if (upcomingError) {
        console.error('Error fetching upcoming events:', upcomingError)
        throw upcomingError
      }
      
      console.log('Upcoming events data:', upcomingEventsData)
      
      // Fetch past events (events with date < today)
      const { data: pastEventsData, error: pastError } = await supabase
        .from('events')
        .select('id')
        .eq('organizer_id', user.id)
        .lt('date', today)
      
      if (pastError) {
        console.error('Error fetching past events:', pastError)
        throw pastError
      }
      
      console.log('Past events data:', pastEventsData)
      
      // Consolidate all event IDs for the guest count query
      const allEventIds = [
        ...(upcomingEventsData || []).map(e => e.id),
        ...(pastEventsData || []).map(e => e.id)
      ]
      
      // Fetch total guest count only if there are events
      let guestsData = []
      if (allEventIds.length > 0) {
        try {
          // First check if the guests table exists
          const { error: tableCheckError } = await supabase
            .from('guests')
            .select('count')
            .limit(1)
            .single()
          
          if (tableCheckError && (tableCheckError.code === 'PGRST116' || tableCheckError.code === '404')) {
            console.warn('The guests table does not exist yet. Guest count will be zero.', tableCheckError)
            // Continue without throwing error - guests count will just be 0
          } else {
            // Only proceed with guest count if table exists
            const { data: fetchedGuests, error: guestsError } = await supabase
              .from('guests')
              .select('id, event_id')
              .in('event_id', allEventIds)
            
            if (guestsError) {
              console.error('Error fetching guests:', guestsError)
              // Don't throw here, just log the error and continue with zero guests
            } else {
              guestsData = fetchedGuests || []
              console.log('Guests data:', guestsData)
            }
          }
        } catch (guestErr) {
          console.error('Error in guest count:', guestErr)
          // Continue without failing the whole dashboard
        }
      } else {
        console.log('No events found, skipping guest count query')
      }
      
      // Fetch recent activity (most recent events)
      const { data: recentActivity, error: recentError } = await supabase
        .from('events')
        .select('id, title, date, event_type, created_at')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (recentError) {
        console.error('Error fetching recent activity:', recentError)
        throw recentError
      }
      
      console.log('Recent activity data:', recentActivity)
      
      // Update the stats
      setStats({
        upcomingEvents: upcomingEventsData?.length || 0,
        pastEvents: pastEventsData?.length || 0,
        totalGuests: guestsData?.length || 0,
        recentActivity: recentActivity?.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          type: event.event_type
        })) || []
      })
      
      console.log('Dashboard stats updated:', {
        upcomingEvents: upcomingEventsData?.length || 0,
        pastEvents: pastEventsData?.length || 0,
        totalGuests: guestsData?.length || 0,
        recentActivity: recentActivity?.length || 0
      })
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err)
      if (err.code === 'PGRST116') {
        setError('Database tables might not exist or you do not have access to them.')
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Failed to load dashboard statistics. Please try again later.')
      }
      
      // Set default stats on error
      setStats({
        upcomingEvents: 0,
        totalGuests: 0,
        pastEvents: 0,
        recentActivity: []
      })
    } finally {
      setLoading(false)
    }
  }

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

  if (!user) {
    return null
  }

  const displayName = user.email ? user.email.split('@')[0] : 'User'

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{user.email}</span>
            </span>
            <Button variant="ghost" onClick={handleSignOut} disabled={loading}>
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? 'Signing out...' : 'Log Out'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {displayName}!</h1>
            <p className="text-muted-foreground">Here's an overview of your events and activities.</p>
          </div>
          <Button variant="outline" onClick={handleRefreshData} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Events
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Events in the future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Guests
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Across all events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Past Events
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Successfully hosted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pastEvents}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <p className="mb-4 text-sm text-muted-foreground">Manage your events efficiently</p>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/dashboard/create">
              <Card className="cursor-pointer transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-base">Create Event</CardTitle>
                  </div>
                  <CardDescription>Set up a new event</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/dashboard/events">
              <Card className="cursor-pointer transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-base">Manage Events</CardTitle>
                  </div>
                  <CardDescription>View and edit events</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/dashboard/guests">
              <Card className="cursor-pointer transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-base">Guest Lists</CardTitle>
                  </div>
                  <CardDescription>Manage attendees</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/dashboard/analytics">
              <Card className="cursor-pointer transition-colors hover:bg-accent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-emerald-500" />
                    <CardTitle className="text-base">Analytics</CardTitle>
                  </div>
                  <CardDescription>View stats and trends</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <p className="mb-4 text-sm text-muted-foreground">Latest updates from your events</p>
          <Card>
            <CardContent className="p-0">
              {stats.recentActivity.length > 0 ? (
                <ul className="divide-y">
                  {stats.recentActivity.map(activity => (
                    <li key={activity.id} className="p-4 hover:bg-muted">
                      <Link href={`/dashboard/events/${activity.id}`} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()} • {activity.type}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  {loading ? 'Loading activities...' : 'No recent activities'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
} 