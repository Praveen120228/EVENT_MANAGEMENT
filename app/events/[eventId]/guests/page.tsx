'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ArrowLeft, Users, AlertCircle, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Guest {
  id: string
  event_id: string
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  response_date: string | null
  message: string | null
  created_at: string
  updated_at: string
}

interface Event {
  id: string
  title: string
  organizer_id: string
  max_guests: number
}

export default function GuestsPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const eventId = params.eventId as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [guestId, setGuestId] = useState<string | null>(null)
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0
  })

  // Fetch event and guests
  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, title, organizer_id, max_guests')
          .eq('id', eventId)
          .single()
        
        if (eventError) throw eventError
        
        setEvent(eventData)
        
        // Fetch guests
        const { data: guestsData, error: guestsError } = await supabase
          .from('guests')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: true })
        
        if (guestsError) throw guestsError
        
        setGuests(guestsData || [])
        
        // Calculate stats
        const confirmed = guestsData?.filter(g => g.status === 'confirmed').length || 0
        const declined = guestsData?.filter(g => g.status === 'declined').length || 0
        const pending = guestsData?.filter(g => g.status === 'pending').length || 0
        
        setStats({
          total: guestsData?.length || 0,
          confirmed,
          declined,
          pending
        })
        
        // Check if guest exists in URL params
        const urlParams = new URLSearchParams(window.location.search)
        const guest = urlParams.get('guest')
        
        if (guest) {
          setGuestId(guest)
          
          // Find current guest
          const currentGuestData = guestsData?.find(g => g.id === guest) || null
          setCurrentGuest(currentGuestData)
        }
      } catch (err: any) {
        console.error('Error fetching data:', err)
        setError(err.message || 'Failed to load guest list')
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16" />
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
          <Users className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Guest List</h1>
        </div>
        
        <p className="text-gray-500 mb-8">
          See who's attending {event.title}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Attending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Not Attending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{stats.declined}</p>
            </CardContent>
          </Card>
        </div>
        
        {currentGuest && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <CardTitle>Your RSVP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-4">
                  {currentGuest.status === 'confirmed' ? (
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  ) : currentGuest.status === 'declined' ? (
                    <XCircle className="h-10 w-10 text-red-500" />
                  ) : (
                    <HelpCircle className="h-10 w-10 text-yellow-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{currentGuest.name}</p>
                  <p className="text-sm text-gray-500">{currentGuest.email}</p>
                  {currentGuest.message && (
                    <p className="text-sm mt-1 italic">"{currentGuest.message}"</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/events/${eventId}?guest=${currentGuest.id}`}>
                <Button variant="outline">Update RSVP</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
        
        <div className="space-y-4">
          {guests.length > 0 ? (
            guests.map((guest) => (
              <Card key={guest.id} className={guest.id === guestId ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Avatar className="mr-4">
                      <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="font-medium">{guest.name}</p>
                        {guest.id === guestId && (
                          <Badge variant="outline" className="ml-2">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{guest.email}</p>
                    </div>
                    <div>
                      {guest.status === 'confirmed' ? (
                        <Badge className="bg-green-500">Attending</Badge>
                      ) : guest.status === 'declined' ? (
                        <Badge variant="destructive">Not Attending</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No guests have RSVP'd yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 