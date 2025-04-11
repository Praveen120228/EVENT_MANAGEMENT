import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingCards() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose the plan that fits your needs. All plans include core features with additional capabilities as you
              scale.
            </p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border bg-card p-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Basic</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-bold">$0</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Perfect for small events and getting started
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Up to 5 events</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Basic event management</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Email support</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8">Get Started</Button>
          </div>

          <div className="flex flex-col rounded-lg border bg-card p-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-bold">$29</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                For growing event businesses
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Unlimited events</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Advanced event management</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8">Get Started</Button>
          </div>

          <div className="flex flex-col rounded-lg border bg-card p-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-bold">$99</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                For large organizations and agencies
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Unlimited everything</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Dedicated support</span>
                </li>
              </ul>
            </div>
            <Button className="mt-8">Contact Sales</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
