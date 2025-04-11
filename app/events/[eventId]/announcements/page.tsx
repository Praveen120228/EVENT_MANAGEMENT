'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { ArrowLeft, Bell, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface Announcement {
  id: string
  event_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

interface Event {
  id: string
  title: string
  organizer_id: string
}

export default function AnnouncementsPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const eventId = params.eventId as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [guestId, setGuestId] = useState<string | null>(null)

  // Fetch event and announcements
  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, title, organizer_id')
          .eq('id', eventId)
          .single()
        
        if (eventError) throw eventError
        
        setEvent(eventData)
        
        // Fetch announcements
        const { data: announcementsData, error: announcementsError } = await supabase
          .from('announcements')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false })
        
        if (announcementsError) throw announcementsError
        
        setAnnouncements(announcementsData || [])
        
        // Check if guest exists in URL params
        const urlParams = new URLSearchParams(window.location.search)
        const guest = urlParams.get('guest')
        
        if (guest) {
          setGuestId(guest)
        }
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Failed to load announcements')
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
            {[1, 2, 3].map((i) => (
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
          <Bell className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Announcements</h1>
        </div>
        
        <p className="text-gray-500 mb-8">
          Latest updates and announcements for {event.title}
        </p>
        
        {announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id}>
                <CardHeader>
                  <CardTitle>{announcement.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(announcement.created_at), 'MMMM d, yyyy h:mm a')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{announcement.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No announcements available yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 