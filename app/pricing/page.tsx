import { Check, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutButton } from "@/components/subscription/checkout-button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 md:py-24 px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Subscription Plans</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your event management needs, from personal gatherings to large-scale conferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="border-gray-200 flex flex-col">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Starter</CardTitle>
                <CardDescription className="text-gray-600">Best for individuals or small personal events</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-600 ml-2">Free forever</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Create up to 2 events/month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Max 50 guests/event</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Basic event templates (limited customization)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Email invitations (capped at 100/month)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>RSVP tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>1 Organizer account</span>
                  </li>
                  <li className="flex items-start">
                    <X className="h-5 w-5 text-gray-300 shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-500">No sub-events</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Limited support (Help articles & chatbot)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Basic Plan */}
            <Card className="border-emerald-200 bg-emerald-50 flex flex-col">
              <div className="bg-emerald-600 text-white text-center py-2 text-sm font-medium">
                MOST POPULAR
              </div>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Pro Organizer</CardTitle>
                <CardDescription className="text-gray-600">Suitable for freelancers, small teams, or clubs</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">₹299</span>
                  <span className="text-gray-600 ml-2">/month</span>
                  <div className="text-sm text-gray-500 mt-1">or ₹2999/year (save ₹589)</div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Create up to 10 events/month</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Max 250 guests/event</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Event themes & design customizations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Email invitations (1000/month)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>RSVP tracking + polls</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Sub-events (up to 3/event)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>2 Organizer accounts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>WhatsApp reminders (capped)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Basic analytics</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-4">
                  <CheckoutButton 
                    planId="pro" 
                    interval="monthly" 
                    buttonText="Monthly Plan" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                  />
                  <CheckoutButton 
                    planId="pro" 
                    interval="yearly" 
                    buttonText="Yearly (Save 17%)" 
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800" 
                  />
                </div>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border-gray-200 flex flex-col">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Event Pro+</CardTitle>
                <CardDescription className="text-gray-600">For event planners, colleges, and corporate teams</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">₹799</span>
                  <span className="text-gray-600 ml-2">/month</span>
                  <div className="text-sm text-gray-500 mt-1">or ₹7999/year (save ₹1589)</div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Unlimited events</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Up to 2000 guests/event</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Custom event branding & white-labeling</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Unlimited email invitations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>RSVP, polls, Q&A features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Unlimited sub-events</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>5 Organizer accounts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>WhatsApp + SMS reminders</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Advanced analytics & reporting</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Priority support with dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                    <span>Integration with Google Calendar, Zoom, etc.</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-4">
                  <CheckoutButton 
                    planId="premium" 
                    interval="monthly" 
                    buttonText="Monthly Plan" 
                    variant="outline" 
                    className="flex-1 border-emerald-600 text-emerald-600 hover:text-emerald-700 hover:border-emerald-700" 
                  />
                  <CheckoutButton 
                    planId="premium" 
                    interval="yearly" 
                    buttonText="Yearly (Save 17%)" 
                    variant="outline" 
                    className="flex-1 border-emerald-600 text-emerald-600 hover:text-emerald-700 hover:border-emerald-700" 
                  />
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              We offer tailored plans for larger organizations, educational institutions, and special requirements.
            </p>
            <Button asChild variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
          
          <div className="mt-20 max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600">Yes, you can change your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Is there a limit to how many events I can create?</h3>
                <p className="text-gray-600">Free and Basic plans have monthly limits, while the Premium plan offers unlimited events.</p>
              </div>
              
              <div>
                <h3 className="font-medium">How does the billing work?</h3>
                <p className="text-gray-600">We offer both monthly and annual billing options. Annual plans include a discount.</p>
              </div>
              
              <div>
                <h3 className="font-medium">Is there a free trial available?</h3>
                <p className="text-gray-600">Yes, we offer a 14-day free trial of all our premium features. No credit card required to start.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 