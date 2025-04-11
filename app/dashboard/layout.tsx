'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarRange, Plus, Users, MessageSquare, BarChart2, Settings, Loader2, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSupabase } from '@/hooks/useSupabase'
import { useEffect, useState } from 'react'
import { ResponsiveHelper } from '@/app/utils/responsive-helper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface DashboardLayoutProps {
  children: React.ReactNode
}

// Mobile and desktop-friendly header
function Header() {
  const { user } = useSupabase()
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#0A0D14] p-0">
          <MobileSidebar />
        </SheetContent>
      </Sheet>
      
      <div className="md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-emerald-500" />
          <span className="text-lg font-bold">Specyf</span>
        </Link>
      </div>
    </header>
  )
}

// Sidebar for mobile devices - slide out
function MobileSidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: CalendarRange },
    { title: 'Create Event', href: '/dashboard/create', icon: Plus },
    { title: 'Events', href: '/dashboard/events', icon: CalendarRange },
    { title: 'Guests', href: '/dashboard/guests', icon: Users },
    { title: 'Communications', href: '/dashboard/communications', icon: MessageSquare },
    { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { title: 'Settings', href: '/dashboard/settings', icon: Settings },
    { title: 'Database Fixes', href: '/admin/database-fixes', icon: Settings },
  ]
  
  return (
    <div className="flex h-full flex-col bg-[#0A0D14] text-white">
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold">Specyf</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 p-0 text-white" size="icon">
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </SheetTrigger>
        </Sheet>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-500'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

// Desktop sidebar - always visible on md+ screens
function Sidebar() {
  const pathname = usePathname()
  
  const navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: CalendarRange },
    { title: 'Create Event', href: '/dashboard/create', icon: Plus },
    { title: 'Events', href: '/dashboard/events', icon: CalendarRange },
    { title: 'Guests', href: '/dashboard/guests', icon: Users },
    { title: 'Communications', href: '/dashboard/communications', icon: MessageSquare },
    { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
    { title: 'Settings', href: '/dashboard/settings', icon: Settings },
    { title: 'Database Fixes', href: '/admin/database-fixes', icon: Settings },
  ]
  
  return (
    <div className="hidden w-64 border-r bg-[#0A0D14] md:block">
      <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold text-white">Specyf</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-500'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { user, loading, error } = useSupabase()
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setLoadingTimeout(true)
    }, 5000) // 5 seconds timeout

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Only redirect if we're sure about the auth state
    if (!loading && !user) {
      console.log('No authenticated user found, redirecting to login')
      router.replace('/auth/login')
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading && !loadingTimeout) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
          <p className="mt-2 text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show timeout message if loading takes too long
  if (loadingTimeout && loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-gray-600">Taking longer than expected...</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  // Show error state if there's an authentication error
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 pb-12">
            <div className="md:hidden p-4 border-b">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#0A0D14] p-0">
                  <MobileSidebar />
                </SheetContent>
              </Sheet>
            </div>
            {children}
          </main>
        </div>
      </div>
      
      {/* Responsive helper - Only shown in development */}
      {process.env.NODE_ENV === 'development' && (
        <ResponsiveHelper enabled={true} />
      )}
    </>
  )
} 