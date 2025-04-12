import Image from "next/image"
import { CheckCircle, ChevronRight, ArrowRight } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-5">
                <Badge className="w-fit bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-1 text-sm font-medium">
                  Simplify Your Event Management
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
                  Events Made <span className="text-emerald-600">Specyf</span>ically For You
                </h1>
                <p className="max-w-[600px] text-gray-600 text-lg md:text-xl">
                  From weddings to workshops, conferences to campus events — manage every detail with ease and
                  precision.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button className="bg-emerald-600 hover:bg-emerald-700" size="lg" asChild>
                    <Link href="/auth/signup">
                      <span>Start Planning Now</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm pt-2">
                  <div className="flex items-center space-x-1 bg-white py-1 px-3 rounded-full shadow-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white py-1 px-3 rounded-full shadow-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium">Free 14-day trial</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl border border-gray-200">
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

        {/* Section Divider */}
        <div className="container px-4 md:px-6 py-6">
          <Separator className="bg-gray-200" />
        </div>

        {/* Role-based Pathways */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1">For Everyone</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Choose Your Path</h2>
              <p className="max-w-[700px] text-gray-600 text-lg md:text-xl">
                Whether you're organizing events or attending them, Specyf has the tools you need.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-6 lg:grid-cols-2">
              <Card className="relative overflow-hidden border-2 border-emerald-500 shadow-lg transition-all hover:shadow-xl">
                <div className="absolute top-0 right-0 p-1 bg-emerald-500 text-white text-xs font-medium px-3 py-1 rounded-bl">
                  Most Popular
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold">Event Organizer</CardTitle>
                  <CardDescription className="text-base">Create and manage events with powerful tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Create unlimited events with custom branding</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Manage RSVPs and track attendance in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Send automated emails and notifications</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Create polls and gather preferences</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4" size="lg" asChild>
                    <Link href="/auth/signup">Get Started as Organizer</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg transition-all hover:shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-bold">Event Guest</CardTitle>
                  <CardDescription className="text-base">Seamless experience for event attendees</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Easily RSVP to events with one click</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Access event details and updates in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Participate in polls and provide preferences</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0" />
                      <span className="text-gray-700">Connect with other attendees</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 mt-4" size="lg" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="bg-gray-50 py-6">
          <div className="container px-4 md:px-6">
            <Separator className="bg-gray-200" />
          </div>
        </div>

        {/* Feature Section Header */}
        <section id="features" className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-4 py-1 mb-4">Features</Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">Everything You Need to Run Successful Events</h2>
              <p className="text-gray-600 text-lg mx-auto max-w-[700px]">
                Manage every aspect of your event lifecycle with our comprehensive tools
              </p>
            </div>
          </div>
        </section>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* Section Divider */}
        <div className="bg-white py-6">
          <div className="container px-4 md:px-6">
            <Separator className="bg-gray-200" />
          </div>
        </div>

        {/* Pricing Section */}
        <PricingCards />

        {/* Section Divider */}
        <div className="bg-gray-50 py-6">
          <div className="container px-4 md:px-6">
            <Separator className="bg-gray-200" />
          </div>
        </div>

        {/* Testimonials */}
        <Testimonials />

        {/* Demo Request */}
        <section id="request-demo" className="w-full py-16 md:py-24 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <Badge className="w-fit bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-1">Get Started Now</Badge>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Ready to transform your events?
                  </h2>
                  <p className="max-w-[600px] text-gray-600 text-lg">
                    Book a personalized demo with our team and see how Specyf can streamline your event management
                    process.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" asChild>
                    <a href="#request-demo">Book a Demo</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50" asChild>
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm">
                  <div className="flex items-center space-x-2 bg-white py-2 px-4 rounded-full shadow-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium">30-minute personalized walkthrough</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white py-2 px-4 rounded-full shadow-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium">Custom solution advice</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center bg-white p-6 rounded-xl shadow-lg border border-gray-100">
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
