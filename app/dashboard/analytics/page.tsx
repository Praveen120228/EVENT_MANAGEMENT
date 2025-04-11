'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, BarChart2, PieChart, TrendingUp, Users, Calendar, Mail } from 'lucide-react'

interface Event {
  id: string
  title: string
  date: string
  location: string
  event_type: string
  created_at: string
}

interface GuestStats {
  total: number
  confirmed: number
  declined: number
  pending: number
  invited: number
}

interface EventStats {
  totalEvents: number
  upcomingEvents: number
  pastEvents: number
  totalGuests: number
  averageGuestsPerEvent: number
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventStats, setEventStats] = useState<EventStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    totalGuests: 0,
    averageGuestsPerEvent: 0
  })
  const [guestStats, setGuestStats] = useState<GuestStats>({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0,
    invited: 0
  })

  // Fetch events when component mounts or auth state changes
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    } else if (user && supabase) {
      fetchEvents()
    }
  }, [user, authLoading, router, supabase])

  // Fetch guest stats when selected event changes
  useEffect(() => {
    if (selectedEventId && supabase) {
      fetchGuestStats()
    }
  }, [selectedEventId, supabase])

  // Calculate overall event stats whenever events change
  useEffect(() => {
    if (events.length > 0) {
      calculateEventStats()
    }
  }, [events])

  const fetchEvents = async () => {
    if (!supabase || !user) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching events for analytics')
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('id, title, date, location, event_type, created_at')
        .eq('organizer_id', user.id)
        .order('date', { ascending: false })
      
      if (fetchError) throw fetchError
      
      console.log('Events fetched:', data)
      setEvents(data || [])
      
      // If events exist, select the first one by default
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id)
      }
    } catch (err: any) {
      console.error('Failed to fetch events:', err)
      setError(err.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const fetchGuestStats = async () => {
    if (!supabase || !selectedEventId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching guest stats for event:', selectedEventId)
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('status')
        .eq('event_id', selectedEventId)
      
      if (fetchError) throw fetchError
      
      console.log('Guest data fetched:', data)
      
      // Calculate guest stats
      const stats: GuestStats = {
        total: data?.length || 0,
        confirmed: data?.filter(g => g.status === 'confirmed').length || 0,
        declined: data?.filter(g => g.status === 'declined').length || 0,
        pending: data?.filter(g => g.status === 'pending').length || 0,
        invited: data?.filter(g => g.status === 'invited').length || 0
      }
      
      setGuestStats(stats)
    } catch (err: any) {
      console.error('Failed to fetch guest stats:', err)
      setError(err.message || 'Failed to load guest statistics')
    } finally {
      setLoading(false)
    }
  }

  const calculateEventStats = () => {
    if (!events || events.length === 0) return
    
    const now = new Date()
    const totalEvents = events.length
    const upcomingEvents = events.filter(e => new Date(e.date) > now).length
    const pastEvents = totalEvents - upcomingEvents
    
    // Fetch total guests across all events
    const fetchTotalGuests = async () => {
      if (!supabase || !user) return
      
      try {
        const { data, error } = await supabase
          .from('guests')
          .select('id')
          .in('event_id', events.map(e => e.id))
        
        if (error) throw error
        
        const totalGuests = data?.length || 0
        const averageGuestsPerEvent = totalEvents > 0 ? totalGuests / totalEvents : 0
        
        setEventStats({
          totalEvents,
          upcomingEvents,
          pastEvents,
          totalGuests,
          averageGuestsPerEvent
        })
      } catch (err) {
        console.error('Error calculating total guests:', err)
      }
    }
    
    fetchTotalGuests()
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Event</CardTitle>
            <CardDescription>Choose an event to view detailed analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event">Event</Label>
                <Select
                  value={selectedEventId}
                  onValueChange={setSelectedEventId}
                  disabled={loading || events.length === 0}
                >
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">
              <BarChart2 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="event" disabled={!selectedEventId}>
              <Calendar className="mr-2 h-4 w-4" />
              Event Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventStats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    {eventStats.upcomingEvents} upcoming, {eventStats.pastEvents} past
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{eventStats.totalGuests}</div>
                  <p className="text-xs text-muted-foreground">
                    Avg. {eventStats.averageGuestsPerEvent.toFixed(1)} per event
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RSVP Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {eventStats.totalGuests > 0
                      ? ((guestStats.confirmed / guestStats.total) * 100).toFixed(1)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {guestStats.confirmed} confirmed, {guestStats.declined} declined
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {eventStats.totalGuests > 0
                      ? (((guestStats.confirmed + guestStats.declined) / guestStats.total) * 100).toFixed(1)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {guestStats.pending} pending, {guestStats.invited} invited
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="event">
            {selectedEventId ? (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Statistics</CardTitle>
                    <CardDescription>RSVP breakdown for this event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                            <span>Confirmed</span>
                          </div>
                          <span className="font-medium">{guestStats.confirmed}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span>Declined</span>
                          </div>
                          <span className="font-medium">{guestStats.declined}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span>Pending</span>
                          </div>
                          <span className="font-medium">{guestStats.pending}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span>Invited</span>
                          </div>
                          <span className="font-medium">{guestStats.invited}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="relative h-40 w-40">
                          {/* This would be a pie chart in a real implementation */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{guestStats.total}</div>
                              <div className="text-sm text-muted-foreground">Total Guests</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Select an event to view detailed analytics</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 