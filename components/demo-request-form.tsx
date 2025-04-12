"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

type FormData = {
  name: string
  email: string
  company: string
  eventType: string
  message: string
}

export function DemoRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    eventType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleEventTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      eventType: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const supabase = getSupabaseClient()
      
      // Check required fields
      if (!formData.name || !formData.email || !formData.eventType) {
        throw new Error('Please fill all required fields')
      }

      // Insert into demo_requests table
      const { error: insertError } = await supabase
        .from('demo_requests')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            event_type: formData.eventType,
            message: formData.message || null,
            status: 'new',
            created_at: new Date().toISOString()
          }
        ])

      if (insertError) {
        console.error('Error submitting demo request:', insertError)
        throw new Error('Failed to submit demo request. Please try again.')
      }

      // Success - show success message
      setIsSubmitted(true)
    } catch (err: any) {
      console.error('Demo request submission failed:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
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
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name" 
              placeholder="John Smith" 
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company/Organization</Label>
            <Input 
              id="company" 
              placeholder="Acme Inc." 
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType">Primary Event Type *</Label>
            <Select
              value={formData.eventType}
              onValueChange={handleEventTypeChange}
              required
            >
              <SelectTrigger id="eventType">
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
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Request Demo'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
