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
import { Loader2, Users, ArrowLeft, CheckCircle, XCircle, HelpCircle, Mail, Plus, Trash2, Edit, FileText } from 'lucide-react'
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
    } catch (error: any) {
      setError(error.message || 'Failed to add guest')
    } finally {
      setLoading(false)
    }
  }

  // Function to update an existing guest
  const updateGuest = async () => {
    if (!currentGuestId) return
    
    try {
      setLoading(true)
      
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
      
      setSuccess('Guest updated successfully')
      fetchGuests()
      resetForm()
      setShowEditPanel(false)
      setCurrentGuestId(null)
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update guest')
      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setError('')
      }, 5000)
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
    if (currentGuestId) {
      updateGuest()
    } else {
      addGuest()
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
    <div className="container mx-auto py-8">
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
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-emerald-50 text-emerald-800 border-emerald-100 mb-6">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end mb-6">
        <div className="flex space-x-2">
          <Sheet open={showAddPanel} onOpenChange={setShowAddPanel}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Guest
              </Button>
            </SheetTrigger>
            <SheetContent>
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
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
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add Guest
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Bulk Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Bulk Add Guests</DialogTitle>
                <DialogDescription>
                  Add multiple guests at once. Enter one guest per line in the format:<br />
                  <code>Name, Email, Status(optional)</code>
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="John Doe, john@example.com, pending"
                  className="min-h-[200px]"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Status can be: pending, confirmed, or declined. If not specified, status will default to pending.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">Cancel</Button>
                </DialogClose>
                <Button 
                  disabled={!bulkInput.trim() || loading}
                  onClick={bulkAddGuests}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Guests
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
           
          <Button 
            variant="outline"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
            onClick={() => router.push(`/dashboard/communications/${eventId}`)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Communications
          </Button>
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

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Select 
          value={filterStatus}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-full">
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
          <div className="rounded-md border">
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
                            if (!open) {
                              setShowEditPanel(false);
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
                            <SheetContent>
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
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="status">Status</Label>
                                  <Select value={formData.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
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
                                  />
                                </div>
                                
                                <SheetFooter className="pt-4">
                                  <SheetClose asChild>
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                      Cancel
                                    </Button>
                                  </SheetClose>
                                  <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
        </CardContent>
      </Card>

      <AlertDialog open={!!guestToDelete} onOpenChange={(open) => !open && setGuestToDelete(null)}>
        <AlertDialogContent>
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