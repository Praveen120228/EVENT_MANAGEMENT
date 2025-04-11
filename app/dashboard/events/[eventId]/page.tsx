'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, Calendar, MapPin, Clock, Users, Edit, Trash2, ArrowLeft } from 'lucide-react'
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
  invitation_code?: string
}

export default function EventViewPage() {
  const params = useParams()
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const eventId = params.eventId as string
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Base URL for invitation links
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  
  // Function to get the full invitation URL
  const getInvitationUrl = () => {
    if (!event) return '';
    return `${baseUrl}/invite/${event.invitation_code || event.id}`;
  }

  useEffect(() => {
    if (!authLoading && user && supabase) {
      fetchEvent()
    } else if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, supabase])

  const fetchEvent = async () => {
    if (!supabase || !user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single()

      if (fetchError) {
        console.error('Error fetching event:', fetchError)
        throw fetchError
      }

      if (!data) {
        throw new Error('Event not found')
      }

      setEvent(data)
    } catch (err) {
      console.error('Failed to fetch event:', err)
      setError(err instanceof Error ? err.message : 'Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async () => {
    if (!supabase || !user || !event) return

    try {
      setLoading(true)
      
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('organizer_id', user.id)

      if (deleteError) {
        console.error('Error deleting event:', deleteError)
        throw deleteError
      }
      
      router.push('/dashboard/events')
    } catch (err) {
      console.error('Failed to delete event:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete event')
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/dashboard/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>Event not found</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push('/dashboard/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>
    )
  }

  const formattedDate = event.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : 'Date not set'
  
  const eventTypeLabels: Record<string, string> = {
    'workshop': 'Workshop',
    'meetup': 'Meetup',
    'business': 'Business',
    'college': 'College',
    'personal': 'Personal'
  }

  const isPastEvent = new Date(event.date) < new Date()

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/events')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold mr-4">{event.title}</h1>
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          {eventTypeLabels[event.event_type] || event.event_type}
        </Badge>
        {event.status && (
          <Badge className="ml-2" variant={event.status === 'published' ? 'default' : 'outline'}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <h3 className="text-sm font-medium">Date</h3>
                  </div>
                  <p className="text-sm text-gray-500">{formattedDate}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <h3 className="text-sm font-medium">Time</h3>
                  </div>
                  <p className="text-sm text-gray-500">{event.time}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <h3 className="text-sm font-medium">Location</h3>
                  </div>
                  <p className="text-sm text-gray-500">{event.location}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <h3 className="text-sm font-medium">Maximum Guests</h3>
                  </div>
                  <p className="text-sm text-gray-500">{event.max_guests}</p>
                </div>
              </div>
              
              {event.is_public !== undefined && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Visibility</h3>
                    <p className="text-sm text-gray-500">
                      {event.is_public ? 'Public event' : 'Private event'}
                    </p>
                  </div>
                </>
              )}
              
              {event.is_public && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Invitation Link</h3>
                    <p className="text-sm text-blue-500 truncate">
                      <a href={getInvitationUrl()} target="_blank" rel="noopener noreferrer">
                        {getInvitationUrl()}
                      </a>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              {!isPastEvent && (
                <Link href={`/dashboard/events/edit/${event.id}`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(true)} 
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Event Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={() => router.push(`/dashboard/guests/${event.id}`)}>
                <Users className="h-4 w-4 mr-2" />
                Manage Guest List
              </Button>
              
              <Button className="w-full" onClick={() => router.push(`/dashboard/communications/${event.id}`)}>
                Send Communications
              </Button>
              
              {!isPastEvent && event.is_public && (
                <Button className="w-full" variant="outline" onClick={() => {
                  const inviteUrl = getInvitationUrl();
                  if (inviteUrl) {
                    navigator.clipboard.writeText(inviteUrl);
                    alert('Invitation link copied to clipboard!');
                  }
                }}>
                  Copy Invitation Link
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
              onClick={deleteEvent}
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