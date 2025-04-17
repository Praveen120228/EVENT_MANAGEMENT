'use client'

import React from 'react'
import { useState, useEffect, cache } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EventSidebar from '@/components/guest/event-sidebar'
import MobileEventNav from '@/components/guest/mobile-event-nav'

// Use the cache function to create a memoized function
const getParams = cache((params: any) => params);

interface LayoutProps {
  children: React.ReactNode
  params: {
    eventId: string
  }
}

export default function EventLayout({ children, params }: LayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  
  // Extract eventId from pathname instead of using params directly
  const eventId = pathname.split('/')[3] // This will get the [eventId] from the URL
  const guestId = searchParams.get('guestId')
  
  const [announcementCount, setAnnouncementCount] = useState(0)
  const [pollCount, setPollCount] = useState(0)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true)
      
      try {
        // Fetch announcement count
        const { count: announcements, error: announcementError } = await supabase
          .from('event_announcements')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
          .eq('is_published', true)
        
        if (!announcementError) {
          setAnnouncementCount(announcements || 0)
        }
        
        // Fetch poll count
        const { count: polls, error: pollError } = await supabase
          .from('event_polls')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', eventId)
        
        if (!pollError) {
          setPollCount(polls || 0)
        }
      } catch (err) {
        console.error('Error fetching counts:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (eventId) {
      fetchCounts()
    }
  }, [eventId, supabase])
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile navigation - only visible on mobile */}
      <MobileEventNav 
        eventId={eventId} 
        guestId={guestId} 
        announcementCount={announcementCount}
        pollCount={pollCount}
      />
      
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden md:block w-64 bg-white border-r p-4">
          <EventSidebar 
            eventId={eventId} 
            guestId={guestId} 
            announcementCount={announcementCount}
            pollCount={pollCount}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
} 