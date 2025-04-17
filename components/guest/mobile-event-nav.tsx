'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { 
  Menu, 
  CalendarClock, 
  Bell, 
  Vote,
  ArrowLeft
} from 'lucide-react'

interface MobileEventNavProps {
  eventId: string
  guestId: string | null
  announcementCount?: number
  pollCount?: number
}

export default function MobileEventNav({ 
  eventId, 
  guestId, 
  announcementCount = 0, 
  pollCount = 0 
}: MobileEventNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  if (!guestId) {
    return null
  }
  
  // Determine which page is active
  const isDetailsPage = pathname === `/guest/events/${eventId}`
  const isAnnouncementsPage = pathname === `/guest/events/${eventId}/announcements`
  const isPollsPage = pathname === `/guest/events/${eventId}/polls`
  
  return (
    <div className="md:hidden border-b border-gray-200 bg-white">
      <div className="container py-2 flex justify-between items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <Menu className="h-5 w-5" />
              <span className="ml-2">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="max-w-[250px]">
            <div className="flex flex-col h-full">
              <div className="py-4">
                <Link href="/guest/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              
              <div className="py-4">
                <h3 className="px-1 text-sm font-semibold mb-3">Event Navigation</h3>
                <nav className="space-y-1">
                  <Link 
                    href={`/guest/events/${eventId}?guestId=${guestId}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center p-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <CalendarClock className="mr-2 h-4 w-4 text-emerald-500" />
                    <span className={isDetailsPage ? "text-emerald-600 font-bold" : ""}>
                      Event Details
                    </span>
                  </Link>
                  
                  <Link 
                    href={`/guest/events/${eventId}/announcements?guestId=${guestId}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center p-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Bell className="mr-2 h-4 w-4 text-emerald-500" />
                    <span className={isAnnouncementsPage ? "text-emerald-600 font-bold" : ""}>
                      Announcements
                    </span>
                    {announcementCount > 0 && (
                      <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs rounded-full px-2 py-0.5">
                        {announcementCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link 
                    href={`/guest/events/${eventId}/polls?guestId=${guestId}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center p-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Vote className="mr-2 h-4 w-4 text-emerald-500" />
                    <span className={isPollsPage ? "text-emerald-600 font-bold" : ""}>
                      Polls
                    </span>
                    {pollCount > 0 && (
                      <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs rounded-full px-2 py-0.5">
                        {pollCount}
                      </span>
                    )}
                  </Link>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex items-center gap-2">
          {isDetailsPage && <span className="font-medium">Details</span>}
          {isAnnouncementsPage && <span className="font-medium">Announcements</span>}
          {isPollsPage && <span className="font-medium">Polls</span>}
        </div>
      </div>
    </div>
  )
} 