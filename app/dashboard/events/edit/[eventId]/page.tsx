'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Loader2, ArrowLeft, Calendar, Save } from 'lucide-react'
import { format, parse } from 'date-fns'

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

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventId = params.eventId as string

  const [formData, setFormData] = useState<Omit<Event, 'id' | 'organizer_id' | 'created_at'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    max_guests: 10,
    event_type: 'meetup',
    status: 'draft',
    is_public: false,
    invitation_link: ''
  })

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

      // Set form data from the fetched event
      setFormData({
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        max_guests: data.max_guests,
        event_type: data.event_type,
        status: data.status || 'draft',
        is_public: data.is_public || false,
        invitation_link: data.invitation_link || ''
      })
    } catch (err) {
      console.error('Failed to fetch event:', err)
      setError(err instanceof Error ? err.message : 'Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, [name]: numValue }))
    }
  }

  const updateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !user) return

    // Simple validation
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Special handling for public events to generate invitation link if it doesn't exist
      let updatedData = { ...formData }
      if (updatedData.is_public && !updatedData.invitation_link) {
        updatedData.invitation_link = `${window.location.origin}/events/${eventId}`
      }

      const { error: updateError } = await supabase
        .from('events')
        .update(updatedData)
        .eq('id', eventId)
        .eq('organizer_id', user.id)

      if (updateError) {
        console.error('Error updating event:', updateError)
        throw updateError
      }

      // Navigate back to the event view page
      router.push(`/dashboard/events/${eventId}`)
    } catch (err) {
      console.error('Failed to update event:', err)
      setError(err instanceof Error ? err.message : 'Failed to update event')
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/dashboard/events/${eventId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Event</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={updateEvent}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
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
                <Label htmlFor="time">Time *</Label>
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
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_guests">Maximum Guests</Label>
                <Input
                  id="max_guests"
                  name="max_guests"
                  type="number"
                  min="1"
                  value={formData.max_guests}
                  onChange={handleNumberChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <Select
                  value={formData.event_type}
                  onValueChange={(value) => handleSelectChange('event_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_public">Public Event</Label>
                <p className="text-sm text-gray-500">
                  Make this event visible to anyone with the invitation link
                </p>
              </div>
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => handleSwitchChange('is_public', checked)}
              />
            </div>

            {formData.is_public && (
              <div className="space-y-2">
                <Label htmlFor="invitation_link">Invitation Link</Label>
                <Input
                  id="invitation_link"
                  name="invitation_link"
                  value={formData.invitation_link}
                  onChange={handleInputChange}
                  placeholder="This will be generated automatically if left empty"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/events/${eventId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 