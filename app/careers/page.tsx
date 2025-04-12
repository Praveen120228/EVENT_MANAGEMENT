import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export default function CareersPage() {
  // Sample job listings
  const jobListings = [
    {
      id: 1,
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "San Francisco, CA (Remote Option)",
      type: "Full-time",
      description:
        "We're looking for a Senior Frontend Engineer to help build and improve our event management platform. You'll work on creating intuitive user interfaces and enhancing the overall user experience.",
      requirements: [
        "5+ years of experience with modern JavaScript frameworks (React preferred)",
        "Experience with TypeScript, Next.js, and modern CSS solutions",
        "Strong understanding of web performance optimization",
        "Passion for creating accessible and responsive user interfaces",
        "Excellent communication and collaboration skills",
      ],
      slug: "/careers/senior-frontend-engineer",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      description:
        "We're seeking a Product Manager to drive the product vision and roadmap for our event management platform. You'll work closely with engineering, design, and customer success teams to build features that delight our users.",
      requirements: [
        "3+ years of product management experience, preferably in SaaS or B2B products",
        "Strong analytical skills and data-driven decision making",
        "Excellent communication and stakeholder management",
        "Experience gathering and prioritizing user requirements",
        "Passion for event technology and user experience",
      ],
      slug: "/careers/product-manager",
    },
    {
      id: 3,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description:
        "As a Customer Success Manager, you'll be responsible for ensuring our customers achieve their goals using our platform. You'll provide onboarding, training, and ongoing support to event organizers.",
      requirements: [
        "2+ years of customer success or account management experience",
        "Strong communication and presentation skills",
        "Experience with CRM tools and customer support platforms",
        "Problem-solving mindset and ability to handle customer issues effectively",
        "Interest in event management and technology",
      ],
      slug: "/careers/customer-success-manager",
    },
    {
      id: 4,
      title: "Backend Engineer",
      department: "Engineering",
      location: "San Francisco, CA (Remote Option)",
      type: "Full-time",
      description:
        "We're looking for a Backend Engineer to help build the infrastructure and services that power our event management platform. You'll work on API development, database architecture, and system performance.",
      requirements: [
        "3+ years of experience in backend development",
        "Proficiency in Node.js, PostgreSQL, and RESTful API design",
        "Experience with cloud infrastructure (AWS, Azure, or GCP)",
        "Knowledge of security best practices and data protection",
        "Collaborative mindset and willingness to mentor junior engineers",
      ],
      slug: "/careers/backend-engineer",
    },
    {
      id: 5,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description:
        "We're seeking a Marketing Specialist to help grow our user base and increase brand awareness. You'll create content, manage campaigns, and analyze performance metrics to drive customer acquisition.",
      requirements: [
        "2+ years of B2B or SaaS marketing experience",
        "Experience with content creation, email marketing, and social media",
        "Analytical mindset and experience with marketing analytics tools",
        "Excellent writing and communication skills",
        "Knowledge of SEO and performance marketing principles",
      ],
      slug: "/careers/marketing-specialist",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Our Team</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Help us build the future of event management. Explore our open positions and grow your career with us.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                  <a href="#open-positions">View Open Positions</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#benefits">Our Benefits</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Specyf */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Why Join Specyf?</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  At Specyf, we're on a mission to transform the way events are planned and managed. Our team is
                  passionate about creating tools that make event organizers' lives easier and attendees' experiences
                  better.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  We value innovation, collaboration, and impact. Our diverse team brings together expertise from various
                  backgrounds to solve complex problems and create delightful user experiences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-bold text-lg">Innovation</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We encourage creative thinking and are not afraid to try new approaches.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-bold text-lg">Growth</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We invest in our team's personal and professional development.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-bold text-lg">Balance</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We believe in flexible work schedules and respecting personal time.
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-bold text-lg">Impact</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Our work directly helps thousands of event organizers and attendees.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    width={800}
                    height={600}
                    alt="Specyf team working together"
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-6 rounded-lg shadow-lg md:max-w-[240px]">
                  <p className="font-bold text-lg mb-2">Our Culture</p>
                  <p className="text-gray-500 text-sm">
                    "We foster a culture of trust, respect, and continuous learning where everyone can make an impact."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Our Benefits</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We take care of our team with comprehensive benefits and perks.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Health & Wellness</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li>Comprehensive medical, dental, and vision coverage</li>
                    <li>Mental health support and resources</li>
                    <li>Wellness stipend for gym memberships or fitness apps</li>
                    <li>Generous PTO and sick leave policy</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Growth & Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li>Learning and development budget</li>
                    <li>Conference and education reimbursement</li>
                    <li>Career growth opportunities and mentorship</li>
                    <li>Regular feedback and performance reviews</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Work-Life Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li>Flexible work schedule</li>
                    <li>Remote work options</li>
                    <li>Paid parental leave</li>
                    <li>Company-wide wellness days and team activities</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Financial Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li>Competitive salary packages</li>
                    <li>Equity options for all employees</li>
                    <li>401(k) with employer match</li>
                    <li>Referral bonuses and performance incentives</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Office Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li>Ergonomic home office setup allowance</li>
                    <li>Team lunches and snacks (when in office)</li>
                    <li>Pet-friendly office environment</li>
                    <li>Free Specyf Premium subscription</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                    <li>Volunteer time off (VTO) for community service</li>
                    <li>Donation matching program</li>
                    <li>Diversity and inclusion initiatives</li>
                    <li>Team building events and retreats</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Open Positions</h2>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Find your next opportunity at Specyf. We're growing and looking for talented individuals to join our
                  team.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {jobListings.map((job) => (
                <Card key={job.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <CardTitle className="group-hover:text-emerald-600 transition-colors">
                          <Link href={job.slug}>{job.title}</Link>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{job.department}</Badge>
                          <span className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="text-sm">{job.type}</span>
                        </CardDescription>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap" asChild>
                        <Link href={job.slug}>Apply Now</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{job.description}</p>
                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="list-disc pl-6 space-y-1 text-gray-500 dark:text-gray-400">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-gray-500 mb-4">Don't see a position that matches your skills?</p>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 