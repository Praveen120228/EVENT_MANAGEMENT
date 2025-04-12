import Link from 'next/link'
import { Check, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CheckoutButton } from '@/components/subscription/checkout-button'

export function PricingSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include our core event management features.
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
            <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white text-xs font-medium py-1 text-center">
              MOST POPULAR
            </div>
            <div className="text-center mb-4 mt-4">
              <h3 className="text-xl font-bold">Pro Organizer</h3>
              <div className="mt-2 text-gray-500 text-sm">For teams and medium-sized events</div>
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
                <span>Sub-events (3 per event)</span>
              </li>
            </ul>
            <CheckoutButton 
              planId="pro" 
              interval="monthly" 
              buttonText="Subscribe Now" 
              className="mt-auto bg-emerald-600 hover:bg-emerald-700"
            />
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
            <CheckoutButton 
              planId="premium" 
              interval="monthly" 
              buttonText="Choose Plan" 
              variant="outline" 
              className="mt-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            />
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/pricing" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center">
            See all features and plans
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
} 