'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer_id: string
  event_type: string
  max_guests: number
  created_at: string
  updated_at: string
  organizer: {
    full_name: string
    avatar_url: string
  }
}

interface Guest {
  id: string
  event_id: string
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  response_date: string | null
  created_at: string
  updated_at: string
}

interface SubEvent {
  id: string
  event_id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  created_at: string
  updated_at: string
}

interface Poll {
  id: string
  event_id: string
  question: string
  options: string[]
  created_at: string
  updated_at: string
}

interface PollResponse {
  id: string
  poll_id: string
  guest_id: string
  option_index: number
  created_at: string
}

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const eventId = params.eventId as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [subEvents, setSubEvents] = useState<SubEvent[]>([])
  const [polls, setPolls] = useState<Poll[]>([])
  const [guest, setGuest] = useState<Guest | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestResponse, setGuestResponse] = useState<'confirmed' | 'declined' | null>(null)
  const [guestMessage, setGuestMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('details')
  const [pollResponses, setPollResponses] = useState<Record<string, number>>({})

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return
      
      setLoading(true)
      setError(null)
      
      try {
        // First try to fetch event with organizer profile
        let eventData;
        try {
          const { data, error } = await supabase
            .from('events')
            .select(`
              *,
              organizer:profiles(full_name, avatar_url)
            `)
            .eq('id', eventId)
            .single();
            
          if (error) throw error;
          eventData = data;
        } catch (joinError) {
          console.warn('Error with joined query:', joinError);
          
          // If joining fails, try to fetch just the event data
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();
            
          if (error) throw error;
          eventData = data;
          
          // Add a placeholder organizer object
          eventData.organizer = {
            full_name: 'Event Organizer',
            avatar_url: ''
          };
        }
        
        setEvent(eventData);
        
        // Fetch sub-events
        const { data: subEventsData, error: subEventsError } = await supabase
          .from('sub_events')
          .select('*')
          .eq('event_id', eventId)
          .order('date', { ascending: true })
        
        if (subEventsError) throw subEventsError
        
        setSubEvents(subEventsData || [])
        
        // Fetch polls
        const { data: pollsData, error: pollsError } = await supabase
          .from('polls')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false })
        
        if (pollsError) throw pollsError
        
        setPolls(pollsData || [])
        
        // Check if guest exists in URL params
        const urlParams = new URLSearchParams(window.location.search)
        const guestId = urlParams.get('guest')
        
        if (guestId) {
          // Fetch guest details
          const { data: guestData, error: guestError } = await supabase
            .from('guests')
            .select('*')
            .eq('id', guestId)
            .single()
          
          if (guestError) throw guestError
          
          setGuest(guestData)
          setGuestName(guestData.name)
          setGuestEmail(guestData.email)
          setGuestResponse(guestData.status)
          
          // Fetch poll responses for this guest
          const { data: pollResponsesData, error: pollResponsesError } = await supabase
            .from('poll_responses')
            .select('poll_id, option_index')
            .eq('guest_id', guestId)
          
          if (pollResponsesError) throw pollResponsesError
          
          const responses: Record<string, number> = {}
          pollResponsesData?.forEach(response => {
            responses[response.poll_id] = response.option_index
          })
          
          setPollResponses(responses)
        }
      } catch (err: any) {
        console.error('Error fetching event:', err)
        setError(err.message || 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }
    
    fetchEvent()
  }, [eventId, supabase])

  const handleRSVP = async (status: 'confirmed' | 'declined') => {
    if (!event) return
    
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (!guest) {
        // Create new guest
        const { data: newGuest, error: createError } = await supabase
          .from('guests')
          .insert([{
            event_id: event.id,
            name: guestName,
            email: guestEmail,
            status: status,
            response_date: new Date().toISOString(),
            message: guestMessage || null
          }])
          .select()
          .single()
        
        if (createError) throw createError
        
        setGuest(newGuest)
        setGuestResponse(status)
        
        // Update URL with guest ID
        const url = new URL(window.location.href)
        url.searchParams.set('guest', newGuest.id)
        window.history.pushState({}, '', url.toString())
      } else {
        // Update existing guest
        const { error: updateError } = await supabase
          .from('guests')
          .update({
            status: status,
            response_date: new Date().toISOString(),
            message: guestMessage || null
          })
          .eq('id', guest.id)
        
        if (updateError) throw updateError
        
        setGuestResponse(status)
      }
      
      setSuccess(`You have ${status === 'confirmed' ? 'confirmed' : 'declined'} your attendance.`)
    } catch (err: any) {
      console.error('Error updating RSVP:', err)
      setError(err.message || 'Failed to update RSVP')
    } finally {
      setSubmitting(false)
    }
  }

  const handlePollResponse = async (pollId: string, optionIndex: number) => {
    if (!guest) {
      setError('Please RSVP first to participate in polls')
      return
    }
    
    setSubmitting(true)
    setError(null)
    
    try {
      // Check if guest has already responded to this poll
      const { data: existingResponse, error: checkError } = await supabase
        .from('poll_responses')
        .select('id')
        .eq('poll_id', pollId)
        .eq('guest_id', guest.id)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }
      
      if (existingResponse) {
        // Update existing response
        const { error: updateError } = await supabase
          .from('poll_responses')
          .update({ option_index: optionIndex })
          .eq('id', existingResponse.id)
        
        if (updateError) throw updateError
      } else {
        // Create new response
        const { error: createError } = await supabase
          .from('poll_responses')
          .insert([{
            poll_id: pollId,
            guest_id: guest.id,
            option_index: optionIndex
          }])
        
        if (createError) throw createError
      }
      
      // Update local state
      setPollResponses(prev => ({
        ...prev,
        [pollId]: optionIndex
      }))
      
      setSuccess('Your response has been recorded')
    } catch (err: any) {
      console.error('Error submitting poll response:', err)
      setError(err.message || 'Failed to submit poll response')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-24 md:col-span-2" />
            <Skeleton className="h-24" />
          </div>
          
          <Skeleton className="h-32 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Event not found</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center text-gray-500 mb-4">
              <Clock className="h-4 w-4 mr-1" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center text-gray-500 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-500 mb-4">
              <Users className="h-4 w-4 mr-1" />
              <span>Organized by {event.organizer?.full_name || 'Unknown'}</span>
            </div>
            
            <Badge variant="outline" className="mb-4">
              {event.event_type}
            </Badge>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>RSVP</CardTitle>
              <CardDescription>Let us know if you'll be attending</CardDescription>
            </CardHeader>
            <CardContent>
              {guestResponse ? (
                <div className="text-center py-4">
                  <div className="flex justify-center mb-4">
                    {guestResponse === 'confirmed' ? (
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-500" />
                    )}
                  </div>
                  <p className="text-lg font-medium mb-2">
                    You have {guestResponse === 'confirmed' ? 'confirmed' : 'declined'} your attendance
                  </p>
                  <p className="text-sm text-gray-500">
                    {guestMessage && `Message: ${guestMessage}`}
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setGuestResponse(null)}
                  >
                    Change Response
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest-name">Your Name</Label>
                    <Input
                      id="guest-name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter your name"
                      disabled={!!guest}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guest-email">Your Email</Label>
                    <Input
                      id="guest-email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={!!guest}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="guest-message">Message (Optional)</Label>
                    <Textarea
                      id="guest-message"
                      value={guestMessage}
                      onChange={(e) => setGuestMessage(e.target.value)}
                      placeholder="Add a message for the organizer"
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button
                      className="flex-1"
                      onClick={() => handleRSVP('confirmed')}
                      disabled={submitting || !guestName || !guestEmail}
                    >
                      {submitting ? 'Saving...' : 'I\'ll Attend'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleRSVP('declined')}
                      disabled={submitting || !guestName || !guestEmail}
                    >
                      {submitting ? 'Saving...' : 'Can\'t Attend'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Event Details</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-6">
            {subEvents.length > 0 ? (
              <div className="space-y-4">
                {subEvents.map((subEvent) => (
                  <Card key={subEvent.id}>
                    <CardHeader>
                      <CardTitle>{subEvent.title}</CardTitle>
                      <CardDescription>
                        {format(new Date(subEvent.date), 'EEEE, MMMM d, yyyy')} at {subEvent.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{subEvent.location}</span>
                      </div>
                      <p>{subEvent.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No schedule information available yet.
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="polls" className="mt-6">
            {polls.length > 0 ? (
              <div className="space-y-6">
                {polls.map((poll) => (
                  <Card key={poll.id}>
                    <CardHeader>
                      <CardTitle>{poll.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {poll.options.map((option, index) => (
                          <div key={index} className="flex items-center">
                            <Button
                              variant={pollResponses[poll.id] === index ? "default" : "outline"}
                              className="w-full justify-start"
                              onClick={() => handlePollResponse(poll.id, index)}
                              disabled={submitting || !guest}
                            >
                              {option}
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      {!guest && (
                        <Alert className="mt-4">
                          <AlertDescription>
                            Please RSVP first to participate in polls.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No polls available yet.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 