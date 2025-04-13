"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, ArrowLeft, Calendar, Mail, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

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
  description: string | null
  date: string
  time: string | null
  location: string | null
  max_guests: number | null
  organizer_id: string
  created_at: string
  updated_at: string
}

interface EmailLog {
  id: string
  event_id: string
  type: 'invitation' | 'reminder'
  sent_at: string
  recipient_count: number
}

interface Announcement {
  id: string
  event_id: string
  title: string
  content: string
  created_at: string
}

export default function EventCommunicationsPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const eventId = params.eventId as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [sendingEmails, setSendingEmails] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false)
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementContent, setAnnouncementContent] = useState("")
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    fetchEventData()
  }, [eventId])

  async function fetchEventData() {
    setLoading(true)
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (eventError) throw eventError
      if (!eventData) throw new Error('Event not found')
      
      setEvent(eventData)

      // Fetch guests
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
      
      if (guestError) throw guestError
      setGuests(guestData || [])

      // Fetch email logs (for demonstration - this table would need to be created)
      // In a real implementation, you would create an email_logs table
      setEmailLogs([
        // Sample data - in a real app, this would come from the database
        {
          id: '1',
          event_id: eventId,
          type: 'invitation',
          sent_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          recipient_count: 5
        }
      ])

      // Fetch announcements
      const { data: announcementData, error: announcementError } = await supabase
        .from('event_announcements')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
      
      if (announcementError) throw announcementError
      setAnnouncements(announcementData || [])
    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load event data')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedGuests.size === guests.length) {
      // Deselect all
      setSelectedGuests(new Set())
    } else {
      // Select all
      setSelectedGuests(new Set(guests.map(guest => guest.id)))
    }
  }

  const handleSelectGuest = (guestId: string) => {
    const newSelected = new Set(selectedGuests)
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId)
    } else {
      newSelected.add(guestId)
    }
    setSelectedGuests(newSelected)
  }

  const sendInvitations = async () => {
    if (selectedGuests.size === 0) {
      setError('Please select at least one guest')
      return
    }

    setSendingEmails(true)
    setError('')
    setSuccess('')

    try {
      const guestIds = Array.from(selectedGuests)
      const baseUrl = window.location.origin

      // Call API endpoint instead of direct import
      const response = await fetch('/api/emails/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          guestIds,
          baseUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation emails')
      }
      
      setSuccess(`Invitation emails sent to ${selectedGuests.size} guests successfully!`)
      setSelectedGuests(new Set())
      
      // In a real app, you would record this in the email_logs table
      // and then refresh the email logs
    } catch (error: any) {
      console.error('Error sending invitations:', error)
      setError(error.message || 'Failed to send invitation emails')
    } finally {
      setSendingEmails(false)
    }
  }

  const sendReminders = async () => {
    if (selectedGuests.size === 0) {
      setError('Please select at least one guest')
      return
    }

    setSendingEmails(true)
    setError('')
    setSuccess('')

    try {
      const guestIds = Array.from(selectedGuests)
      const baseUrl = window.location.origin

      // Call API endpoint instead of direct import
      const response = await fetch('/api/emails/send-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          guestIds,
          baseUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reminder emails')
      }
      
      setSuccess(`Reminder emails sent to ${selectedGuests.size} guests successfully!`)
      setSelectedGuests(new Set())
      
      // In a real app, you would record this in the email_logs table
      // and then refresh the email logs
    } catch (error: any) {
      console.error('Error sending reminders:', error)
      setError(error.message || 'Failed to send reminder emails')
    } finally {
      setSendingEmails(false)
    }
  }

  const sendAnnouncement = async () => {
    if (!announcementTitle || !announcementContent) {
      setError('Please enter both a title and content for your announcement')
      return
    }

    setSendingAnnouncement(true)
    setError('')
    setSuccess('')

    try {
      const baseUrl = window.location.origin

      // Call API endpoint instead of direct import
      const response = await fetch('/api/emails/send-announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          announcementTitle,
          announcementContent,
          baseUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send announcement emails')
      }
      
      setSuccess(`Announcement sent to all guests successfully!`)
      setAnnouncementTitle('')
      setAnnouncementContent('')
      setShowAnnouncementForm(false)
      
      // Refresh the announcements list
      fetchEventData()
    } catch (error: any) {
      console.error('Error sending announcement:', error)
      setError(error.message || 'Failed to send announcement')
    } finally {
      setSendingAnnouncement(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading communications dashboard...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertDescription>Event not found or you do not have permission to view it.</AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => router.push('/dashboard/events')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.push(`/dashboard/guests/${eventId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Communications Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            <Calendar className="inline h-4 w-4 mr-1" />
            {format(new Date(event.date), 'PPP')}
            {event.time && ` at ${event.time}`}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Emails</TabsTrigger>
          <TabsTrigger value="announce">Announcements</TabsTrigger>
          <TabsTrigger value="history">Email History</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Communications</CardTitle>
              <CardDescription>
                Select guests and send invitations or reminders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedGuests.size > 0 && selectedGuests.size === guests.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No guests found for this event.
                        </TableCell>
                      </TableRow>
                    ) : (
                      guests.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedGuests.has(guest.id)}
                              onCheckedChange={() => handleSelectGuest(guest.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{guest.name}</TableCell>
                          <TableCell>{guest.email}</TableCell>
                          <TableCell>
                            <Badge variant={
                              guest.status === 'confirmed' ? 'default' :
                              guest.status === 'declined' ? 'destructive' :
                              'outline'
                            }>
                              {guest.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(guest.created_at), 'MM/dd/yyyy')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedGuests.size} of {guests.length} guests selected
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={sendInvitations}
                  disabled={sendingEmails || selectedGuests.size === 0}
                >
                  {sendingEmails ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                  Send Invitations
                </Button>
                <Button
                  onClick={sendReminders}
                  disabled={sendingEmails || selectedGuests.size === 0}
                >
                  {sendingEmails ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Send Reminders
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="announce" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Announcement</CardTitle>
              <CardDescription>
                Create and send announcements to all guests for this event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showAnnouncementForm ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="announcement-title" className="block mb-2">Announcement Title</Label>
                    <Input 
                      id="announcement-title"
                      placeholder="e.g., Schedule Update, Important Information"
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="announcement-content" className="block mb-2">Announcement Content</Label>
                    <Textarea 
                      id="announcement-content"
                      placeholder="Enter your announcement details here..."
                      value={announcementContent}
                      onChange={(e) => setAnnouncementContent(e.target.value)}
                      rows={6}
                    />
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAnnouncementForm(false)}
                      disabled={sendingAnnouncement}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={sendAnnouncement}
                      disabled={sendingAnnouncement || !announcementTitle.trim() || !announcementContent.trim()}
                    >
                      {sendingAnnouncement ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Announcement
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-4">Use announcements to share important updates with all guests attending this event.</p>
                  <Button onClick={() => setShowAnnouncementForm(true)}>
                    Create New Announcement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Previous Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {announcements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No announcements have been sent for this event yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      announcements.map((announcement) => (
                        <TableRow key={announcement.id}>
                          <TableCell className="font-medium">{announcement.title}</TableCell>
                          <TableCell>{format(new Date(announcement.created_at), 'PPP p')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Sent
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>
                Record of all emails sent for this event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Recipients</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          No emails have been sent for this event yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      emailLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium capitalize">{log.type}</TableCell>
                          <TableCell>{format(new Date(log.sent_at), 'PPP p')}</TableCell>
                          <TableCell>{log.recipient_count} recipients</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 