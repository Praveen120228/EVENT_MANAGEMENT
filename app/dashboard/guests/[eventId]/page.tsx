'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, Users, ArrowLeft, CheckCircle, XCircle, HelpCircle, Mail, Plus, Trash2, Edit, FileText, Download, MailPlus, FileText as MailTemplate } from 'lucide-react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  date: string
  max_guests: number
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'invitation' | 'reminder' | 'confirmation' | 'custom'
  created_at: string
  updated_at: string
  organizer_id: string
  event_id?: string | null
}

export default function EventGuestsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [event, setEvent] = useState<Event | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'declined'>('all')
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showBulkPanel, setShowBulkPanel] = useState(false)
  const [currentGuestId, setCurrentGuestId] = useState<string | null>(null)
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null)
  const [bulkInput, setBulkInput] = useState('')
  const [showBulkAddDialog, setShowBulkAddDialog] = useState(false)
  
  // New states for template management
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null)
  const [showCreateTemplatePanel, setShowCreateTemplatePanel] = useState(false)
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    subject: '',
    body: '',
    type: 'invitation' as 'invitation' | 'reminder' | 'confirmation' | 'custom'
  })
  
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0
  })
  
  // Form state for adding/editing guests
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'pending' as 'pending' | 'confirmed' | 'declined',
    message: ''
  })
  
  // Reference to the sheet component
  const sheetRef = useRef<HTMLDivElement>(null)

  const eventId = params.eventId as string

  useEffect(() => {
    if (authLoading) {
      // Still loading auth state, wait
      return;
    }
    
    if (!user) {
      // Not logged in, redirect to login
      router.push('/auth/login');
      return;
    }
    
    if (!supabase) {
      // Supabase client not available
      setError('Database connection not available. Please try again later.');
      setLoading(false);
      return;
    }
    
    if (!eventId) {
      // No event ID provided
      setError('No event specified.');
      setLoading(false);
      return;
    }
    
    // All required data is available, fetch events and guests
    fetchEventAndGuests();
    fetchTemplates();
  }, [user, authLoading, supabase, eventId]);

  const fetchEventAndGuests = async () => {
    if (!supabase || !user || !eventId) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id, title, date, max_guests')
        .eq('id', eventId)
        .eq('organizer_id', user.id)
        .single()

      if (eventError) {
        console.error('Error fetching event:', eventError)
        setError(`Failed to load event: ${eventError.message || 'Unknown error'}`)
        setLoading(false)
        return
      }

      if (!eventData) {
        setError('Event not found or you do not have permission to access it')
        setLoading(false)
        return
      }

      setEvent(eventData)

      // Fetch guests
      await fetchGuests()
    } catch (err) {
      console.error('Failed to fetch event:', err)
      setError(typeof err === 'object' && err !== null && 'message' in err 
        ? `Error: ${(err as Error).message}` 
        : 'An unexpected error occurred while loading the event')
      setLoading(false)
    }
  }

  const fetchGuests = async () => {
    if (!supabase || !eventId) return

    try {
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching guests:', fetchError)
        setError(`Failed to load guests: ${fetchError.message || 'Unknown error'}`)
        setLoading(false)
        return
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
      console.error('Failed to fetch guests:', err)
      setError(typeof err === 'object' && err !== null && 'message' in err 
        ? `Error: ${(err as Error).message}` 
        : 'An unexpected error occurred while loading guest list')
    } finally {
      setLoading(false)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    if (value === 'pending' || value === 'confirmed' || value === 'declined') {
      setFormData(prev => ({ 
        ...prev, 
        status: value 
      }))
    }
  }

  // Reset form and messages
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      status: 'pending',
      message: ''
    })
    setCurrentGuestId(null)
    setShowEditPanel(false)
    resetMessages()
  }

  // Reset success and error messages
  const resetMessages = () => {
    setError('')
    setSuccess('')
    
    // Auto-hide success message after 3 seconds if it exists
    if (success) {
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    }
    // Auto-hide error message after 5 seconds if it exists
    if (error) {
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  // Function to handle editing a guest
  const handleEditGuestClick = (guest: Guest) => {
    setFormData({
      name: guest.name,
      email: guest.email,
      status: guest.status,
      message: guest.message || ''
    })
    setCurrentGuestId(guest.id)
    setShowEditPanel(true)
  }

  // Function to add a new guest
  const addGuest = async () => {
    if (!event?.id) return

    setLoading(true)
    resetMessages()

    try {
      // Check if guest with this email already exists for this event
      const { data: existingGuests } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', event.id)
        .eq('email', formData.email)

      if (existingGuests && existingGuests.length > 0) {
        setError('A guest with this email already exists for this event')
        setLoading(false)
        return
      }

      // Insert the new guest
      const { error: insertError } = await supabase
        .from('guests')
        .insert({
          event_id: event.id,
          name: formData.name,
          email: formData.email,
          status: formData.status,
          message: formData.message || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        throw insertError
      }

      // Refetch guests to update the list
      await fetchGuests()
      setSuccess('Guest added successfully')
      resetForm()
      setShowAddPanel(false)
    } catch (error: any) {
      setError(error.message || 'Failed to add guest')
    } finally {
      setLoading(false)
    }
  }

  // Function to update an existing guest
  const updateGuest = async () => {
    if (!currentGuestId) {
      setError('No guest selected for editing')
      return
    }
    
    try {
      setLoading(true)
      resetMessages()
      
      const { error } = await supabase
        .from('guests')
        .update({ 
          name: formData.name,
          email: formData.email,
          status: formData.status,
          message: formData.message || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentGuestId)
        
      if (error) throw error
      
      await fetchGuests()
      setSuccess('Guest updated successfully')
      resetForm()
      setShowEditPanel(false)
      setCurrentGuestId(null)
    } catch (err: any) {
      setError(err.message || 'Failed to update guest')
    } finally {
      setLoading(false)
    }
  }

  const deleteGuest = async () => {
    if (!supabase || !guestToDelete) return
    
    setLoading(true)
    
    try {
      const { error: deleteError } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestToDelete.id)
        
      if (deleteError) throw deleteError
      
      setSuccess('Guest deleted successfully')
      await fetchGuests()
    } catch (err) {
      console.error('Failed to delete guest:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete guest')
    } finally {
      setLoading(false)
      setGuestToDelete(null)
    }
  }

  const bulkAddGuests = async () => {
    try {
      setLoading(true)
      const lines = bulkInput.trim().split('\n')
      const newGuests = []
      
      for (const line of lines) {
        if (!line.trim()) continue
        
        const parts = line.split(',').map(part => part.trim())
        if (parts.length < 2) {
          throw new Error(`Invalid format: ${line}. Should be "Name, Email, Status(optional)"`)
        }
        
        const [name, email, status = 'pending'] = parts
        if (!name || !email) {
          throw new Error(`Name and email are required: ${line}`)
        }
        
        if (status && !['pending', 'confirmed', 'declined'].includes(status)) {
          throw new Error(`Invalid status "${status}" in line: ${line}. Must be pending, confirmed, or declined.`)
        }
        
        newGuests.push({
          event_id: eventId,
          name,
          email,
          status: status as 'pending' | 'confirmed' | 'declined',
          response_date: null,
          message: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
      
      if (newGuests.length === 0) {
        throw new Error('No valid guests to add')
      }
      
      const { error } = await supabase
        .from('guests')
        .insert(newGuests)
        
      if (error) throw error
      
      setBulkInput('')
      setSuccess(`Successfully added ${newGuests.length} guests`)
      fetchGuests()
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to add guests')
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError('')
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  const filteredGuests = guests.filter(guest => {
    return filterStatus === 'all' || guest.status === filterStatus
  })

  // Change guest status
  const changeGuestStatus = async (guestId: string, status: 'pending' | 'confirmed' | 'declined') => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('guests')
        .update({ 
          status, 
          response_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', guestId)
        
      if (error) throw error
      
      setSuccess(`Guest status updated to ${status}`)
      fetchGuests()
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update guest status')
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError('')
      }, 5000)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle status filter change
  const handleStatusFilterChange = (value: 'all' | 'pending' | 'confirmed' | 'declined') => {
    setFilterStatus(value)
  }

  // Function to handle form submission (add or update guest)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset any existing messages
    resetMessages()
    
    if (currentGuestId) {
      // We're editing an existing guest
      updateGuest()
    } else {
      // We're adding a new guest
      addGuest()
    }
  }

  // Function to export guests as CSV
  const exportGuestsAsCSV = () => {
    if (!guests.length) {
      setError('No guests to export')
      return
    }

    try {
      // Filter the guests if there's a filter applied
      const guestsToExport = filterStatus === 'all' 
        ? guests 
        : guests.filter(guest => guest.status === filterStatus)

      // Create CSV header
      const headers = ['Name', 'Email', 'Status', 'Response Date', 'Message', 'Created At']
      
      // Format the guest data for CSV
      const csvData = guestsToExport.map(guest => [
        guest.name,
        guest.email,
        guest.status,
        guest.response_date ? new Date(guest.response_date).toLocaleDateString() : '',
        guest.message || '',
        new Date(guest.created_at).toLocaleDateString()
      ])
      
      // Combine header and rows
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(cell => 
            // Handle commas and quotes in cell content
            typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
              ? `"${cell.replace(/"/g, '""')}"` 
              : cell
          ).join(',')
        )
      ].join('\n')
      
      // Create a Blob with the CSV data
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      
      // Create URL for the Blob
      const url = URL.createObjectURL(blob)
      
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = url
      
      // Set the filename using the event title if available
      const dateStr = new Date().toISOString().split('T')[0]
      const filename = `${event?.title || 'event'}-guests-${dateStr}.csv`
      link.setAttribute('download', filename)
      
      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Release the URL
      URL.revokeObjectURL(url)
      
      setSuccess('Guest list exported successfully')
    } catch (err) {
      console.error('Failed to export guests:', err)
      setError('Failed to export guests')
    }
  }

  // Fetch email templates for this user and event
  const fetchTemplates = async () => {
    if (!supabase || !user || !eventId) return
    
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .or(`organizer_id.eq.${user.id},event_id.eq.${eventId}`)
        .order('name', { ascending: true })
      
      if (error) throw error
      
      setTemplates(data || [])
    } catch (err) {
      console.error('Failed to fetch email templates:', err)
      // Don't show an error message to the user as this is not critical
    }
  }

  // Handle template form input changes
  const handleTemplateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTemplateFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle template type selection
  const handleTemplateTypeChange = (value: string) => {
    if (['invitation', 'reminder', 'confirmation', 'custom'].includes(value)) {
      setTemplateFormData(prev => ({ 
        ...prev, 
        type: value as 'invitation' | 'reminder' | 'confirmation' | 'custom'
      }))
    }
  }

  // Reset template form
  const resetTemplateForm = () => {
    setTemplateFormData({
      name: '',
      subject: '',
      body: '',
      type: 'invitation'
    })
    setCurrentTemplate(null)
  }

  // Handle template editing
  const handleEditTemplate = (template: EmailTemplate) => {
    setTemplateFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type
    })
    setCurrentTemplate(template)
    setShowCreateTemplatePanel(true)
  }

  // Save email template
  const saveTemplate = async () => {
    if (!supabase || !user || !eventId) return
    
    try {
      setLoading(true)
      
      if (!templateFormData.name || !templateFormData.subject || !templateFormData.body) {
        setError('Please fill in all required template fields')
        setLoading(false)
        return
      }
      
      // Check if we're updating or creating
      if (currentTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('email_templates')
          .update({
            name: templateFormData.name,
            subject: templateFormData.subject,
            body: templateFormData.body,
            type: templateFormData.type,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentTemplate.id)
          
        if (error) throw error
        
        setSuccess('Template updated successfully')
      } else {
        // Create new template
        const { error } = await supabase
          .from('email_templates')
          .insert({
            name: templateFormData.name,
            subject: templateFormData.subject,
            body: templateFormData.body,
            type: templateFormData.type,
            organizer_id: user.id,
            event_id: eventId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          
        if (error) throw error
        
        setSuccess('Template created successfully')
      }
      
      // Reset form and refetch templates
      resetTemplateForm()
      fetchTemplates()
      setShowCreateTemplatePanel(false)
    } catch (err) {
      console.error('Failed to save template:', err)
      setError('Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  // Delete template
  const deleteTemplate = async (templateId: string) => {
    if (!supabase || !user) return
    
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', templateId)
        .eq('organizer_id', user.id) // Safety check
        
      if (error) throw error
      
      setSuccess('Template deleted successfully')
      fetchTemplates()
    } catch (err) {
      console.error('Failed to delete template:', err)
      setError('Failed to delete template')
    } finally {
      setLoading(false)
    }
  }

  // Display loading state
  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-full">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/guests')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 break-words">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-emerald-50 text-emerald-800 border-emerald-100 break-words">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:justify-end mb-6">
        <div className="flex flex-wrap gap-2">
          <Sheet open={showAddPanel} onOpenChange={(open) => {
            setShowAddPanel(open);
            if (!open) {
              resetForm();
            }
          }}>
            <SheetTrigger asChild>
              <Button className="w-full sm:w-auto h-12 md:h-10 text-base md:text-sm">
                <Plus className="mr-2 h-5 w-5 md:h-4 md:w-4" /> Add Guest
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add New Guest</SheetTitle>
              </SheetHeader>

              <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Guest Name" 
                    required
                    className="h-12 md:h-10 text-base md:text-sm w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="guest@example.com" 
                    required
                    className="h-12 md:h-10 text-base md:text-sm w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="h-12 md:h-10 text-base md:text-sm w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any notes about this guest" 
                    className="min-h-[100px] text-base md:text-sm w-full"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setShowAddPanel(false);
                    }}
                    className="h-12 md:h-10 text-base md:text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="h-12 md:h-10 text-base md:text-sm w-full sm:w-auto"
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 md:h-4 md:w-4 animate-spin" /> : <Plus className="mr-2 h-5 w-5 md:h-4 md:w-4" />}
                    Add Guest
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="w-full sm:w-auto h-12 md:h-10 text-base md:text-sm"
              >
                <FileText className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                Bulk Add
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle>Bulk Add Guests</DialogTitle>
                <DialogDescription className="text-wrap">
                  Add multiple guests at once. Enter one guest per line in the format:<br />
                  <code className="break-words">Name, Email, Status(optional)</code>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="John Doe, john@example.com, pending"
                  className="min-h-[200px] text-base md:text-sm w-full"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Status can be: pending, confirmed, or declined. If not specified, status will default to pending.
                </p>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button 
                    variant="outline" 
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 h-12 md:h-10 text-base md:text-sm w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  disabled={!bulkInput.trim() || loading}
                  onClick={bulkAddGuests}
                  className="h-12 md:h-10 text-base md:text-sm w-full sm:w-auto"
                >
                  {loading ? <Loader2 className="h-5 w-5 md:h-4 md:w-4 animate-spin mr-2" /> : null}
                  Add Guests
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
           
          <Button 
            variant="outline"
            className="w-full sm:w-auto h-12 md:h-10 text-base md:text-sm border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            onClick={() => router.push(`/dashboard/communications/${eventId}`)}
          >
            <Mail className="mr-2 h-5 w-5 md:h-4 md:w-4" />
            Communications
          </Button>
          
          <Button
            variant="outline"
            onClick={exportGuestsAsCSV}
            className="w-full sm:w-auto h-12 md:h-10 text-base md:text-sm border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            <Download className="mr-2 h-5 w-5 md:h-4 md:w-4" />
            Export CSV
          </Button>

          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 md:h-10 text-base md:text-sm border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              >
                <MailTemplate className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>Email Templates</DialogTitle>
                <DialogDescription>
                  Create and manage email templates for guest communications.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Templates</h3>
                  <Button onClick={() => {
                    resetTemplateForm();
                    setShowCreateTemplatePanel(true);
                  }}
                  size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
                
                {templates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MailTemplate className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't created any templates yet.</p>
                    <p className="text-sm">Templates make it easier to send consistent emails to your guests.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templates.map(template => (
                      <Card key={template.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-500">{template.type} • Created {new Date(template.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700" 
                              onClick={() => deleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Sheet open={showCreateTemplatePanel} onOpenChange={(open) => {
            setShowCreateTemplatePanel(open);
            if (!open) {
              resetTemplateForm();
            }
          }}>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{currentTemplate ? 'Edit Template' : 'Create New Template'}</SheetTitle>
                <SheetDescription>
                  {currentTemplate 
                    ? 'Update your email template with new content.'
                    : 'Create a reusable email template for your guest communications.'}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    name="name"
                    value={templateFormData.name}
                    onChange={handleTemplateInputChange}
                    placeholder="e.g. VIP Invitation"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="templateType">Template Type</Label>
                  <Select 
                    value={templateFormData.type} 
                    onValueChange={handleTemplateTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invitation">Invitation</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="confirmation">Confirmation</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="templateSubject">Email Subject</Label>
                  <Input
                    id="templateSubject"
                    name="subject"
                    value={templateFormData.subject}
                    onChange={handleTemplateInputChange}
                    placeholder="e.g. You're Invited to Our Event!"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="templateBody">Email Body</Label>
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Available variables:</p>
                    <code className="text-xs bg-gray-100 p-1 rounded">
                      {"{guest_name}"} {"{event_name}"} {"{event_date}"} {"{event_time}"} {"{event_location}"}
                    </code>
                  </div>
                  <Textarea
                    id="templateBody"
                    name="body"
                    value={templateFormData.body}
                    onChange={handleTemplateInputChange}
                    placeholder="Dear {guest_name},

We're excited to invite you to {event_name} on {event_date} at {event_time}.

The event will be held at {event_location}.

Please let us know if you can attend!

Best regards,
The Event Team"
                    className="min-h-[200px]"
                    required
                  />
                </div>
              </div>
              
              <SheetFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetTemplateForm();
                    setShowCreateTemplatePanel(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveTemplate}
                  disabled={loading || !templateFormData.name || !templateFormData.subject || !templateFormData.body}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {currentTemplate ? 'Update Template' : 'Create Template'}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
              {event?.max_guests && (
                <span className="ml-2 text-sm text-gray-500">/ {event.max_guests}</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" />
              <span className="text-2xl font-bold">{stats.confirmed}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
              <span className="text-2xl font-bold">{stats.declined}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-2xl font-bold">{stats.pending}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Select 
          value={filterStatus}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-full h-12 md:h-10 text-base md:text-sm">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guest List ({filteredGuests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View - Hidden on small screens */}
          <div className="rounded-md border hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No guests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell>{guest.email}</TableCell>
                      <TableCell>{getStatusBadge(guest.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Sheet open={showEditPanel && currentGuestId === guest.id} onOpenChange={(open) => {
                            setShowEditPanel(open);
                            if (!open) {
                              setCurrentGuestId(null);
                              resetForm();
                            }
                          }}>
                            <SheetTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditGuestClick(guest)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                              <SheetHeader>
                                <SheetTitle>Edit Guest</SheetTitle>
                                <SheetDescription>
                                  Update guest information and status.
                                </SheetDescription>
                              </SheetHeader>
                              <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    placeholder="Guest name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 md:h-10 text-base md:text-sm"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="guest@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-12 md:h-10 text-base md:text-sm"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="status">Status</Label>
                                  <Select value={formData.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-full h-12 md:h-10 text-base md:text-sm">
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="declined">Declined</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="message">Message (Optional)</Label>
                                  <Textarea 
                                    id="message" 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Any notes about this guest" 
                                    className="w-full min-h-[100px] text-base md:text-sm"
                                  />
                                </div>
                                
                                <SheetFooter className="flex-col sm:flex-row pt-4 space-y-2 sm:space-y-0">
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                      resetForm();
                                      setShowEditPanel(false);
                                    }}
                                    className="w-full sm:w-auto h-12 md:h-10 text-base md:text-sm"
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full sm:w-auto h-12 md:h-10 text-base md:text-sm"
                                  >
                                    {loading ? <Loader2 className="h-5 w-5 md:h-4 md:w-4 animate-spin mr-2" /> : null}
                                    Save Changes
                                  </Button>
                                </SheetFooter>
                              </form>
                            </SheetContent>
                          </Sheet>
                         
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700" 
                            onClick={() => setGuestToDelete(guest)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View - Only shown on small screens */}
          <div className="md:hidden space-y-4">
            {filteredGuests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No guests found</p>
              </div>
            ) : (
              filteredGuests.map((guest) => (
                <Card key={guest.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <div className="min-w-0"> {/* Prevent overflow with min-width */}
                        <h3 className="font-medium text-base truncate">{guest.name}</h3>
                        <a href={`mailto:${guest.email}`} className="text-sm text-blue-600 underline truncate block">
                          {guest.email}
                        </a>
                      </div>
                      <div className="self-start">
                        {getStatusBadge(guest.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-sm justify-center"
                        onClick={() => handleEditGuestClick(guest)}
                      >
                        <Edit className="h-5 w-5 mr-2" />
                        Edit
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full h-12 text-sm text-red-500 hover:text-red-700 justify-center" 
                        onClick={() => setGuestToDelete(guest)}
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!guestToDelete} onOpenChange={(open) => !open && setGuestToDelete(null)}>
        <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this guest?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the guest
              from this event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteGuest}
              className="bg-red-600 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 