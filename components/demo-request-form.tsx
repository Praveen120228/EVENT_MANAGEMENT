"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

export function DemoRequestForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would handle the form submission here
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-100 p-3">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Request Received!</CardTitle>
          <CardDescription className="text-center">
            Thank you for your interest in Specyf. A member of our team will contact you shortly to schedule your
            personalized demo.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Request a Demo</CardTitle>
        <CardDescription>
          Fill out the form below and we'll contact you to schedule a personalized demo.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Smith" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company/Organization</Label>
            <Input id="company" placeholder="Acme Inc." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-type">Primary Event Type</Label>
            <Select>
              <SelectTrigger id="event-type">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="education">Educational Event</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Additional Information</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your event management needs..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Request Demo
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
