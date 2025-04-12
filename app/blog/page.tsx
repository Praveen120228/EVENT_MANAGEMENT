import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CalendarRange, Clock, User } from "lucide-react"

export default function BlogPage() {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Running a Successful Virtual Conference",
      excerpt:
        "Virtual conferences are here to stay. Learn how to engage remote attendees and deliver a seamless experience with these essential tips.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      date: "May 15, 2023",
      readTime: "8 min read",
      author: "Sarah Johnson",
      category: "Event Planning",
      slug: "/blog/virtual-conference-tips",
    },
    {
      id: 2,
      title: "How to Increase Event Registration Conversion Rates",
      excerpt:
        "Are you struggling with low sign-up rates? Discover proven strategies to optimize your registration process and boost conversions.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      date: "April 3, 2023",
      readTime: "6 min read",
      author: "Michael Chen",
      category: "Marketing",
      slug: "/blog/increase-registration-conversion",
    },
    {
      id: 3,
      title: "The Future of Event Technology: Trends to Watch in 2023",
      excerpt:
        "From AI-powered matchmaking to immersive experiences, explore the emerging technologies that are transforming the event industry.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      date: "March 21, 2023",
      readTime: "10 min read",
      author: "Emily Rodriguez",
      category: "Technology",
      slug: "/blog/event-technology-trends-2023",
    },
    {
      id: 4,
      title: "How to Create an Effective Post-Event Survey",
      excerpt:
        "Gathering meaningful feedback is crucial for improving future events. Learn how to design surveys that yield actionable insights.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      date: "February 12, 2023",
      readTime: "5 min read",
      author: "David Wilson",
      category: "Analytics",
      slug: "/blog/post-event-survey-guide",
    },
    {
      id: 5,
      title: "Sustainable Event Planning: Reducing Your Environmental Footprint",
      excerpt:
        "Discover practical ways to make your events more environmentally friendly without compromising on quality or experience.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      date: "January 28, 2023",
      readTime: "7 min read",
      author: "Rachel Green",
      category: "Sustainability",
      slug: "/blog/sustainable-event-planning",
    },
    {
      id: 6,
      title: "Hybrid Events: Blending In-Person and Virtual Experiences",
      excerpt:
        "Learn how to create inclusive events that cater to both in-person and remote attendees, with strategies for seamless integration.",
      imageUrl: "/placeholder.svg?height=400&width=600",
      date: "December 15, 2022",
      readTime: "9 min read",
      author: "James Peterson",
      category: "Event Strategy",
      slug: "/blog/hybrid-events-guide",
    },
  ]

  // Featured post is the first blog post
  const featuredPost = blogPosts[0]
  // Regular posts are all except the featured one
  const regularPosts = blogPosts.slice(1)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Specyf Blog</h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Insights, tips, and trends for successful event planning and management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Article</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={featuredPost.imageUrl}
                  width={800}
                  height={500}
                  alt={featuredPost.title}
                  className="object-cover w-full aspect-[16/9]"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-100 text-emerald-800">
                    {featuredPost.category}
                  </div>
                </div>
                <h3 className="text-3xl font-bold">{featuredPost.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{featuredPost.excerpt}</p>
                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center">
                    <CalendarRange className="h-4 w-4 mr-1" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPost.readTime}
                  </div>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href={featuredPost.slug}>Read Article</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="w-full py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Latest Articles</h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <article key={post.id} className="group space-y-4">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={post.imageUrl}
                      width={600}
                      height={400}
                      alt={post.title}
                      className="h-60 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-100 text-emerald-800">
                        {post.category}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors">
                      <Link href={post.slug}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500 gap-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link
                        href={post.slug}
                        className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center"
                      >
                        Read More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog/archive">Load More Articles</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Stay Updated</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Subscribe to our newsletter to receive the latest event management tips and insights.
                </p>
              </div>
              <div className="w-full max-w-md">
                <form className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your email"
                      type="email"
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Subscribe</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 