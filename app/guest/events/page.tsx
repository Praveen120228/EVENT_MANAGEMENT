'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { CalendarRange, Loader2, MapPin, Clock, User, ArrowRight, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { getSupabaseClient } from '@/lib/supabase'
import { useSupabase } from '@/hooks/useSupabase'

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  organizer_id: string
  organizer_name: string
}

interface GuestEvent {
  id: string
  event_id: string
  event: Event
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  response_date: string | null
  message: string | null
  created_at: string
  updated_at: string
}

export default function GuestEventsPage() {
  const { user, supabase, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<GuestEvent[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/guest/login')
      return
    }

    fetchGuestEvents()
  }, [user, authLoading])

  const fetchGuestEvents = async () => {
    if (!supabase || !user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('guests')
        .select(`
          id,
          event_id,
          name,
          email,
          status,
          response_date,
          message,
          created_at,
          updated_at,
          event:events(
            id,
            title,
            description,
            date,
            time,
            location,
            organizer_id,
            profiles(full_name)
          )
        `)
        .eq('email', user.email)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to include organizer name
      const formattedEvents = data.map(item => ({
        ...item,
        event: {
          ...item.event,
          organizer_name: item.event.profiles.full_name
        }
      }))

      setEvents(formattedEvents)
    } catch (err: any) {
      console.error('Error fetching events:', err)
      setError('Failed to load your events. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Attending</Badge>
      case 'declined':
        return <Badge variant="destructive">Not Attending</Badge>
      case 'pending':
      default:
        return <Badge variant="outline">Pending Response</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'declined':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'pending':
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">Specyf</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await supabase?.auth.signOut()
                router.push('/guest/login')
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Event Invitations</h1>
          <p className="text-gray-500">
            View and respond to events you've been invited to
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6 flex flex-col items-center text-center py-16">
              <CalendarRange className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Invitations Yet</h3>
              <p className="text-gray-500 max-w-md mb-6">
                You haven't been invited to any events yet. When someone invites you to an event, it will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((guestEvent) => (
              <Card key={guestEvent.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-1">
                    {getStatusBadge(guestEvent.status)}
                  </div>
                  <CardTitle className="text-xl">{guestEvent.event.title}</CardTitle>
                  <CardDescription>
                    Invitation from {guestEvent.event.organizer_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(guestEvent.event.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                      {guestEvent.event.time && (
                        <p className="text-sm text-gray-500">
                          {guestEvent.event.time}
                        </p>
                      )}
                    </div>
                  </div>
                  {guestEvent.event.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 shrink-0 mt-1" />
                      <p className="text-sm">{guestEvent.event.location}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-gray-500 shrink-0 mt-1" />
                    <p className="text-sm">Invited as {guestEvent.name}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {getStatusIcon(guestEvent.status)}
                    <span className="text-sm ml-2">
                      {guestEvent.status === 'pending' ? 'Not responded yet' : 
                        `Responded ${guestEvent.response_date ? format(new Date(guestEvent.response_date), 'MMM d') : ''}`}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link href={`/guest/events/${guestEvent.event_id}`}>
                      View <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 