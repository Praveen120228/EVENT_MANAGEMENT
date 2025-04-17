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
  Bell,
  User
} from 'lucide-react'
import { format } from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

interface Announcement {
  id: string
  event_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  created_by: string | null
  is_published: boolean
}

export default function GuestEventAnnouncementsPage() {
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
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
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
        
        // Fetch event and announcements
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
        setError('Event not found or it may have been deleted.');
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
      
      // Fetch announcements
      const { data: announcementData, error: announcementError } = await supabase
        .from('event_announcements')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      if (announcementError) {
        console.error("Announcement fetch error:", announcementError);
        // Don't block the page load for announcement errors,
        // just set empty announcements
        setAnnouncements([]);
      } else {
        setAnnouncements(announcementData || []);
      }
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
  
  const formatAnnouncementDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return ''
    
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return ''
      }
      return format(date, 'MMMM d, yyyy h:mm a')
    } catch (err) {
      console.error('Error formatting date:', err)
      return ''
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
            <h1 className="text-2xl font-bold mb-1">Announcements</h1>
            <p className="text-gray-500">Important updates from the event organizer</p>
          </div>
          
          {/* Mobile only: back button */}
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
        
        {/* Announcements */}
        {announcements.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Announcements</h3>
              <p className="text-gray-500 mt-2">
                There are no announcements for this event yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle>{announcement.title}</CardTitle>
                  <CardDescription>
                    Posted on {formatAnnouncementDate(announcement.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {announcement.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 