'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarRange, ArrowLeft, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateEventPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('details')

  // Form state
  const [eventType, setEventType] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [eventLocation, setEventLocation] = useState('')
  const [isOnline, setIsOnline] = useState(false)
  const [maxAttendees, setMaxAttendees] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real application, you would save the event to Supabase here
    // For now, we'll just simulate a delay and redirect
    setTimeout(() => {
      setIsSubmitting(false)
      router.push('/dashboard')
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <CalendarRange className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold">Specyf</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Create a New Event</h1>
              <p className="text-gray-500 dark:text-gray-400">Fill in the details to create your event</p>
            </div>

            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Event Details</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                      <CardDescription>Enter the basic information about your event</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-type">Event Type</Label>
                        <Select value={eventType} onValueChange={setEventType}>
                          <SelectTrigger id="event-type">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="meetup">Meetup</SelectItem>
                            <SelectItem value="conference">Conference</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="birthday">Birthday</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-name">Event Name</Label>
                        <Input
                          id="event-name"
                          placeholder="Enter event name"
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea
                          id="event-description"
                          placeholder="Describe your event"
                          className="min-h-[100px]"
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="event-date">Date</Label>
                          <Input
                            id="event-date"
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-time">Time</Label>
                          <Input
                            id="event-time"
                            type="time"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-location">Location</Label>
                        <Input
                          id="event-location"
                          placeholder="Enter event location"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is-online"
                          checked={isOnline}
                          onChange={(e) => setIsOnline(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <Label htmlFor="is-online">This is an online event</Label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Settings</CardTitle>
                      <CardDescription>Configure additional settings for your event</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-attendees">Maximum Attendees</Label>
                        <Input
                          id="max-attendees"
                          type="number"
                          placeholder="Enter maximum number of attendees"
                          value={maxAttendees}
                          onChange={(e) => setMaxAttendees(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ticket-price">Ticket Price (optional)</Label>
                        <Input
                          id="ticket-price"
                          type="number"
                          placeholder="Enter ticket price"
                          value={ticketPrice}
                          onChange={(e) => setTicketPrice(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>RSVP Settings</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="require-rsvp"
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                              defaultChecked
                            />
                            <Label htmlFor="require-rsvp">Require RSVP</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="allow-guests"
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <Label htmlFor="allow-guests">Allow guests to bring +1</Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Preview</CardTitle>
                      <CardDescription>Preview how your event will appear to guests</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-xl font-bold">{eventName || 'Event Name'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : 'Event Type'}
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center">
                            <span className="w-24 text-sm font-medium">Date:</span>
                            <span>{eventDate || 'Not set'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 text-sm font-medium">Time:</span>
                            <span>{eventTime || 'Not set'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="w-24 text-sm font-medium">Location:</span>
                            <span>{eventLocation || 'Not set'}</span>
                          </div>
                          {isOnline && (
                            <div className="flex items-center">
                              <span className="w-24 text-sm font-medium">Type:</span>
                              <span>Online Event</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium">Description</h4>
                          <p className="mt-1 text-sm">
                            {eventDescription || 'No description provided'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" type="button" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Event...
                    </>
                  ) : (
                    'Create Event'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
} 