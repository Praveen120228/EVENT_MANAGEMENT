'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  ArrowLeft, 
  Mail, 
  Send, 
  CalendarClock, 
  Users, 
  CheckCircle, 
  XCircle,
  HelpCircle,
  Info
} from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Guest {
  id: number
  event_id: string
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  message?: string | null
  response_date?: string | null
  created_at: string
  updated_at: string
}

interface Event {
  id: string
  title: string
  date: string
  location: string
  time: string
  description: string
  max_guests: number
  organizer_id: string
}

export default function CommunicationsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0
  })
  
  const [messageType, setMessageType] = useState<'invitation' | 'reminder' | 'update' | 'custom'>('invitation')
  const [targetAudience, setTargetAudience] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailContent, setEmailContent] = useState('')
  
  const eventId = params.eventId as string

  useEffect(() => {
    if (!authLoading && user && supabase && eventId) {
      fetchEventAndGuests()
    } else if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, supabase, eventId, router])

  useEffect(() => {
    if (event) {
      setMessageTemplate(messageType)
    }
  }, [messageType, event])
  
  const fetchEventAndGuests = async () => {
    if (!supabase || !user || !eventId) return

    setLoading(true)
    setError(null)

    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single()

      if (eventError) {
        console.error('Error fetching event:', eventError)
        throw eventError
      }

      setEvent(eventData)

      // Fetch guests
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching guests:', fetchError)
        throw fetchError
      }

      setGuests(data || [])

      // Calculate stats
      const confirmed = data?.filter(g => g.status === 'confirmed').length || 0
      const declined = data?.filter(g => g.status === 'declined').length || 0
      const pending = data?.filter(g => g.status === 'pending').length || 0

      setStats({
        total: data?.length || 0,
        confirmed,
        declined,
        pending
      })
    } catch (err) {
      console.error('Failed to fetch data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load event details')
    } finally {
      setLoading(false)
    }
  }
  
  const setMessageTemplate = (type: 'invitation' | 'reminder' | 'update' | 'custom') => {
    if (!event) return
    
    const eventDate = event.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : 'TBD'
    
    switch (type) {
      case 'invitation':
        setEmailSubject(`Invitation: ${event.title}`)
        setEmailContent(`Hello {name},

You are invited to ${event.title} on ${eventDate} at ${event.time || 'TBD'}.

${event.location ? `Location: ${event.location}` : ''}

${event.description || ''}

Please let us know if you can attend by clicking one of the response buttons below.

Looking forward to seeing you!
`)
        break
        
      case 'reminder':
        setEmailSubject(`Reminder: ${event.title}`)
        setEmailContent(`Hello {name},

This is a friendly reminder about ${event.title} on ${eventDate} at ${event.time || 'TBD'}.

${event.location ? `Location: ${event.location}` : ''}

We're looking forward to seeing you there!
`)
        break
        
      case 'update':
        setEmailSubject(`Update: ${event.title}`)
        setEmailContent(`Hello {name},

We have some updates regarding ${event.title} on ${eventDate}:

[Add your updates here]

If you have any questions, please reply to this email.

Thank you!
`)
        break
        
      case 'custom':
        // Keep current content or set empty if none
        setEmailSubject(emailSubject || `About: ${event.title}`)
        setEmailContent(emailContent || '')
        break
    }
  }
  
  const getTargetGuests = () => {
    switch (targetAudience) {
      case 'all':
        return guests
      case 'pending':
        return guests.filter(g => g.status === 'pending')
      case 'confirmed':
        return guests.filter(g => g.status === 'confirmed')
      case 'declined':
        return guests.filter(g => g.status === 'declined')
      default:
        return guests
    }
  }
  
  const sendCommunications = async () => {
    if (!supabase || !user || !eventId || !event) {
      setError('Missing required information')
      return
    }
    
    const targetGuests = getTargetGuests()
    
    if (targetGuests.length === 0) {
      setError('No guests selected to receive communications')
      return
    }
    
    if (!emailSubject.trim() || !emailContent.trim()) {
      setError('Email subject and content cannot be empty')
      return
    }
    
    setSending(true)
    setError(null)
    setSuccess(null)
    
    try {
      // For each guest, send the email with personalized content
      for (const guest of targetGuests) {
        const personalizedContent = emailContent.replace(/{name}/g, guest.name)
        
        // In a real implementation, you would use an email API service or Supabase Edge Functions
        // This is a simulation
        
        // Log the email instead of actually sending it in this demo
        console.log(`Sending email to ${guest.email}:`)
        console.log(`Subject: ${emailSubject}`)
        console.log(`Content: ${personalizedContent}`)
        
        // Add a delay to simulate sending emails
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      // In the real implementation, you would track these communications in the database
      // For now, just show success message
      setSuccess(`Successfully sent ${messageType} to ${targetGuests.length} guests`)
      
      // Create a log entry in Supabase for the communication
      await supabase.from('communications_log').insert({
        event_id: eventId,
        sender_id: user.id,
        type: messageType,
        subject: emailSubject,
        recipients_count: targetGuests.length,
        target_group: targetAudience
      })
      
    } catch (err) {
      console.error('Failed to send communications:', err)
      setError(err instanceof Error ? err.message : 'Failed to send communications')
    } finally {
      setSending(false)
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Confirmed</Badge>
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const targetGuests = getTargetGuests()

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/dashboard/guests/${eventId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Guests
        </Button>
        <h1 className="text-2xl font-bold">{event?.title ? `${event.title} - Communications` : 'Communications'}</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-emerald-500 bg-emerald-50 text-emerald-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Communications Dashboard</CardTitle>
              <CardDescription>
                Send emails to your event guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CalendarClock className="h-5 w-5 mr-2 text-gray-500" />
                    <h3 className="font-medium">Event Date</h3>
                  </div>
                  <p>
                    {event?.date ? format(new Date(event.date), 'EEEE, MMMM d, yyyy') : 'Date not set'}
                    {event?.time ? ` at ${event.time}` : ''}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 mr-2 text-gray-500" />
                    <h3 className="font-medium">Guest Status</h3>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confirmed: {stats.confirmed}</span>
                    <span>Pending: {stats.pending}</span>
                    <span>Declined: {stats.declined}</span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="messageType">Message Type</Label>
                  <Select 
                    value={messageType} 
                    onValueChange={(value) => setMessageType(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select message type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invitation">Invitation</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="update">Event Update</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="targetAudience">Recipients</Label>
                  <Select 
                    value={targetAudience} 
                    onValueChange={(value) => setTargetAudience(value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Guests ({stats.total})</SelectItem>
                      <SelectItem value="pending">Pending Guests ({stats.pending})</SelectItem>
                      <SelectItem value="confirmed">Confirmed Guests ({stats.confirmed})</SelectItem>
                      <SelectItem value="declined">Declined Guests ({stats.declined})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Preview Recipients</CardTitle>
              <CardDescription>
                {targetGuests.length} guest{targetGuests.length !== 1 ? 's' : ''} will receive this message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-y-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {targetGuests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                          No guests in this category
                        </TableCell>
                      </TableRow>
                    ) : (
                      targetGuests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell className="font-medium">{guest.name}</TableCell>
                          <TableCell>{guest.email}</TableCell>
                          <TableCell>{getStatusBadge(guest.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Message Content</CardTitle>
            <CardDescription>
              Personalize your message with {'{name}'} to include each guest's name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject line"
                />
              </div>
              
              <div>
                <Label htmlFor="emailContent">Email Content</Label>
                <Textarea
                  id="emailContent"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Your message content"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              
              <Button 
                onClick={sendCommunications} 
                disabled={sending || targetGuests.length === 0 || !emailSubject.trim() || !emailContent.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to {targetGuests.length} Guest{targetGuests.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  This demo only simulates sending emails. In a production environment, you would integrate with an email service provider.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 