"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarRange, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
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
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-semibold">Specyf</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              Simplifying event management for organizers.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com/specyfplatform" target="_blank" className="text-muted-foreground hover:text-emerald-500">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com/specyfplatform" target="_blank" className="text-muted-foreground hover:text-emerald-500">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com/specyfplatform" target="_blank" className="text-muted-foreground hover:text-emerald-500">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/company/specyfplatform" target="_blank" className="text-muted-foreground hover:text-emerald-500">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={getNavLink("features")} className="text-muted-foreground hover:text-emerald-500">
                  Event Management
                </Link>
              </li>
              <li>
                <Link href={getNavLink("features")} className="text-muted-foreground hover:text-emerald-500">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href={getNavLink("features")} className="text-muted-foreground hover:text-emerald-500">
                  Customization
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-emerald-500">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-emerald-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-emerald-500">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-emerald-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-emerald-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-emerald-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Specyf. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
