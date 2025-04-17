'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  CalendarRange,
  Clock,
  MapPin,
  LogOut,
  CheckCircle,
  XCircle,
  HelpCircle,
  User,
  BarChart
} from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string | null
  location: string | null
  organizer_id: string
  organizer_name: string | null
}

interface EventPoll {
  id: string
  event_id: string
  question: string
  options: string[]
  created_at: string
}

interface GuestInvitation {
  id: string
  event_id: string
  name: string
  email: string
  status: 'pending' | 'confirmed' | 'declined'
  response_date: string | null
  message: string | null
  created_at: string
  updated_at: string
  event: Event
}

export default function GuestDashboardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<Error | null>(null)
  const [user, setUser] = useState<any>(null)
  const [invitations, setInvitations] = useState<GuestInvitation[]>([])
  const [eventPolls, setEventPolls] = useState<{[key: string]: EventPoll[]}>({})
  const [announcements, setAnnouncements] = useState<{[key: string]: any[]}>({})
  const [hasFullAccess, setHasFullAccess] = useState(false)

  // Define a whitelist of tables we know exist in the database
  const KNOWN_TABLES = {
    guests: true,    // This table definitely exists
    events: true,    // This table definitely exists
    event_polls: true,  // Enable polling of event_polls
    event_announcements: true  // Enable polling of event_announcements
  };

  // Check basic database access permissions
  const checkDatabaseAccess = async () => {
    try {
      console.log('Checking database access permissions...');
      // Try a simple query that should always work if permissions are correct
      const { data, error } = await supabase
        .from('guests')
        .select('count', { count: 'exact', head: true })
        .limit(1);
      
      if (!error) {
        console.log('Full database access confirmed');
        setHasFullAccess(true);
        
        // Check additional tables existence
        await checkTableExists('event_polls');
        await checkTableExists('event_announcements');
        
        return true;
      } else {
        console.error('Database access error:', error);
        setHasFullAccess(false);
        return false;
      }
    } catch (err) {
      console.error('Unexpected error checking database access:', err);
      setHasFullAccess(false);
      return false;
    }
  };
  
  // Helper to check if a table exists and is accessible
  const checkTableExists = async (tableName: string) => {
    try {
      console.log(`Checking if table ${tableName} exists...`);
      const { error } = await supabase
        .from(tableName)
        .select('count', { count: 'exact', head: true })
        .limit(1);
        
      // Update the whitelist based on result
      if (error) {
        console.log(`Table ${tableName} is not accessible:`, error.message);
        KNOWN_TABLES[tableName as keyof typeof KNOWN_TABLES] = false;
      } else {
        console.log(`Table ${tableName} exists and is accessible`);
        KNOWN_TABLES[tableName as keyof typeof KNOWN_TABLES] = true;
      }
    } catch (err) {
      console.error(`Error checking ${tableName} table:`, err);
      KNOWN_TABLES[tableName as keyof typeof KNOWN_TABLES] = false;
    }
  };

  useEffect(() => {
    // Check authentication and fetch invitations
    const checkAuth = async () => {
      try {
        setLoading(true)
        setLoadError(null)
        
        // Get the current user
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          throw authError
        }
        
        if (!session) {
          // Not logged in, redirect to login
          router.replace('/auth/guest-login')
          return
        }
        
        setUser(session.user)
        
        // Check database access
        await checkDatabaseAccess();
        
        // Fetch invitations for this guest
        try {
          if (session.user.email) {
            await fetchInvitations(session.user.email)
          }
        } catch (invitationError) {
          console.error('Failed to fetch invitations:', invitationError)
          setError('Error loading your invitations. Please refresh the page to try again.')
        }
        
      } catch (err) {
        console.error('Auth error:', err)
        setError('Authentication failed. Please try logging in again.')
        setLoadError(err instanceof Error ? err : new Error('Unknown authentication error'))
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router, supabase])

  const fetchInvitations = async (email: string) => {
    try {
      console.log('Fetching invitations for email:', email.toLowerCase());
      
      // If we don't have full database access, use a simplified approach
      if (!hasFullAccess) {
        console.log('Limited database access detected, using simplified query');
        // Just query the guests table without joins
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('*')
          .eq('email', email.toLowerCase());
        
        if (guestError) {
          console.error('Error fetching guest data:', guestError);
          setError('Failed to load your invitations');
          return;
        }
        
        if (!guestData || guestData.length === 0) {
          console.log('No invitations found for email:', email);
          setInvitations([]);
          return;
        }
        
        // Get event ids for additional queries
        const eventIds = guestData.map(guest => guest.event_id).filter(Boolean);
        
        if (eventIds.length > 0) {
          // Try to fetch basic event info
          try {
            const { data: eventData, error: eventError } = await supabase
              .from('events')
              .select('*')
              .in('id', eventIds);
              
            if (!eventError && eventData) {
              // Create a map of events by ID for easy lookup
              const eventMap = eventData.reduce((acc, event) => {
                acc[event.id] = event;
                return acc;
              }, {} as Record<string, any>);
              
              // Create invitation objects with event data where available
              const enhancedInvitations = guestData.map(guest => {
                const eventInfo = eventMap[guest.event_id] || {
                  id: guest.event_id,
                  title: 'Event Information',
                  description: 'Event details will be loaded when available',
                  date: guest.created_at,
                  organizer_name: 'Event Organizer'
                };
                
                return {
                  ...guest,
                  event: eventInfo
                };
              });
              
              setInvitations(enhancedInvitations as GuestInvitation[]);
              return;
            }
          } catch (eventError) {
            console.error('Error fetching event data:', eventError);
            // Fall back to simple invitations below
          }
        }
        
        // If we couldn't get event data, use simplified objects
        const simpleInvitations = guestData.map(guest => {
          return {
            ...guest,
            event: {
              id: guest.event_id,
              title: 'Event Information',
              description: 'Event details will be loaded when available',
              date: guest.created_at, // Use invitation date as fallback
              organizer_name: 'Event Organizer'
            }
          };
        });
        
        setInvitations(simpleInvitations as GuestInvitation[]);
        setEventPolls({});
        setAnnouncements({});
        return;
      }
      
      // If we have full access, use the complex query with relations
      console.log('Using full access query with relations');
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select(`
          *,
          event:events(*)
        `)
        .eq('email', email.toLowerCase());
      
      if (guestError) {
        console.error('Error fetching guest data:', guestError);
        setError('Failed to load your invitations');
        return;
      }
      
      if (!guestData || guestData.length === 0) {
        console.log('No invitations found for email:', email);
        setInvitations([]);
        return;
      }
      
      console.log('Found total invitations:', guestData.length);
      console.log('Sample invitation data:', guestData[0]);
      
      // Safely filter out invitations with null events
      const validInvitations = guestData.filter(invitation => 
        invitation && invitation.event && typeof invitation.event === 'object'
      );
      
      console.log(`Found ${validInvitations.length} valid invitations out of ${guestData.length} total`);
      
      // If we have invitations but none with valid event data, try a fallback approach
      if (validInvitations.length === 0 && guestData.length > 0) {
        console.log('No valid invitations with event data, trying fallback approach');
        
        // Get event ids to query separately
        const eventIds = guestData
          .map(invitation => invitation.event_id)
          .filter(id => typeof id === 'string' && id.trim() !== '');
          
        if (eventIds.length > 0) {
          // Try to fetch event data separately
          try {
            const { data: eventData, error: eventError } = await supabase
              .from('events')
              .select('*')
              .in('id', eventIds);
              
            if (!eventError && eventData && eventData.length > 0) {
              console.log('Retrieved event data separately:', eventData.length);
              
              // Create a map of events by ID
              const eventMap = eventData.reduce((acc, event) => {
                acc[event.id] = event;
                return acc;
              }, {} as Record<string, any>);
              
              // Combine guest data with event data
              const combinedInvitations = guestData.map(guest => {
                const eventInfo = eventMap[guest.event_id] || {
                  id: guest.event_id,
                  title: 'Event Information',
                  description: 'Event details unavailable',
                  date: guest.created_at,
                  organizer_name: 'Event Organizer'
                };
                
                return {
                  ...guest,
                  event: eventInfo
                };
              });
              
              console.log('Created combined invitations with separate event data');
              setInvitations(combinedInvitations as GuestInvitation[]);
              
              // Continue with fetching polls and announcements
              if (eventIds.length > 0) {
                if (KNOWN_TABLES.event_polls) {
                  try {
                    await fetchEventPolls(eventIds);
                  } catch (pollError) {
                    console.log('Error fetching polls:', pollError);
                    setEventPolls({});
                  }
                }
                
                if (KNOWN_TABLES.event_announcements) {
                  try {
                    await fetchEventAnnouncements(eventIds);
                  } catch (announcementError) {
                    console.log('Error fetching announcements:', announcementError);
                    setAnnouncements({});
                  }
                }
              }
              
              return;
            }
          } catch (err) {
            console.error('Error in fallback event data fetch:', err);
          }
        }
      }
      
      // If we have valid invitations with event data, use them
      if (validInvitations.length > 0) {
        console.log('Using valid invitations with event data');
        setInvitations(validInvitations as GuestInvitation[]);
        
        // Get all event IDs for fetching additional data
        const eventIds = validInvitations
          .map(invitation => invitation.event_id)
          .filter(id => typeof id === 'string' && id.trim() !== '');
          
        if (eventIds.length > 0) {
          // Fetch polls if available
          if (KNOWN_TABLES.event_polls) {
            try {
              await fetchEventPolls(eventIds);
            } catch (pollError) {
              console.log('Error fetching polls:', pollError);
              setEventPolls({});
            }
          } else {
            console.log('Skipping poll fetch - table not in whitelist');
            setEventPolls({});
          }
          
          // Fetch announcements if available
          if (KNOWN_TABLES.event_announcements) {
            try {
              await fetchEventAnnouncements(eventIds);
            } catch (announcementError) {
              console.log('Error fetching announcements:', announcementError);
              setAnnouncements({});
            }
          } else {
            console.log('Skipping announcements fetch - table not in whitelist');
            setAnnouncements({});
          }
        }
        return;
      }
      
      // If we got here, we have no valid invitations
      console.log('No valid invitations with event data found');
      setInvitations([]);
      setEventPolls({});
      setAnnouncements({});
      
    } catch (err) {
      console.error('Error fetching invitations:', err)
      setError('Failed to load your invitations. Please try again later.')
      // Ensure we have safe defaults
      setInvitations([]);
      setEventPolls({});
      setAnnouncements({});
    }
  }

  const fetchEventPolls = async (eventIds: string[]) => {
    try {
      if (!Array.isArray(eventIds)) {
        console.error('Invalid eventIds format:', eventIds);
        return;
      }

      // Ensure all eventIds are strings
      const validEventIds = eventIds.filter(id => typeof id === 'string' && id.trim() !== '');
      
      if (validEventIds.length === 0) {
        console.log('No valid event IDs to fetch polls for');
        setEventPolls({});
        return;
      }
      
      // First check if the event_polls table exists/is accessible
      const { error: tableCheckError } = await supabase
        .from('event_polls')
        .select('count', { count: 'exact', head: true });
        
      if (tableCheckError) {
        console.error('Error accessing event_polls table:', tableCheckError);
        setEventPolls({});
        return;
      }

      console.log(`Fetching polls for ${validEventIds.length} events`);
      
      const { data: pollsData, error: pollsError } = await supabase
        .from('event_polls')
        .select('*')
        .in('event_id', validEventIds);

      if (pollsError) {
        console.error('Poll fetch error:', pollsError);
        setEventPolls({});
        return;
      }

      if (!pollsData || pollsData.length === 0) {
        console.log('No polls found for the provided events');
        setEventPolls({});
        return;
      }

      console.log(`Found ${pollsData.length} polls for events`);

      // Group polls by event_id
      const pollsByEvent = pollsData.reduce((acc, poll) => {
        // Skip invalid polls
        if (!poll || !poll.event_id) {
          return acc;
        }
        
        // Parse options safely
        let parsedOptions = [];
        try {
          if (poll.options && typeof poll.options === 'string') {
            parsedOptions = JSON.parse(poll.options);
          } else if (Array.isArray(poll.options)) {
            parsedOptions = poll.options;
          }
        } catch (err) {
          console.warn(`Error parsing options for poll ${poll.id}:`, err);
          parsedOptions = [];
        }
        
        // Only add polls with valid options
        if (parsedOptions.length > 0) {
          if (!acc[poll.event_id]) {
            acc[poll.event_id] = [];
          }
          acc[poll.event_id].push({
            ...poll,
            options: parsedOptions
          });
        }
        
        return acc;
      }, {} as Record<string, any[]>);

      setEventPolls(pollsByEvent);
    } catch (err) {
      console.error('Unexpected error in fetchEventPolls:', err);
      // Don't let poll errors break the dashboard
      setEventPolls({});
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.replace('/auth/guest-login')
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const updateResponseStatus = async (invitationId: string, status: 'confirmed' | 'declined') => {
    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('guests')
        .update({
          status,
          response_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId)
      
      if (error) throw error
      
      // Refresh invitations
      if (user?.email) {
        await fetchInvitations(user.email)
      }
      
    } catch (err) {
      console.error('Error updating status:', err)
      setError('Failed to update your response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-emerald-100 text-emerald-800">Confirmed</Badge>
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  // Add a safe date formatter function to prevent errors
  const formatDateSafely = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'Date not specified';
    
    try {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'EEEE, MMMM d, yyyy');
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Date format error';
    }
  };
  
  // Add safe response date formatter
  const formatResponseDateSafely = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      return ` on ${format(date, 'MMM d, yyyy')}`;
    } catch (err) {
      console.error('Error formatting response date:', err);
      return '';
    }
  };

  // Add fetchEventAnnouncements function with robust error handling
  const fetchEventAnnouncements = async (eventIds: string[]) => {
    try {
      if (!Array.isArray(eventIds) || eventIds.length === 0) {
        console.log('No event IDs provided for announcements');
        setAnnouncements({});
        return;
      }

      console.log(`Fetching announcements for ${eventIds.length} events`);
      
      // We know the table exists now (it's in our whitelist)
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('event_announcements')
        .select('*')
        .in('event_id', eventIds);

      if (announcementsError) {
        throw announcementsError; // Let our try/catch handle this
      }

      if (!announcementsData || announcementsData.length === 0) {
        console.log('No announcements found for the provided events');
        setAnnouncements({});
        return;
      }

      console.log(`Found ${announcementsData.length} announcements for events`);

      // Group announcements by event_id
      const announcementsByEvent = announcementsData.reduce((acc, announcement) => {
        if (!announcement || !announcement.event_id) return acc;
        
        if (!acc[announcement.event_id]) {
          acc[announcement.event_id] = [];
        }
        
        acc[announcement.event_id].push(announcement);
        return acc;
      }, {} as Record<string, any[]>);

      setAnnouncements(announcementsByEvent);
      
    } catch (err) {
      console.error('Error fetching announcements:', err);
      // Don't let announcement errors break the dashboard
      setAnnouncements({});
    }
  }

  // Error fallback UI
  if (loadError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-red-700">Error Loading Dashboard</h2>
          <p className="mt-2 text-sm text-red-600">
            Something went wrong while loading your dashboard.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Ensure our data is safe to render before trying to access event properties
  const safeInvitations = (invitations || []).filter(
    invitation => invitation && 
    invitation.event && 
    typeof invitation.event === 'object' && 
    invitation.event.id && 
    invitation.event.title && 
    invitation.event.title !== 'Event Information' && // Filter out fallback events
    invitation.event.date // Ensure there's a date
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CalendarRange className="h-6 w-6 text-emerald-500 mr-2" />
            <h1 className="text-xl font-bold">Specyf Guest Portal</h1>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-sm">
              <span className="text-gray-500">Signed in as:</span>{' '}
              <span className="font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Event Invitations</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!hasFullAccess && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              Limited access mode: Some features may be unavailable due to database permission restrictions.
            </AlertDescription>
          </Alert>
        )}
        
        {safeInvitations.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No Event Invitations Found</h3>
                <p className="text-gray-500 mt-2">
                  You don't have any active event invitations at this time.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  When you're invited to events, they will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeInvitations.map((invitation) => {
              // Wrap each card in a try-catch to prevent one bad card from breaking everything
              try {
                return (
                  <Card key={invitation.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="flex justify-between items-start">
                        <div className="text-lg">{invitation.event?.title || 'Untitled Event'}</div>
                        {getStatusBadge(invitation.status)}
                      </CardTitle>
                      <CardDescription>
                        {invitation.event?.description?.substring(0, 100) || 'No description available'}
                        {invitation.event?.description?.length > 100 ? '...' : ''}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <CalendarRange className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                          <div>
                            <div className="font-medium">Date</div>
                            <div className="text-sm text-gray-500">
                              {formatDateSafely(invitation.event?.date)}
                            </div>
                          </div>
                        </div>
                        
                        {invitation.event?.time && (
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <div className="font-medium">Time</div>
                              <div className="text-sm text-gray-500">{invitation.event.time}</div>
                            </div>
                          </div>
                        )}
                        
                        {invitation.event?.location && (
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <div className="font-medium">Location</div>
                              <div className="text-sm text-gray-500">{invitation.event.location}</div>
                            </div>
                          </div>
                        )}
                        
                        {eventPolls && invitation.event_id && eventPolls[invitation.event_id] && eventPolls[invitation.event_id].length > 0 && (
                          <div className="flex items-start">
                            <BarChart className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                            <div>
                              <div className="font-medium">Polls</div>
                              <div className="text-sm text-gray-500">
                                {eventPolls[invitation.event_id].length} poll{eventPolls[invitation.event_id].length !== 1 ? 's' : ''} available
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Show announcements count if available */}
                        {announcements && 
                         typeof announcements === 'object' && 
                         invitation.event_id && 
                         announcements[invitation.event_id] && 
                         Array.isArray(announcements[invitation.event_id]) &&
                         announcements[invitation.event_id].length > 0 && (
                          <div className="flex items-start">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5 text-gray-500 mt-0.5 mr-3"
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                              <line x1="12" y1="9" x2="12" y2="13"></line>
                              <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <div>
                              <div className="font-medium">Announcements</div>
                              <div className="text-sm text-gray-500">
                                {announcements[invitation.event_id].length} announcement{announcements[invitation.event_id].length !== 1 ? 's' : ''} available
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {invitation.status !== 'pending' && (
                          <div className="flex items-start">
                            <div className="h-5 w-5 flex justify-center mt-0.5 mr-3">
                              {invitation.status === 'confirmed' ? (
                                <CheckCircle className="text-emerald-500" />
                              ) : (
                                <XCircle className="text-red-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">Your Response</div>
                              <div className="text-sm text-gray-500">
                                {invitation.status === 'confirmed' ? 'You are attending' : 'You declined'}
                                {formatResponseDateSafely(invitation.response_date)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col space-y-3 pt-0">
                      <Separator className="mb-2" />
                      
                      {invitation.status === 'pending' ? (
                        <>
                          <div className="text-sm font-medium text-center mb-2">Will you attend this event?</div>
                          <div className="flex justify-center space-x-3">
                            <Button 
                              variant="outline" 
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => updateResponseStatus(invitation.id, 'declined')}
                              disabled={loading}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                            <Button 
                              className="bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => updateResponseStatus(invitation.id, 'confirmed')}
                              disabled={loading}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Link 
                          href={`/guest/events/${invitation.event_id}?guestId=${invitation.id}`}
                          className="w-full"
                        >
                          <Button 
                            variant="outline" 
                            className="w-full"
                          >
                            View Event Details
                            {eventPolls && 
                             typeof eventPolls === 'object' && 
                             invitation.event_id && 
                             eventPolls[invitation.event_id] && 
                             Array.isArray(eventPolls[invitation.event_id]) && 
                             eventPolls[invitation.event_id].length > 0 && 
                              " & Respond to Polls"}
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                );
              } catch (renderError) {
                console.error('Error rendering invitation card:', renderError, invitation);
                // Return a fallback card for this invitation
                return (
                  <Card key={invitation.id || 'error-card'} className="overflow-hidden bg-gray-50">
                    <CardHeader>
                      <CardTitle>Error Displaying Invitation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        There was a problem displaying this invitation.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.reload()}
                      >
                        Refresh Page
                      </Button>
                    </CardFooter>
                  </Card>
                );
              }
            })}
          </div>
        )}
      </main>
    </div>
  )
} 