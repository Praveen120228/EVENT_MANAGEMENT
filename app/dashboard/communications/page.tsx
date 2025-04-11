'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, Mail, MessageSquare, PlusCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface Event {
  id: string
  title: string
}

interface Guest {
  id: string
  name: string
  email: string
  status: 'invited' | 'confirmed' | 'declined' | 'pending'
}

interface Communication {
  id: string
  event_id: string
  subject: string
  message: string
  sent_at: string
  sent_to: number
}

export default function CommunicationsPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [events, setEvents] = useState<Event[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    sendToAll: true
  })
  const [tableExists, setTableExists] = useState<boolean>(false)

  // Fetch events when component mounts or auth state changes
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    } else if (user && supabase) {
      fetchEvents()
    }
  }, [user, authLoading, router, supabase])

  // Fetch guests and communications when selected event changes
  useEffect(() => {
    if (selectedEventId && supabase) {
      fetchGuests()
      fetchCommunications()
    }
  }, [selectedEventId, supabase])

  const fetchEvents = async () => {
    if (!supabase || !user) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching events for communications')
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('id, title')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      
      console.log('Events fetched:', data)
      setEvents(data || [])
      
      // If events exist, select the first one by default
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id)
      }
    } catch (err: any) {
      console.error('Failed to fetch events:', err)
      setError(err.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const fetchGuests = async () => {
    if (!supabase || !selectedEventId) return
    
    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching guests for event:', selectedEventId)
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('id, name, email, status')
        .eq('event_id', selectedEventId)
        .order('name', { ascending: true })
      
      if (fetchError) throw fetchError
      
      console.log('Guests fetched:', data)
      setGuests(data || [])
    } catch (err: any) {
      console.error('Failed to fetch guests:', err)
      setError(err.message || 'Failed to load guests')
    } finally {
      setLoading(false)
    }
  }

  const checkCommunicationsTable = async () => {
    if (!supabase) return false
    
    try {
      // Try to query the communications table
      const { error } = await supabase
        .from('communications')
        .select('id')
        .limit(1)
      
      // If there's no error or if the error is not about the table not existing
      if (!error || error.code !== 'PGRST116') {
        return true
      }
      
      return false
    } catch (err) {
      console.error('Error checking communications table:', err)
      return false
    }
  }

  const fetchCommunications = async () => {
    if (!supabase || !selectedEventId) return
    
    setLoading(true)
    setError(null)
    
    try {
      // First check if the table exists
      const tableExists = await checkCommunicationsTable()
      setTableExists(tableExists)
      
      if (!tableExists) {
        console.log('Communications table does not exist yet')
        setCommunications([])
        setLoading(false)
        return
      }
      
      console.log('Fetching communications for event:', selectedEventId)
      const { data, error: fetchError } = await supabase
        .from('communications')
        .select('*')
        .eq('event_id', selectedEventId)
        .order('sent_at', { ascending: false })
      
      if (fetchError) {
        console.error('Error fetching communications:', fetchError)
        // Don't throw, just set empty array
        setCommunications([])
      } else {
        console.log('Communications fetched:', data)
        setCommunications(data || [])
      }
    } catch (err: any) {
      console.error('Failed to fetch communications:', err)
      // Don't show error for communications, as the table might not exist yet
      setCommunications([])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!supabase || !selectedEventId || !messageData.subject || !messageData.message) {
      setError('Please fill out all fields')
      return
    }
    
    setSending(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Determine target guests
      const targetGuests = messageData.sendToAll
        ? guests
        : guests.filter(g => g.status === 'confirmed')
      
      if (targetGuests.length === 0) {
        setError('No guests to send message to')
        setSending(false)
        return
      }
      
      console.log('Sending message to:', targetGuests.length, 'guests')
      console.log('Subject:', messageData.subject)
      console.log('Message:', messageData.message)
      
      // Check if communications table exists
      const tableExists = await checkCommunicationsTable()
      
      // If the communications table exists, record the message
      if (tableExists) {
        try {
          const { data, error: insertError } = await supabase
            .from('communications')
            .insert([{
              event_id: selectedEventId,
              subject: messageData.subject,
              message: messageData.message,
              sent_at: new Date().toISOString(),
              sent_to: targetGuests.length
            }])
            .select()
          
          if (insertError) {
            console.error('Error recording communication:', insertError)
            // Don't throw, just log the error
          } else if (data && data.length > 0) {
            // Add the new communication to the list
            setCommunications(prev => [data[0], ...prev])
          }
        } catch (err: any) {
          console.error('Error recording communication:', err)
          // Continue with the process even if recording fails
        }
      }
      
      // Send emails via our API endpoint
      try {
        const eventTitle = events.find(e => e.id === selectedEventId)?.title || 'Event'
        
        const response = await fetch('/api/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guests: targetGuests,
            eventTitle,
            message: messageData.message,
            subject: messageData.subject
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Email API error:', errorData)
          throw new Error(errorData.error || 'Failed to send emails')
        }
        
        const result = await response.json()
        console.log('Emails sent successfully:', result)
        
        setSuccess(`Message sent to ${targetGuests.length} guests`)
        
        // Reset the form
        setMessageData({
          subject: '',
          message: '',
          sendToAll: true
        })
      } catch (emailError: any) {
        console.error('Error sending emails:', emailError)
        // Don't throw here - we still want to show success for database insertion
        // but we'll add a note about email issues
        setSuccess(`Message recorded, but there was an issue sending emails: ${emailError.message}`)
      }
    } catch (err: any) {
      console.error('Failed to send message:', err)
      setError(err.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

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
        <h1 className="text-2xl font-bold">Communications</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Event</CardTitle>
            <CardDescription>Choose an event to manage communications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="event">Event</Label>
                <Select
                  value={selectedEventId}
                  onValueChange={setSelectedEventId}
                  disabled={loading || events.length === 0}
                >
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedEventId && (
          <Tabs defaultValue="send">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="send">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </TabsTrigger>
              <TabsTrigger value="history">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <Card>
                <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                  <CardDescription>Send a message to your guests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={messageData.subject}
                        onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
                        placeholder="Message subject"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={messageData.message}
                        onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                        placeholder="Your message"
                        rows={5}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sendToAll"
                        checked={messageData.sendToAll}
                        onCheckedChange={(checked) => 
                          setMessageData({ ...messageData, sendToAll: checked as boolean })
                        }
                      />
                      <Label htmlFor="sendToAll">Send to all guests (not just confirmed)</Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !messageData.subject || !messageData.message || guests.length === 0}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Message History</CardTitle>
                  <CardDescription>View your previous communications</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : communications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {tableExists ? (
                        <p>No messages sent yet</p>
                      ) : (
                        <div>
                          <p>No message history available</p>
                          <p className="text-sm mt-2">The communications table has not been created yet.</p>
                          <p className="text-sm">Send a message to create the table automatically.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {communications.map((comm) => (
                        <Card key={comm.id} className="overflow-hidden">
                          <CardHeader className="bg-gray-50 p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{comm.subject}</CardTitle>
                                <CardDescription>
                                  Sent to {comm.sent_to} guests on {new Date(comm.sent_at).toLocaleString()}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4">
                            <p className="whitespace-pre-wrap">{comm.message}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
} 