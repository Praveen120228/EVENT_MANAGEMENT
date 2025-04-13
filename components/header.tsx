"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarRange, Menu, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  // Helper function to create proper links
  const getNavLink = (sectionId: string) => {
    // If we're on the home page, use hash links
    if (isHomePage) {
      return `#${sectionId}`
    }
    
    // If we're on a different page, use absolute path to the home page section
    return `/#${sectionId}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-emerald-500" />
          <span className="text-xl font-bold">Specyf</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href={getNavLink("features")} className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-emerald-500 transition-colors">
            Pricing
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:text-emerald-500 transition-colors flex items-center gap-1">
              Company
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/about">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/blog">Blog</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/careers">Careers</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">Contact</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm font-medium hover:text-emerald-500 transition-colors flex items-center gap-1">
              Resources
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/docs">Documentation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={getNavLink("testimonials")}>Testimonials</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/terms">Terms of Service</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/privacy">Privacy Policy</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                href={getNavLink("features")}
                className="text-lg font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-lg font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              
              <div>
                <h3 className="font-medium text-sm uppercase text-gray-500 mb-3">Company</h3>
                <div className="flex flex-col gap-4 pl-2">
                  <Link
                    href="/about"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/blog"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/careers"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Careers
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm uppercase text-gray-500 mb-3">Resources</h3>
                <div className="flex flex-col gap-4 pl-2">
                  <Link
                    href="/docs"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                  <Link
                    href={getNavLink("testimonials")}
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                  <Link
                    href="/terms"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-lg font-medium hover:text-emerald-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
              
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
