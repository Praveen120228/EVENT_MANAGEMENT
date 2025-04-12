import { CalendarRange, CheckCircle, Clock, Mail, MessageSquare, Users, Zap } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
            <TabsContent value="events" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Comprehensive Event Management</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Create, customize, and manage events of any size with powerful tools designed for efficiency.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Custom event pages with your branding</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Flexible ticket types and registration options</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Automated guest communications</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Integrated calendar and scheduling</span>
                    </li>
                  </ul>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/auth/signup">Try Event Management</Link>
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    width={600} 
                    height={400} 
                    alt="Event management dashboard" 
                    className="object-cover"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="organizers" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="rounded-lg overflow-hidden shadow-xl order-2 md:order-1">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    width={600} 
                    height={400} 
                    alt="Organizer tools interface" 
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 order-1 md:order-2">
                  <h3 className="text-2xl font-bold">Powerful Organizer Tools</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Everything event organizers need to coordinate staff, volunteers, and collaborators.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Team collaboration with role-based permissions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Task assignment and progress tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Staff scheduling and management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Vendor coordination and logistics</span>
                    </li>
                  </ul>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/auth/signup">Explore Organizer Tools</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Insightful Analytics</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Make data-driven decisions with comprehensive analytics and reporting tools.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Real-time attendance tracking and reporting</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Customizable dashboards with key metrics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Revenue and expense tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-emerald-500 shrink-0" />
                      <span>Post-event surveys and feedback analysis</span>
                    </li>
                  </ul>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/auth/signup">View Analytics Demo</Link>
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    width={600} 
                    height={400} 
                    alt="Analytics dashboard" 
                    className="object-cover"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
