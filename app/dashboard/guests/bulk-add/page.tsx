'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, Users, ArrowLeft, Calendar, Plus, Upload, FileText } from 'lucide-react'
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
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

interface Event {
  id: string
  title: string
  date: string
  organizer_id: string
}

interface GuestInput {
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
}

interface BulkAddResult {
  eventId: string
  eventTitle: string
  added: number
  skipped: number
  errors: string[]
}

export default function BulkAddToEventsPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [bulkInput, setBulkInput] = useState('')
  const [results, setResults] = useState<BulkAddResult[]>([])
  const [progressValue, setProgressValue] = useState(0)
  const [progressTotal, setProgressTotal] = useState(0)

  useEffect(() => {
    if (!authLoading && user && supabase) {
      fetchEvents()
      
      // Check for imported data from CSV
      const importedData = localStorage.getItem('bulkAddInput')
      if (importedData) {
        setBulkInput(importedData)
        localStorage.removeItem('bulkAddInput') // Clear after use
      }
    } else if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, supabase, router])

  const fetchEvents = async () => {
    if (!supabase || !user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('id, title, date, organizer_id')
        .eq('organizer_id', user.id)
        .order('date', { ascending: false })

      if (fetchError) throw fetchError

      setEvents(data || [])
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError(err instanceof Error ? err.message : 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const selectAllEvents = () => {
    if (selectedEvents.length === events.length) {
      setSelectedEvents([])
    } else {
      setSelectedEvents(events.map(event => event.id))
    }
  }

  const parseGuestInput = (): GuestInput[] => {
    if (!bulkInput.trim()) return []
    
    const rows = bulkInput.trim().split('\n')
    return rows.map(row => {
      const [name, email, status = 'pending'] = row.split(',').map(item => item.trim())
      const validStatus = ['pending', 'confirmed', 'declined'].includes(status) 
        ? status as 'pending' | 'confirmed' | 'declined'
        : 'pending'
        
      return {
        name,
        email: email?.toLowerCase(),
        status: validStatus
      }
    }).filter(guest => guest.name && guest.email)
  }

  const processEventBatch = async (
    eventIds: string[], 
    guests: GuestInput[]
  ): Promise<BulkAddResult[]> => {
    if (!supabase || !eventIds.length || !guests.length) return []
    
    const results: BulkAddResult[] = []

    setProgressTotal(eventIds.length)
    setProgressValue(0)
    
    for (let i = 0; i < eventIds.length; i++) {
      const eventId = eventIds[i]
      const event = events.find(e => e.id === eventId)
      
      if (!event) continue
      
      const result: BulkAddResult = {
        eventId: event.id,
        eventTitle: event.title,
        added: 0,
        skipped: 0,
        errors: []
      }
      
      try {
        // Get existing guests for this event to avoid duplicates
        const { data: existingGuests, error: checkError } = await supabase
          .from('guests')
          .select('email')
          .eq('event_id', eventId)
          
        if (checkError) throw checkError
        
        const existingEmails = new Set((existingGuests || []).map(g => g.email.toLowerCase()))
        
        // Filter out duplicates
        const uniqueGuests = guests.filter(g => !existingEmails.has(g.email.toLowerCase()))
        result.skipped = guests.length - uniqueGuests.length
        
        if (uniqueGuests.length > 0) {
          // Format guests for insertion
          const guestsToInsert = uniqueGuests.map(guest => ({
            event_id: eventId,
            name: guest.name,
            email: guest.email,
            status: guest.status
          }))
          
          // Insert guests
          const { error: insertError } = await supabase
            .from('guests')
            .insert(guestsToInsert)
            
          if (insertError) throw insertError
          
          result.added = uniqueGuests.length
        }
      } catch (err) {
        console.error(`Error adding guests to event ${event.title}:`, err)
        result.errors.push(err instanceof Error ? err.message : 'Unknown error')
      }
      
      results.push(result)
      setProgressValue(i + 1)
    }
    
    return results
  }

  const handleBulkAdd = async () => {
    if (!supabase || selectedEvents.length === 0) {
      setError('Please select at least one event')
      return
    }
    
    const guests = parseGuestInput()
    if (guests.length === 0) {
      setError('No valid guest data found. Format should be: Name, Email, Status(optional)')
      return
    }
    
    setProcessing(true)
    setError(null)
    setSuccess(null)
    setResults([])
    
    try {
      const results = await processEventBatch(selectedEvents, guests)
      setResults(results)
      
      const totalAdded = results.reduce((sum, r) => sum + r.added, 0)
      const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0)
      const totalErrors = results.filter(r => r.errors.length > 0).length
      
      if (totalAdded > 0) {
        setSuccess(`Added ${totalAdded} guests to ${results.length} events`)
      } else if (totalSkipped > 0 && totalAdded === 0) {
        setError('All guests already exist in the selected events')
      } else if (totalErrors > 0) {
        setError('Some errors occurred during the process')
      }
    } catch (err) {
      console.error('Failed to process bulk add:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setProcessing(false)
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
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard/guests')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Add Guests to Multiple Events</h1>
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
        <Card>
          <CardHeader>
            <CardTitle>1. Select Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="selectAll" 
                checked={selectedEvents.length === events.length && events.length > 0} 
                onCheckedChange={selectAllEvents} 
              />
              <label htmlFor="selectAll" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select All Events
              </label>
            </div>

            <Separator className="my-4" />

            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                No events found
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {events.map(event => (
                  <div key={event.id} className="flex items-center space-x-3 py-2">
                    <Checkbox 
                      id={`event-${event.id}`}
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => toggleEventSelection(event.id)}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`event-${event.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {event.title}
                      </label>
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              {selectedEvents.length} of {events.length} events selected
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Add Guest Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label className="mb-2 block">Enter one guest per line:</Label>
              <div className="text-xs text-gray-500 mb-2">
                Format: Name, Email, Status(optional)<br />
                Status can be "pending", "confirmed", or "declined". If omitted, "pending" is used.
              </div>
              <Textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="John Doe, john@example.com, confirmed
Jane Smith, jane@example.com"
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleBulkAdd} 
                disabled={processing || selectedEvents.length === 0 || !bulkInput.trim()}
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Add to Selected Events
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/guests/bulk-add/file-import')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Import From File
              </Button>
            </div>

            {processing && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Processing events...</span>
                  <span>{progressValue} of {progressTotal}</span>
                </div>
                <Progress value={(progressValue / progressTotal) * 100} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Skipped</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.eventId}>
                    <TableCell className="font-medium">{result.eventTitle}</TableCell>
                    <TableCell>{result.added}</TableCell>
                    <TableCell>{result.skipped}</TableCell>
                    <TableCell>
                      {result.errors.length > 0 ? (
                        <Badge variant="destructive">Error</Badge>
                      ) : result.added > 0 ? (
                        <Badge className="bg-emerald-100 text-emerald-800">Success</Badge>
                      ) : (
                        <Badge variant="outline">No changes</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <Link href={`/dashboard/guests/${result.eventId}`}>
                          View Guests
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 