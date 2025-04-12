import { Check, X, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            Flexible Plans
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Choose Your Plan</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
            Find the perfect plan for your event management needs. Scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200 relative">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Starter</h3>
              <div className="mt-2 text-gray-500 text-sm">For individuals and small events</div>
              <div className="mt-4">
                <span className="text-3xl font-bold">₹0</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>
            <ul className="space-y-2 text-sm mb-6 flex-grow">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>2 events/month</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Up to 50 guests/event</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Basic RSVP tracking</span>
              </li>
              <li className="flex items-center">
                <X className="h-4 w-4 mr-2 text-gray-300" />
                <span className="text-gray-500">Sub-events</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="mt-auto">
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Basic Plan */}
          <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-emerald-200 relative">
            <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white text-center py-1 text-xs font-semibold rounded-t-lg">
              MOST POPULAR
            </div>
            <div className="text-center mb-4 pt-4">
              <h3 className="text-xl font-bold">Pro Organizer</h3>
              <div className="mt-2 text-gray-500 text-sm">For freelancers and small teams</div>
              <div className="mt-4">
                <span className="text-3xl font-bold">₹299</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">or ₹2999/year (save ₹589)</div>
            </div>
            <ul className="space-y-2 text-sm mb-6 flex-grow">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>10 events/month</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Up to 250 guests/event</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>RSVP tracking + polls</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Up to 3 sub-events</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Basic analytics</span>
              </li>
            </ul>
            <Button asChild className="mt-auto bg-emerald-600 hover:bg-emerald-700">
              <Link href="/auth/signup?plan=pro">
                Subscribe Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg border border-gray-200 relative">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Event Pro+</h3>
              <div className="mt-2 text-gray-500 text-sm">For businesses and large events</div>
              <div className="mt-4">
                <span className="text-3xl font-bold">₹799</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">or ₹7999/year (save ₹1589)</div>
            </div>
            <ul className="space-y-2 text-sm mb-6 flex-grow">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Unlimited events</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Up to 2000 guests/event</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Custom event branding</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Priority support</span>
              </li>
            </ul>
            <Button asChild variant="outline" className="mt-auto border-emerald-600 text-emerald-600 hover:text-emerald-700 hover:border-emerald-700">
              <Link href="/auth/signup?plan=premium">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            Need a custom solution for your organization?
          </p>
          <Button asChild variant="link" className="text-emerald-600 hover:text-emerald-700">
            <Link href="/pricing">
              View full pricing details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 