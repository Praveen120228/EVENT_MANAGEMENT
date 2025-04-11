"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarRange, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold">Specyf</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Pricing
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Testimonials
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Log In</Link>
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" asChild>
            <Link href="/auth/signup">Sign Up Free</Link>
          </Button>
        </div>
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 pt-6">
              <Link
                href="#features"
                className="text-lg font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-lg font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#testimonials"
                className="text-lg font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#contact"
                className="text-lg font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                </Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>Sign Up Free</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
