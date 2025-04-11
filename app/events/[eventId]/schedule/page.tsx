'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Calendar, AlertCircle, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'

interface SubEvent {
  id: string
  event_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  location: string | null
  max_attendees: number | null
  created_at: string
  updated_at: string
}

interface Event {
  id: string
  title: string
  start_date: string
  end_date: string
  timezone: string
  location: string | null
  description: string | null
}

export default function SchedulePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const eventId = params.eventId as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [subEvents, setSubEvents] = useState<SubEvent[]>([])
  const [guestId, setGuestId] = useState<string | null>(null)

  // Fetch event and sub-events
  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, title, start_date, end_date, timezone, location, description')
          .eq('id', eventId)
          .single()
        
        if (eventError) throw eventError
        
        setEvent(eventData)
        
        // Fetch sub-events
        const { data: subEventsData, error: subEventsError } = await supabase
          .from('sub_events')
          .select('*')
          .eq('event_id', eventId)
          .order('start_time', { ascending: true })
        
        if (subEventsError) throw subEventsError
        
        setSubEvents(subEventsData || [])
        
        // Check if guest exists in URL params
        const urlParams = new URLSearchParams(window.location.search)
        const guest = urlParams.get('guest')
        
        if (guest) {
          setGuestId(guest)
        }
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Failed to load schedule')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [eventId, supabase])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-6 w-6 mr-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
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
        <div className="flex items-center mb-6">
          <Link href={`/events/${eventId}${guestId ? `?guest=${guestId}` : ''}`}>
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Event
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center mb-6">
          <Calendar className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Event Schedule</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>
              {format(parseISO(event.start_date), 'EEEE, MMMM d, yyyy')} - {format(parseISO(event.end_date), 'EEEE, MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {event.location && (
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {event.location}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {event.timezone}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {subEvents.length > 0 ? (
            subEvents.map((subEvent) => (
              <Card key={subEvent.id}>
                <CardHeader>
                  <CardTitle>{subEvent.title}</CardTitle>
                  <CardDescription>
                    {format(parseISO(subEvent.start_time), 'h:mm a')} - {format(parseISO(subEvent.end_time), 'h:mm a')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subEvent.description && (
                    <p className="text-sm text-gray-500 mb-4">{subEvent.description}</p>
                  )}
                  {subEvent.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {subEvent.location}
                    </div>
                  )}
                  {subEvent.max_attendees && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      Max {subEvent.max_attendees} attendees
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No schedule items have been added yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 