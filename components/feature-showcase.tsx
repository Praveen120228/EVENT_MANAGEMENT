import { CalendarRange, CheckCircle, Clock, Mail, MessageSquare, Users, Zap } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FeatureShowcase() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-500 text-primary-foreground hover:bg-emerald-500/80">
              Core Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Tools for Every Event</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Streamline your event management with our comprehensive suite of tools designed for every type of event.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="organizers">Organizers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              {/* Event management features */}
            </TabsContent>
            <TabsContent value="organizers">
              {/* Organizer features */}
            </TabsContent>
            <TabsContent value="analytics">
              {/* Analytics features */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
