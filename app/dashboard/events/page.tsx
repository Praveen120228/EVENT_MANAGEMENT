'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Calendar, Edit, Trash2, Users, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  max_guests: number
  event_type: 'workshop' | 'meetup' | 'business' | 'college' | 'personal'
  organizer_id: string
  created_at: string
  status?: 'draft' | 'published' | 'cancelled' | 'completed'
  is_public?: boolean
  invitation_link?: string
}

export default function EventsPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  // Fetch events when component mounts or user changes
  useEffect(() => {
    if (!authLoading && user && supabase) {
      fetchEvents()
    } else if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, supabase])

  const fetchEvents = async () => {
    if (!supabase || !user) return

    setLoading(true)
    setError(null)

    try {
      console.log('Fetching events for user:', user.id)
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', user.id)
        .order('date', { ascending: true })

      if (fetchError) {
        console.error('Error fetching events:', fetchError)
        throw fetchError
      }

      console.log('Events fetched:', data)
      setEvents(data || [])
    } catch (err: any) {
      console.error('Failed to fetch events:', err)
      if (err.code === 'PGRST116') {
        setError('The events table might not exist or you do not have access to it')
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Failed to load events')
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!supabase || !user) return

    try {
      setLoading(true)
      console.log('Deleting event:', eventId)
      
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('organizer_id', user.id) // Extra safety check

      if (deleteError) {
        console.error('Error deleting event:', deleteError)
        throw deleteError
      }
      
      console.log('Event deleted successfully')
      // Remove the deleted event from state
      setEvents(events.filter(event => event.id !== eventId))
    } catch (err) {
      console.error('Failed to delete event:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete event')
    } finally {
      setLoading(false)
      setEventToDelete(null)
    }
  }

  const confirmDelete = (eventId: string) => {
    setEventToDelete(eventId);
  };

  // Filter events based on date
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date())
  const pastEvents = events.filter(event => new Date(event.date) < new Date())

  // Display loading state
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
        <h1 className="text-2xl font-bold">My Events</h1>
        <Button onClick={() => router.push('/dashboard/create')}>
          Create Event
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {loading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} onDelete={confirmDelete} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No upcoming events</h3>
              <p className="mt-2 text-gray-500">Create your first event to get started.</p>
              <Button className="mt-4" onClick={() => router.push('/dashboard/create')}>
                Create Event
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {loading ? (
            <div className="flex justify-center my-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} onDelete={confirmDelete} isPast />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No past events</h3>
              <p className="mt-2 text-gray-500">Past events will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!eventToDelete} onOpenChange={(isOpen) => !isOpen && setEventToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => eventToDelete && deleteEvent(eventToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function EventCard({ event, onDelete, isPast = false }: { 
  event: Event, 
  onDelete: (id: string) => void,
  isPast?: boolean
}) {
  const formattedDate = event.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : 'Date not set'
  
  const eventTypeLabels: Record<string, string> = {
    'workshop': 'Workshop',
    'meetup': 'Meetup',
    'business': 'Business',
    'college': 'College',
    'personal': 'Personal'
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{event.title}</CardTitle>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
            {eventTypeLabels[event.event_type] || event.event_type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{formattedDate} • {event.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>Max Guests: {event.max_guests}</span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mt-2">{event.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Link href={`/dashboard/events/${event.id}`}>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </Button>
        </Link>
        <div className="space-x-2">
          {!isPast && (
            <Link href={`/dashboard/events/edit/${event.id}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={() => onDelete(event.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 