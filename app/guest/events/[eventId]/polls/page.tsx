'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  User
} from 'lucide-react'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import PollResponse from '@/components/guest/poll-response'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  organizer_id: string
  organizer_name: string | null
}

interface Poll {
  id: string
  event_id: string
  question: string
  options: string[]
  created_at: string
  updated_at: string
}

export default function GuestEventPollsPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()
  
  // Extract eventId from pathname instead of using params directly
  const eventId = pathname.split('/')[3] // This will get the [eventId] from the URL
  const guestId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('guestId') : null
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [polls, setPolls] = useState<Poll[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        
        // Get the current user
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          throw authError
        }
        
        if (!session) {
          // Not logged in, redirect to login
          router.replace('/auth/guest-login')
          return
        }
        
        setUser(session.user)
        
        // Fetch event and polls
        await fetchEventData()
      } catch (err) {
        console.error('Auth error:', err)
        setError('Authentication failed. Please try logging in again.')
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router, supabase, eventId])

  const fetchEventData = async () => {
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()
      
      if (eventError) {
        console.error("Event fetch error:", eventError);
        setError(`Event not found: ${eventError.message}`);
        setLoading(false);
        return;
      }
      
      if (!eventData) {
        console.error("No event data returned for ID:", eventId);
        
        // Try a double-check with a separate query to see if we have permission issues
        const { count, error: countError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
          
        if (countError) {
          console.error("Events table access error:", countError);
          // Try with a simpler permission model (no RLS)
          try {
            const { data: fallbackEventData, error: fallbackError } = await supabase
              .rpc('get_event_by_id', { event_id: eventId });
              
            if (fallbackError) {
              console.error("Fallback event fetch failed:", fallbackError);
              setError('Unable to access event information. You may not have permission.');
            } else if (fallbackEventData) {
              console.log("Successfully loaded event data via fallback:", fallbackEventData.title);
              setEvent(fallbackEventData);
              
              // Try to get guest data and polls
              try {
                const { data: guestData, error: guestError } = await supabase
                  .rpc('get_guest_by_id', { guest_id: guestId });
                  
                if (!guestError && guestData) {
                  const { data: pollData, error: pollError } = await supabase
                    .from('event_polls')
                    .select('*')
                    .eq('event_id', eventId);
                    
                  if (!pollError && pollData) {
                    const parsedPolls = pollData.map((poll: any) => {
                      let parsedOptions = [];
                      try {
                        if (typeof poll.options === 'string') {
                          parsedOptions = JSON.parse(poll.options);
                        } else if (Array.isArray(poll.options)) {
                          parsedOptions = poll.options;
                        }
                      } catch (err) {
                        console.error('Error parsing poll options:', err);
                        parsedOptions = [];
                      }
                      
                      return {
                        ...poll,
                        options: parsedOptions
                      };
                    });
                    
                    setPolls(parsedPolls);
                    setLoading(false);
                    return;
                  }
                }
              } catch (fallbackDataError) {
                console.error("Error fetching related data:", fallbackDataError);
              }
            }
          } catch (fallbackErr) {
            console.error("Error in fallback event fetch:", fallbackErr);
          }
          
          setError('Unable to access event information. You may not have permission.');
        } else {
          console.log(`Events table is accessible (${count} events), but ID ${eventId} was not found.`);
          setError('Event not found or it may have been deleted.');
        }
        
        setLoading(false);
        return;
      }
      
      setEvent(eventData)
      
      // Check if the user is invited to this event
      if (guestId) {
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('*')
          .eq('id', guestId)
          .eq('event_id', eventId)
          .single()
        
        if (guestError) {
          console.error("Guest fetch error:", guestError);
          setError(`Guest not found: ${guestError.message}`);
          setLoading(false);
          return;
        }
        
        if (!guestData) {
          console.error("No guest data returned for ID:", guestId);
          setError('Guest not found or you do not have access to this event.');
          setLoading(false);
          return;
        }
      }
      
      // Fetch polls
      const { data: pollData, error: pollError } = await supabase
        .from('event_polls')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
      
      if (pollError) {
        console.error("Poll fetch error:", pollError);
        // Don't block the page load for poll errors,
        // just set empty polls
        setPolls([]);
        return;
      }
      
      // Handle options parsing safely
      const parsedPolls = (pollData || []).map(poll => {
        let parsedOptions = []
        try {
          if (typeof poll.options === 'string') {
            parsedOptions = JSON.parse(poll.options)
          } else if (Array.isArray(poll.options)) {
            parsedOptions = poll.options
          }
        } catch (err) {
          console.error('Error parsing poll options:', err)
          parsedOptions = []
        }
        
        return {
          ...poll,
          options: parsedOptions
        }
      })
      
      setPolls(parsedPolls)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load event data')
    }
  }

  // Format date for display
  const formatDateSafely = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Date not specified'
    
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return format(date, 'MMMM d, yyyy')
    } catch (err) {
      console.error('Error formatting date:', err)
      return 'Date format error'
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => router.push('/guest/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>Event not found or you do not have access.</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => router.push('/guest/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {event.title}
          </h1>
          
          <div className="text-sm text-gray-500">
            <User className="inline-block h-4 w-4 mr-1" />
            {user?.email}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Event Polls</h1>
            <p className="text-gray-500">Respond to polls from the event organizer</p>
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="outline" 
              onClick={() => router.push('/guest/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
        
        {/* Event summary */}
        <Card className="mb-6">
          <CardContent className="pt-6 pb-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <div className="font-medium">Date</div>
                  <div className="text-sm text-gray-500">
                    {formatDateSafely(event.date)}
                  </div>
                </div>
              </div>
              
              {event.time && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </div>
                </div>
              )}
              
              {event.location && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-gray-500">{event.location}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Polls */}
        {polls.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Polls</h3>
              <p className="text-gray-500 mt-2">
                There are no polls for this event yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => (
              <Card key={poll.id}>
                <CardContent className="pt-6">
                  <PollResponse
                    pollId={poll.id}
                    eventId={eventId}
                    guestId={guestId || ''}
                    question={poll.question}
                    options={poll.options}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 