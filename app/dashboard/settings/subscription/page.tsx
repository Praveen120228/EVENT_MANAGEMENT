'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useSupabase } from '@/hooks/useSupabase';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, Clock, CalendarIcon, CreditCard } from 'lucide-react';
import { CheckoutButton } from '@/components/subscription/checkout-button';
import { format } from 'date-fns';
import Link from 'next/link';

export default function SubscriptionPage() {
  const { subscription, isLoading, isPro, isPremium, isFree, refetch } = useSubscription();
  const { user } = useSupabase();
  const { toast } = useToast();
  const [cancelLoading, setCancelLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-8 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-2 max-w-md"></div>
        <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-8 max-w-sm"></div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="animate-pulse h-64 w-full bg-gray-200 rounded"></div>
          <div className="animate-pulse h-64 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleCancelSubscription = async () => {
    if (!user || !subscription) return;

    setCancelLoading(true);
    try {
      const response = await fetch('/api/payments/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled and will end at the current billing period.',
      });

      refetch();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel subscription',
        variant: 'destructive',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  function getSubscriptionStatus() {
    if (isFree) {
      return {
        label: 'Free Plan',
        color: 'bg-gray-100 text-gray-800',
      };
    }

    if (!subscription) {
      return {
        label: 'Unknown',
        color: 'bg-gray-100 text-gray-800',
      };
    }

    switch (subscription.status) {
      case 'active':
        return {
          label: 'Active',
          color: 'bg-emerald-100 text-emerald-800',
        };
      case 'canceled':
        return {
          label: 'Cancelled',
          color: 'bg-amber-100 text-amber-800',
        };
      case 'past_due':
        return {
          label: 'Past Due',
          color: 'bg-red-100 text-red-800',
        };
      case 'trialing':
        return {
          label: 'Trial',
          color: 'bg-blue-100 text-blue-800',
        };
      default:
        return {
          label: subscription.status,
          color: 'bg-gray-100 text-gray-800',
        };
    }
  }

  function getCurrentPlan() {
    if (isPremium) return 'Event Pro+';
    if (isPro) return 'Pro Organizer';
    return 'Starter (Free)';
  }

  const status = getSubscriptionStatus();

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Subscription Management</h1>
          <p className="text-gray-500 mb-1">Manage your subscription and billing information</p>
        </div>
        <Badge className={`${status.color} px-3 py-1 text-sm`}>{status.label}</Badge>
      </div>

      <Separator className="mb-6" />

      {/* Current Subscription */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your current subscription plan and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-500">Plan</div>
              <div className="font-semibold">{getCurrentPlan()}</div>
            </div>

            {subscription && (
              <>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-500">Billing Cycle</div>
                  <div className="font-semibold capitalize">{subscription.interval}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-500">Next Billing Date</div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{format(new Date(subscription.current_period_end), 'dd MMM yyyy')}</span>
                  </div>
                </div>
                
                {subscription.status === 'canceled' && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start">
                    <Clock className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-800 font-medium">Subscription will end on</p>
                      <p className="text-amber-700">{format(new Date(subscription.current_period_end), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                )}
                
                {subscription.status === 'active' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                    <p className="text-emerald-800">
                      Your subscription is active and will automatically renew on {format(new Date(subscription.current_period_end), 'dd MMM yyyy')}
                    </p>
                  </div>
                )}
                
                {subscription.status === 'past_due' && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-800 font-medium">Payment issue detected</p>
                      <p className="text-red-700">Please update your payment method to avoid service interruption</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {isFree && (
              <div className="bg-gray-50 border border-gray-200 p-3 rounded-md flex items-start">
                <InfoIcon className="h-5 w-5 text-gray-500 mr-2 shrink-0 mt-0.5" />
                <p className="text-gray-700">
                  You're currently on the free plan with limited features. Upgrade to access more events, guests, and premium features.
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {isFree ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <CheckoutButton
                planId="pro"
                interval="monthly"
                buttonText="Upgrade to Pro"
                className="bg-emerald-600 hover:bg-emerald-700"
              />
              <CheckoutButton
                planId="premium"
                interval="monthly"
                buttonText="Upgrade to Premium"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              />
            </div>
          ) : subscription?.status === 'active' ? (
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Processing...' : 'Cancel Subscription'}
            </Button>
          ) : subscription?.status === 'canceled' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              <CheckoutButton
                planId="pro"
                interval="monthly"
                buttonText="Resubscribe to Pro"
                className="bg-emerald-600 hover:bg-emerald-700"
              />
              <CheckoutButton
                planId="premium"
                interval="monthly"
                buttonText="Upgrade to Premium"
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              />
            </div>
          ) : null}
        </CardFooter>
      </Card>

      {/* Payment Methods */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isFree ? (
            <div className="flex items-center p-3 border rounded-md">
              <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">Payment through Razorpay</div>
                <div className="text-sm text-gray-500">Manage your payment methods in your Razorpay account</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No payment methods available on free plan</div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past invoices and payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isFree ? (
            <div className="text-gray-500">
              <p>To view your billing history, please visit your Razorpay account or contact support.</p>
            </div>
          ) : (
            <div className="text-gray-500">No billing history available on free plan</div>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
} 