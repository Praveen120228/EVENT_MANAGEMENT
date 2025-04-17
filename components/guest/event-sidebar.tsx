'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  CalendarClock, 
  Bell, 
  Vote,
  MessageCircle,
  Home,
  ArrowLeft
} from 'lucide-react'

interface EventSidebarProps {
  eventId: string
  guestId: string | null
  announcementCount?: number
  pollCount?: number
}

export default function EventSidebar({ 
  eventId, 
  guestId, 
  announcementCount = 0, 
  pollCount = 0 
}: EventSidebarProps) {
  const pathname = usePathname()
  
  // Determine which page is active
  const isDetailsPage = pathname === `/guest/events/${eventId}`
  const isAnnouncementsPage = pathname === `/guest/events/${eventId}/announcements`
  const isPollsPage = pathname === `/guest/events/${eventId}/polls`
  
  if (!guestId) {
    return null
  }
  
  return (
    <div className="space-y-2">
      <div className="mb-4">
        <Link href="/guest/dashboard">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
      
      <Separator />
      
      <div className="py-2">
        <h3 className="mb-2 px-4 text-sm font-semibold">Event Navigation</h3>
        <div className="space-y-1">
          <Link href={`/guest/events/${eventId}?guestId=${guestId}`} className="block">
            <Button 
              variant={isDetailsPage ? "default" : "ghost"} 
              size="sm" 
              className={`w-full justify-start ${isDetailsPage ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}`}
            >
              <CalendarClock className="mr-2 h-4 w-4" />
              Event Details
            </Button>
          </Link>
          
          <Link href={`/guest/events/${eventId}/announcements?guestId=${guestId}`} className="block">
            <Button 
              variant={isAnnouncementsPage ? "default" : "ghost"} 
              size="sm" 
              className={`w-full justify-start ${isAnnouncementsPage ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}`}
            >
              <Bell className="mr-2 h-4 w-4" />
              Announcements
              {announcementCount > 0 && (
                <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs rounded-full px-2 py-0.5">
                  {announcementCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Link href={`/guest/events/${eventId}/polls?guestId=${guestId}`} className="block">
            <Button 
              variant={isPollsPage ? "default" : "ghost"} 
              size="sm" 
              className={`w-full justify-start ${isPollsPage ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}`}
            >
              <Vote className="mr-2 h-4 w-4" />
              Polls
              {pollCount > 0 && (
                <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs rounded-full px-2 py-0.5">
                  {pollCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 