import { CalendarRange, CheckCircle, Clock, Mail, MessageSquare, Users, Zap, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FeatureShowcase() {
  return (
    <section id="features-detail" className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-white rounded-lg shadow-sm border border-gray-200">
              <TabsTrigger 
                value="events" 
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm py-3 text-base"
              >
                <CalendarRange className="h-5 w-5 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger 
                value="organizers"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm py-3 text-base"
              >
                <Users className="h-5 w-5 mr-2" />
                Organizers
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm py-3 text-base"
              >
                <Zap className="h-5 w-5 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      Event Management
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Comprehensive Event Tools</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Create, customize, and manage events of any size with powerful tools designed for efficiency.
                    </p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Custom event pages</span>
                        <p className="text-sm text-gray-500">Brand your event pages with your colors and logo</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Flexible registration</span>
                        <p className="text-sm text-gray-500">Multiple ticket types and registration options</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Guest communications</span>
                        <p className="text-sm text-gray-500">Automated emails and notifications</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Scheduling tools</span>
                        <p className="text-sm text-gray-500">Integrated calendar and scheduling features</p>
                      </div>
                    </li>
                  </ul>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 mt-4" size="lg">
                    <Link href="/auth/signup">
                      Try Event Management
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200">
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

            <TabsContent value="organizers" className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200 order-2 md:order-1">
                  <Image 
                    src="/placeholder.svg?height=400&width=600" 
                    width={600} 
                    height={400} 
                    alt="Organizer tools interface" 
                    className="object-cover"
                  />
                </div>
                <div className="space-y-6 order-1 md:order-2">
                  <div>
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-3">
                      <Users className="h-4 w-4 mr-1" />
                      Team Tools
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Powerful Organizer Features</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Everything event organizers need to coordinate staff, volunteers, and collaborators.
                    </p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Team collaboration</span>
                        <p className="text-sm text-gray-500">Role-based permissions for your team</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Task management</span>
                        <p className="text-sm text-gray-500">Assign tasks and track progress</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Staff scheduling</span>
                        <p className="text-sm text-gray-500">Schedule and manage your event staff</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Vendor coordination</span>
                        <p className="text-sm text-gray-500">Manage vendors and logistics in one place</p>
                      </div>
                    </li>
                  </ul>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 mt-4" size="lg">
                    <Link href="/auth/signup">
                      Explore Organizer Tools
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 mb-3">
                      <Zap className="h-4 w-4 mr-1" />
                      Analytics
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Data-Driven Insights</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      Make data-driven decisions with comprehensive analytics and reporting tools.
                    </p>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Real-time tracking</span>
                        <p className="text-sm text-gray-500">Monitor attendance and engagement live</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Custom dashboards</span>
                        <p className="text-sm text-gray-500">Build dashboards with your key metrics</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Financial tracking</span>
                        <p className="text-sm text-gray-500">Monitor revenue and expenses</p>
                      </div>
                    </li>
                    <li className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-900">Feedback analysis</span>
                        <p className="text-sm text-gray-500">Collect and analyze attendee feedback</p>
                      </div>
                    </li>
                  </ul>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 mt-4" size="lg">
                    <Link href="/auth/signup">
                      View Analytics Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl border border-gray-200">
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
