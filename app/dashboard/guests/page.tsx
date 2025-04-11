'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, Users, Search, Calendar, CheckCircle, XCircle, HelpCircle, ArrowUpDown, FileText, Mail } from 'lucide-react'
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

interface Guest {
  id: number
  event_id: string
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  created_at: string
  updated_at: string
}

interface Event {
  id: string
  title: string
  date: string
}

export default function GuestsPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [guests, setGuests] = useState<(Guest & { eventTitle?: string })[]>([])
  const [filterEvent, setFilterEvent] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    declined: 0,
    pending: 0
  })

  useEffect(() => {
    if (!authLoading && user && supabase) {
      fetchEvents()
    } else if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, supabase])

  useEffect(() => {
    if (events.length > 0) {
      fetchGuests()
    }
  }, [events, supabase])

  const fetchEvents = async () => {
    if (!supabase || !user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('id, title, date')
        .eq('organizer_id', user.id)
        .order('date', { ascending: false })

      if (fetchError) {
        console.error('Error fetching events:', fetchError)
        throw fetchError
      }

      setEvents(data || [])
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError(err instanceof Error ? err.message : 'Failed to load events')
    }
  }

  const fetchGuests = async () => {
    if (!supabase || !user || events.length === 0) return

    setLoading(true)
    setError(null)

    try {
      // Get all event IDs
      const eventIds = events.map(event => event.id)
      
      const { data, error: fetchError } = await supabase
        .from('guests')
        .select('*')
        .in('event_id', eventIds)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching guests:', fetchError)
        throw fetchError
      }

      // Add event title to each guest
      const guestsWithEventTitle = data?.map(guest => {
        const event = events.find(e => e.id === guest.event_id)
        return {
          ...guest,
          eventTitle: event?.title || 'Unknown Event'
        }
      }) || []

      setGuests(guestsWithEventTitle)

      // Calculate stats
      const confirmed = guestsWithEventTitle.filter(g => g.status === 'confirmed').length || 0
      const declined = guestsWithEventTitle.filter(g => g.status === 'declined').length || 0
      const pending = guestsWithEventTitle.filter(g => g.status === 'pending').length || 0

      setStats({
        total: guestsWithEventTitle.length,
        confirmed,
        declined,
        pending
      })
    } catch (err) {
      console.error('Failed to fetch guests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load guests')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
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

  // Filter and sort guests
  const filteredGuests = guests.filter(guest => {
    const matchesEvent = filterEvent === 'all' || guest.event_id === filterEvent
    const matchesStatus = filterStatus === 'all' || guest.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      guest.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesEvent && matchesStatus && matchesSearch
  }).sort((a, b) => {
    let compareA: string = '', compareB: string = ''

    switch (sortBy) {
      case 'name':
        compareA = a.name.toLowerCase()
        compareB = b.name.toLowerCase()
        break
      case 'email':
        compareA = a.email.toLowerCase()
        compareB = b.email.toLowerCase()
        break
      case 'status':
        compareA = a.status
        compareB = b.status
        break
      case 'event':
        compareA = a.eventTitle?.toLowerCase() || ''
        compareB = b.eventTitle?.toLowerCase() || ''
        break
      case 'date':
        compareA = a.created_at
        compareB = b.created_at
        break
      default:
        compareA = a.name.toLowerCase()
        compareB = b.name.toLowerCase()
    }

    if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1
    if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

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
        <h1 className="text-2xl font-bold">Guest Management</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => router.push('/dashboard/guests/bulk-add/file-import')}
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            Import From File
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/guests/bulk-add')}
            variant="outline"
          >
            <Users className="h-4 w-4 mr-2" />
            Add to Multiple Events
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-base">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Guest List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search guests..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterEvent} onValueChange={setFilterEvent}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {sortBy === 'name' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      Email
                      {sortBy === 'email' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('event')}>
                    <div className="flex items-center">
                      Event
                      {sortBy === 'event' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                    <div className="flex items-center">
                      Date Added
                      {sortBy === 'date' && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No guests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map(guest => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell>{guest.email}</TableCell>
                      <TableCell>
                        <Link href={`/dashboard/events/${guest.event_id}`} className="text-blue-500 hover:underline">
                          {guest.eventTitle}
                        </Link>
                      </TableCell>
                      <TableCell>{getStatusBadge(guest.status)}</TableCell>
                      <TableCell>{format(new Date(guest.created_at), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/guests/${guest.event_id}?guest=${guest.id}`)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                            onClick={() => router.push(`/dashboard/communications/${guest.event_id}`)}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Message
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
    </div>
  )
} 