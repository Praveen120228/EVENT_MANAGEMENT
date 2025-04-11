import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Don't just take our word for it. See how Specyf has transformed event management for our customers.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <Tabs defaultValue="wedding" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="wedding">Wedding</TabsTrigger>
              <TabsTrigger value="corporate">Corporate</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="workshop">Workshop</TabsTrigger>
            </TabsList>
            <TabsContent value="wedding" className="mt-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      width={60}
                      height={60}
                      alt="Sarah & Michael"
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Sarah & Michael Johnson</CardTitle>
                      <CardDescription>Wedding Organizers</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    "Planning our wedding was so much easier with Specyf. The RSVP tracking and guest management
                    features saved us countless hours of work. Our guests loved the easy response system and we were
                    able to keep everyone updated with real-time announcements. Highly recommend for any couple planning
                    their big day!"
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="corporate" className="mt-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      width={60}
                      height={60}
                      alt="Jennifer Chen"
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Jennifer Chen</CardTitle>
                      <CardDescription>Event Director, TechCorp Inc.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    "As someone who organizes multiple corporate events each quarter, Specyf has been a game-changer.
                    The ability to manage multiple events simultaneously, track attendance, and gather feedback through
                    polls has streamlined our entire process. The analytics provided help us make data-driven decisions
                    for future events."
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="education" className="mt-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      width={60}
                      height={60}
                      alt="Professor Williams"
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Professor David Williams</CardTitle>
                      <CardDescription>Campus Events Coordinator, State University</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    "Coordinating campus events across multiple departments used to be a logistical nightmare. With
                    Specyf, we've been able to centralize our event management, improve communication, and increase
                    student participation. The nested sub-event feature is perfect for organizing orientation weeks and
                    multi-day conferences."
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="workshop" className="mt-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      width={60}
                      height={60}
                      alt="Maya Rodriguez"
                      className="rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg">Maya Rodriguez</CardTitle>
                      <CardDescription>Workshop Facilitator, Creative Minds</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    "I run creative workshops throughout the year, and Specyf has made it so much easier to manage
                    registrations, communicate with participants, and gather preferences beforehand. The polls feature
                    helps me tailor each workshop to the specific interests of the group, resulting in much more engaged
                    participants."
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}
