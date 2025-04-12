import Image from "next/image"
import { CheckCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Testimonials } from "@/components/testimonials"
import { PricingCards } from "@/components/pricing-cards"
import { FeatureShowcase } from "@/components/feature-showcase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DemoRequestForm } from "@/components/demo-request-form"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="inline-flex" variant="outline">
                    Simplify Your Event Management
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Events Made <span className="text-emerald-500">Specyf</span>ically For You
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    From weddings to workshops, conferences to campus events — manage every detail with ease and
                    precision.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700" size="lg" asChild>
                    <Link href="/auth/signup">Start Planning Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Free 14-day trial</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl">
                  <Image
                    src="/placeholder.svg?height=720&width=1280"
                    width={1280}
                    height={720}
                    alt="Specyf platform dashboard showing event management interface"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Role-based Pathways */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Choose Your Path</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Whether you're organizing events or attending them, Specyf has the tools you need.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
              <Card className="relative overflow-hidden border-2 border-emerald-500">
                <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white text-xs font-medium px-2 rounded-bl">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Event Organizer</CardTitle>
                  <CardDescription>Create and manage events with powerful tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Create unlimited events with custom branding</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Manage RSVPs and track attendance in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Send automated emails and notifications</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Create polls and gather preferences</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild>
                    <Link href="/auth/signup">Get Started as Organizer</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Event Guest</CardTitle>
                  <CardDescription>Seamless experience for event attendees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Easily RSVP to events with one click</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Access event details and updates in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Participate in polls and provide preferences</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Connect with other attendees</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Everything You Need to Run Successful Events</h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto max-w-[700px]">
                Manage every aspect of your event lifecycle with our comprehensive features
              </p>
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* Pricing Section */}
        <PricingCards />

        {/* Testimonials */}
        <Testimonials />

        {/* Demo Request */}
        <section id="request-demo" className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 dark:bg-emerald-950/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to transform your events?
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Book a personalized demo with our team and see how Specyf can streamline your event management
                    process.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <a href="#request-demo">Book a Demo</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>30-minute personalized walkthrough</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Custom solution advice</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <DemoRequestForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
