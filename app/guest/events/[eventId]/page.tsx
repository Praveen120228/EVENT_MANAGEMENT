"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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

export default function GuestEventPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  
  const eventId = params.eventId as string
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
      
      // Fetch event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle(); // Use maybeSingle instead of single
      
      if (eventError) {
        console.error("Event fetch error:", eventError);
        throw new Error(`Event not found: ${eventError.message}`);
      }
      
      if (!eventData) {
        console.error("No event data returned for ID:", eventId);
        throw new Error('Event not found');
      }
      
      setEvent(eventData)
      
      // Fetch guest data
      if (guestId) {
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('*')
          .eq('id', guestId)
          .eq('event_id', eventId)
          .maybeSingle(); // Use maybeSingle instead of single
        
        if (guestError) {
          console.error("Guest fetch error:", guestError);
          throw new Error(`Guest not found: ${guestError.message}`);
        }
        
        if (!guestData) {
          console.error("No guest data returned for ID:", guestId);
          throw new Error('Guest not found');
        }
        
        setGuest(guestData)
      }
      
      // Fetch announcements (if table exists)
      try {
        const { data: announcementData } = await supabase
          .from('event_announcements')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false })
        
        if (announcementData) {
          setAnnouncements(announcementData)
        }
      } catch (err) {
        console.log('Announcements table may not exist yet')
      }
      
      // Fetch polls (if table exists)
      try {
        const { data: pollData } = await supabase
          .from('event_polls')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false })
        
        if (pollData) {
          setPolls(pollData)
        }
      } catch (err) {
        console.log('Polls table may not exist yet')
      }
      
      // Count confirmed guests
      const { count } = await supabase
        .from('guests')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('status', 'confirmed')
      
      setConfirmedGuests(count || 0)
      
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
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="announcements">
            Announcements {announcements.length > 0 && `(${announcements.length})`}
          </TabsTrigger>
          <TabsTrigger value="polls">
            Polls {polls.length > 0 && `(${polls.length})`}
          </TabsTrigger>
        </TabsList>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
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
        </TabsContent>
        
        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Event Announcements</CardTitle>
              <CardDescription>Latest updates from the organizer</CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <div className="text-center py-10">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>No announcements yet</p>
                  <p className="text-sm text-muted-foreground">
                    Check back later for updates from the organizer
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {announcements.map((announcement) => (
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Polls Tab */}
        <TabsContent value="polls">
          <Card>
            <CardHeader>
              <CardTitle>Event Polls</CardTitle>
              <CardDescription>Participate in polls from the organizer</CardDescription>
            </CardHeader>
            <CardContent>
              {polls.length === 0 ? (
                <div className="text-center py-10">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>No polls available</p>
                  <p className="text-sm text-muted-foreground">
                    The organizer hasn't created any polls yet
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {polls.map((poll) => (
                    <PollResponse
                      key={poll.id}
                      pollId={poll.id}
                      guestId={guest.id}
                      question={poll.question}
                      options={poll.options}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Footer with response change link */}
      <div className="mt-8 text-center">
        <Link 
          href={`/guest/response/${eventId}/${guest.id}`}
          className="text-emerald-600 hover:underline text-sm"
        >
          {!isEventPast 
            ? (guest.status === 'pending' 
                ? 'Respond to Invitation' 
                : 'Change Your Response')
            : 'View Response'}
        </Link>
      </div>
    </div>
  )
} 