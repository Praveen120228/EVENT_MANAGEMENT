"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MessageCircle, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  Info,
  Loader2 
} from "lucide-react"
import { format, parseISO, isAfter } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PollResponse from "@/components/guest/poll-response"

interface Guest {
  id: string
  event_id: string
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  response_date: string | null
  message: string | null
}

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  organizer_id: string
  organizer_name: string | null
  max_guests: number | null
  created_at: string
  updated_at: string
}

interface EventAnnouncement {
  id: string
  event_id: string
  title: string
  content: string
  created_at: string
}

interface EventPoll {
  id: string
  event_id: string
  question: string
  options: string[]
  created_at: string
}

interface PollResponseProps {
  pollId: string
  eventId: string
  guestId: string
  question: string
  options: string[]
}

export default function GuestEventPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  
  // Extract eventId from pathname instead of using params directly
  const eventId = pathname.split('/')[3] // This will get the [eventId] from the URL
  const guestId = searchParams.get('guestId')
  
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState<Event | null>(null)
  const [guest, setGuest] = useState<Guest | null>(null)
  const [announcements, setAnnouncements] = useState<EventAnnouncement[]>([])
  const [polls, setPolls] = useState<EventPoll[]>([])
  const [confirmedGuests, setConfirmedGuests] = useState(0)
  const [error, setError] = useState("")
  
  useEffect(() => {
    if (eventId && guestId) {
      fetchEventData()
    } else if (!guestId) {
      setError("Guest ID is required to view this event")
      setLoading(false)
    }
  }, [eventId, guestId])
  
  async function fetchEventData() {
    try {
      setLoading(true)
      
      console.log("Fetching event data for:", { eventId, guestId });
      
      // Try to fetch event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle();
      
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
              setLoading(false);
              return;
            }
            
            if (fallbackEventData) {
              console.log("Successfully loaded event data via fallback:", fallbackEventData.title);
              setEvent(fallbackEventData);
              
              // Now try to get guest data in a similar way
              if (guestId) {
                const { data: fallbackGuestData, error: fallbackGuestError } = await supabase
                  .rpc('get_guest_by_id', { guest_id: guestId });
                  
                if (!fallbackGuestError && fallbackGuestData) {
                  console.log("Successfully loaded guest data via fallback");
                  setGuest(fallbackGuestData);
                } else {
                  setError('Guest information could not be retrieved.');
                  setLoading(false);
                  return;
                }
              } else {
                setError('Guest ID is required to view this event.');
                setLoading(false);
                return;
              }
              
              // Continue with announcements and polls
              
              // Fetch announcements (if table exists)
              try {
                const { data: announcementData, error: announcementError } = await supabase
                  .from('event_announcements')
                  .select('*')
                  .eq('event_id', eventId)
                  .eq('is_published', true)
                  .order('created_at', { ascending: false })
                
                if (announcementError) {
                  console.error("Error fetching announcements:", announcementError);
                  // Continue with empty announcements
                } else if (announcementData) {
                  console.log(`Found ${announcementData.length} announcements for event ${eventId}`);
                  setAnnouncements(announcementData)
                }
              } catch (err) {
                console.log('Announcements table may not exist yet or other error:', err)
                // Continue with empty announcements
              }
              
              // Fetch polls (if table exists)
              try {
                const { data: pollData, error: pollError } = await supabase
                  .from('event_polls')
                  .select('*')
                  .eq('event_id', eventId)
                  .order('created_at', { ascending: false })
                
                if (pollError) {
                  console.error("Error fetching polls:", pollError);
                  // Continue with empty polls
                } else if (pollData) {
                  console.log(`Found ${pollData.length} polls for event ${eventId}`);
                  
                  // Handle options parsing safely
                  const parsedPolls = (pollData || []).map((poll: any) => {
                    let parsedOptions = []
                    try {
                      if (typeof poll.options === 'string') {
                        parsedOptions = JSON.parse(poll.options)
                      } else if (Array.isArray(poll.options)) {
                        parsedOptions = poll.options
                      }
                    } catch (err) {
                      console.error('Error parsing poll options for poll', poll.id, err)
                      parsedOptions = []
                    }
                    
                    return {
                      ...poll,
                      options: parsedOptions
                    }
                  });
                  
                  console.log('Successfully parsed poll options');
                  setPolls(parsedPolls)
                }
              } catch (err) {
                console.log('Polls table may not exist yet or other error:', err)
                // Continue with empty polls
              }
              
              // Count confirmed guests
              try {
                const { count, error: countError } = await supabase
                  .from('guests')
                  .select('*', { count: 'exact', head: true })
                  .eq('event_id', eventId)
                  .eq('status', 'confirmed')
                
                if (!countError) {
                  console.log(`Event ${eventId} has ${count} confirmed guests`);
                  setConfirmedGuests(count || 0)
                }
              } catch (err) {
                console.error('Error getting guest count:', err);
                // Continue with zero confirmed guests
              }
              
              setLoading(false);
              return;
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
      
      console.log("Successfully loaded event data:", eventData.title);
      setEvent(eventData)
      
      // Fetch guest data
      if (guestId) {
        console.log("Fetching guest data for:", guestId);
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('*')
          .eq('id', guestId)
          .eq('event_id', eventId)
          .maybeSingle();
        
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
        
        console.log("Successfully loaded guest data:", guestData.name);
        setGuest(guestData)
      }
      
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError(err.message || 'Failed to load event data')
    } finally {
      setLoading(false)
    }
  }
  
  const isEventPast = event ? isAfter(new Date(), parseISO(event.date)) : false
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <p className="text-center mt-4">
          <Link href="/" className="text-emerald-600 hover:underline">
            Return to homepage
          </Link>
        </p>
      </div>
    )
  }
  
  if (!event || !guest) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>Event or guest information not found</AlertDescription>
        </Alert>
        <p className="text-center mt-4">
          <Link href="/" className="text-emerald-600 hover:underline">
            Return to homepage
          </Link>
        </p>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      {/* Event Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>
          
          <div className="flex items-center space-x-2">
            {guest.status === 'confirmed' && (
              <Badge className="bg-emerald-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                You're attending
              </Badge>
            )}
            {guest.status === 'declined' && (
              <Badge variant="outline" className="border-red-300 text-red-500">
                <XCircle className="h-3 w-3 mr-1" />
                You declined
              </Badge>
            )}
            {guest.status === 'pending' && (
              <Badge variant="outline">
                <AlertCircle className="h-3 w-3 mr-1" />
                Please respond
              </Badge>
            )}
          </div>
        </div>
        
        {isEventPast && (
          <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
            <Info className="h-4 w-4 mr-2" />
            <AlertDescription>This event has already passed</AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="container mx-auto px-4 py-4">
        {isEventPast && (
          <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
            <Info className="h-4 w-4 mr-2" />
            <AlertDescription>This event has already passed</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
            <CardDescription>Details about this event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date & Time */}
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 mt-0.5 text-emerald-500" />
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <p>{format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</p>
                {event.time && <p className="text-muted-foreground">{event.time}</p>}
              </div>
            </div>
            
            {/* Location */}
            {event.location && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-emerald-500" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>{event.location}</p>
                </div>
              </div>
            )}
            
            {/* Description */}
            {event.description && (
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-3 mt-0.5 text-emerald-500" />
                <div>
                  <h3 className="font-medium">About this Event</h3>
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              </div>
            )}
            
            {/* Organizer */}
            <div className="flex items-start">
              <Users className="h-5 w-5 mr-3 mt-0.5 text-emerald-500" />
              <div>
                <h3 className="font-medium">Organizer</h3>
                <p>{event.organizer_name || 'Event Organizer'}</p>
                {event.max_guests && <p className="text-muted-foreground">
                  {confirmedGuests} confirmed of {event.max_guests} total capacity
                </p>}
              </div>
            </div>
            
            {/* Change Response */}
            {!isEventPast && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Your Response</h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => router.push(`/guest/response/${eventId}/${guest.id}`)}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Change My Response
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Show a preview of announcements if there are any */}
        {announcements.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Recent Announcements</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {announcements.slice(0, 2).map((announcement) => (
                    <div 
                      key={announcement.id} 
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(announcement.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{announcement.content}</p>
                    </div>
                  ))}
                  {announcements.length > 2 && (
                    <div className="text-center mt-2">
                      <Link href={`/guest/events/${eventId}/announcements?guestId=${guest.id}`}>
                        <Button variant="link" className="text-emerald-600">
                          View all {announcements.length} announcements
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Show a preview of polls if there are any */}
        {polls.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Event Polls</h2>
            <Card>
              <CardContent className="pt-6">
                {polls.slice(0, 1).map((poll) => (
                  <PollResponse
                    key={poll.id}
                    pollId={poll.id}
                    eventId={eventId}
                    guestId={guest.id}
                    question={poll.question}
                    options={poll.options}
                  />
                ))}
                {polls.length > 1 && (
                  <div className="text-center mt-6">
                    <Link href={`/guest/events/${eventId}/polls?guestId=${guestId}`}>
                      <Button variant="link" className="text-emerald-600">
                        View all {polls.length} polls
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 