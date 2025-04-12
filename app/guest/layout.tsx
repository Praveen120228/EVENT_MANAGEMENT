import React from 'react'
import Link from 'next/link'
import { CalendarRange } from 'lucide-react'

export const metadata = {
  title: 'Specyf | Guest Portal',
  description: 'View and respond to your event invitations',
}

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">Specyf</span>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Specyf. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/terms" className="hover:text-emerald-600 hover:underline">Terms</Link>
            <Link href="/privacy" className="hover:text-emerald-600 hover:underline">Privacy</Link>
            <Link href="/contact" className="hover:text-emerald-600 hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 