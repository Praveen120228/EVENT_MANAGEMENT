'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export type EventType = {
  id: 'workshop' | 'meetup' | 'business' | 'college' | 'personal'
  title: string
  description: string
}

export type Event = {
  id?: string
  title: string
  description: string
  date: string
  time: string
  location: string
  max_guests: number
  event_type: 'workshop' | 'meetup' | 'business' | 'college' | 'personal'
  organizer_id: string
  created_at?: string
  status?: 'draft' | 'published' | 'cancelled' | 'completed'
  is_public?: boolean
  invitation_link?: string
}

// These must exactly match the PostgreSQL ENUM values
const eventTypes: EventType[] = [
  {
    id: 'workshop',
    title: 'Workshop',
    description: 'Interactive learning session'
  },
  {
    id: 'meetup',
    title: 'Meetup',
    description: 'Casual gathering'
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Professional event'
  },
  {
    id: 'college',
    title: 'College',
    description: 'Educational event'
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Personal gathering'
  }
]

export default function CreateEventPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading, initialized } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'organizer_id' | 'created_at'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    max_guests: 0,
    event_type: 'workshop' // Default value that matches the enum
  })

  useEffect(() => {
    if (initialized && !authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, router, initialized, authLoading])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEventTypeChange = (value: string) => {
    // Validate that the value is a valid event type
    if (['workshop', 'meetup', 'business', 'college', 'personal'].includes(value)) {
      setFormData(prev => ({
        ...prev,
        event_type: value as 'workshop' | 'meetup' | 'business' | 'college' | 'personal'
      }))
    } else {
      console.error('Invalid event type:', value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    console.log('Submitting event form...')

    if (!user) {
      setError('You must be logged in to create an event')
      setLoading(false)
      return
    }

    if (!supabase) {
      setError('Database connection not available')
      setLoading(false)
      return
    }

    try {
      // Validate event_type value is a valid ENUM option
      if (!['workshop', 'meetup', 'business', 'college', 'personal'].includes(formData.event_type)) {
        setError('Please select a valid event type')
        setLoading(false)
        return
      }

      // Format data to match database schema
      const eventData = {
        ...formData,
        organizer_id: user.id,
        max_guests: parseInt(formData.max_guests.toString()),
        status: 'published' as const, // Set default status
        is_public: false // Set default visibility
      }

      console.log('Inserting event data:', eventData)

      const { data, error: insertError } = await supabase
        .from('events')
        .insert([eventData])
        .select()

      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }

      console.log('Event created successfully:', data)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Event creation failed:', err)
      
      // Check for specific error types
      if (err.code === '22P02') {
        setError('Invalid input: check that event type is valid')
      } else if (err.code === '23505') {
        setError('This event already exists')
      } else if (err.code === '23503') {
        setError('Referenced row does not exist')
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Failed to create event')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!initialized || authLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
          <CardDescription>Fill in the details for your new event</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <Select
                value={formData.event_type}
                onValueChange={handleEventTypeChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_guests">Maximum Guests</Label>
              <Input
                id="max_guests"
                name="max_guests"
                type="number"
                min="1"
                value={formData.max_guests}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 