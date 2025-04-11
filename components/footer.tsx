import Link from "next/link"
import { CalendarRange, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Specyf</h3>
            <p className="text-sm text-muted-foreground">
              Simplifying event management for organizers.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>Event Management</li>
              <li>Analytics</li>
              <li>Customization</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Contact</li>
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
