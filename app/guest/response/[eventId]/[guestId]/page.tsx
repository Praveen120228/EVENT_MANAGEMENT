"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, MapPinIcon, ClockIcon, Calendar, Loader2, CheckCircle, XCircle } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
}

export default function GuestResponsePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const eventId = params.eventId as string
  const guestId = params.guestId as string
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [guest, setGuest] = useState<Guest | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  useEffect(() => {
    fetchEventAndGuestData()
  }, [eventId, guestId])
  
  async function fetchEventAndGuestData() {
    try {
      setLoading(true)
      
      console.log("Fetching data for:", { eventId, guestId });
      
      // Fetch event data
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors
      
      if (eventError) {
        console.error("Event fetch error:", eventError);
        throw new Error(`Event not found: ${eventError.message}`);
      }
      
      if (!eventData) {
        console.error("No event data returned for ID:", eventId);
        throw new Error('Event not found');
      }
      
      // Fetch guest data
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
      
      setEvent(eventData);
      setGuest(guestData);
      setMessage(guestData.message || "");
      
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load event data');
    } finally {
      setLoading(false);
    }
  }
  
  async function handleResponse(status: 'confirmed' | 'declined') {
    try {
      setSubmitting(true)
      setError("")
      
      console.log("Updating guest response:", { guestId, eventId, status })
      
      const { error } = await supabase
        .from('guests')
        .update({ 
          status, 
          message,
          response_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId)
        .eq('event_id', eventId)
      
      if (error) throw new Error(`Failed to update response: ${error.message}`)
      
      setSuccess(`Thank you! Your response has been recorded as ${status}.`)
      
      // Refetch the guest data to update the UI
      const { data: updatedGuest, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .eq('id', guestId)
        .maybeSingle()
      
      if (fetchError) {
        console.error("Error fetching updated guest data:", fetchError);
        // We don't throw here since the update was successful
      }

      if (updatedGuest) {
        setGuest(updatedGuest)
      }
      
    } catch (err: any) {
      console.error('Error responding to event:', err)
      setError(err.message || 'Failed to update your response')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl py-10 px-4">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto max-w-3xl py-10 px-4">
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
      <div className="container mx-auto max-w-3xl py-10 px-4">
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
    <div className="container mx-auto max-w-3xl py-10 px-4">
      {success ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-emerald-500 p-6 text-white text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Response Recorded</h1>
          </div>
          <div className="p-6">
            <p className="text-center text-lg mb-6">{success}</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="font-semibold text-lg mb-2">{event.title}</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><Calendar className="inline h-4 w-4 mr-1" /> {format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</p>
                {event.time && <p><ClockIcon className="inline h-4 w-4 mr-1" /> {event.time}</p>}
                {event.location && <p><MapPinIcon className="inline h-4 w-4 mr-1" /> {event.location}</p>}
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  // Route to the full event view page
                  router.push(`/guest/events/${eventId}?guestId=${guestId}`)
                }}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                View Event Details
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader className="bg-emerald-500 text-white">
            <CardTitle className="text-2xl">{event.title}</CardTitle>
            <CardDescription className="text-emerald-50">
              You're invited to this event
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            {event.description && (
              <div className="mb-6">
                <p>{event.description}</p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-600 space-y-2">
                <p><Calendar className="inline h-4 w-4 mr-1" /> {format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}</p>
                {event.time && <p><ClockIcon className="inline h-4 w-4 mr-1" /> {event.time}</p>}
                {event.location && <p><MapPinIcon className="inline h-4 w-4 mr-1" /> {event.location}</p>}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="font-medium mb-1">Will you attend this event?</p>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => handleResponse('confirmed')}
                  className="bg-emerald-500 hover:bg-emerald-600 flex-1"
                  disabled={submitting || guest.status === 'confirmed'}
                >
                  {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  {guest.status === 'confirmed' ? 'You confirmed' : 'Yes, I will attend'}
                </Button>
                
                <Button
                  onClick={() => handleResponse('declined')}
                  variant="outline"
                  className="border-red-300 text-red-500 hover:bg-red-50 flex-1"
                  disabled={submitting || guest.status === 'declined'}
                >
                  {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                  {guest.status === 'declined' ? 'You declined' : 'No, I cannot attend'}
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block font-medium mb-1">
                Message to organizer (optional)
              </label>
              <Textarea
                id="message"
                placeholder="Add any additional information or questions for the organizer..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full"
              />
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 justify-between">
            <p className="text-sm text-gray-500">
              Hello, <span className="font-medium">{guest.name}</span>
            </p>
            {guest.status !== 'pending' && (
              <Button 
                onClick={() => {
                  // Route to the full event view page
                  router.push(`/guest/events/${eventId}?guestId=${guestId}`)
                }}
                variant="outline"
                size="sm"
              >
                View Event Details
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 