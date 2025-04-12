'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/hooks/useSupabase';

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutButtonProps {
  planId: string;
  interval: 'monthly' | 'yearly';
  buttonText: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  className?: string;
}

export function CheckoutButton({
  planId,
  interval,
  buttonText,
  variant = 'default',
  className = '',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useSupabase();

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login if no user is logged in
      router.push(`/auth/login?redirect=/pricing&plan=${planId}&interval=${interval}`);
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script if it's not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      // Create order on server
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          interval,
          userId: user.id,
        }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Initialize Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Specyf',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan - ${interval}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#059669', // emerald-600
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

      // Handle payment failures
      razorpayInstance.on('payment.failed', function (response: any) {
        toast({
          title: 'Payment Failed',
          description: response.error.description,
          variant: 'destructive',
        });
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to verify payment on the server
  const verifyPayment = async (paymentData: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const response = await fetch('/api/payments/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      toast({
        title: 'Payment Successful',
        description: 'Your subscription has been activated.',
      });

      // Redirect to dashboard
      router.push('/dashboard?subscription=success');
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error instanceof Error ? error.message : 'Failed to verify payment',
        variant: 'destructive',
      });
    }
  };

  // Function to load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  return (
    <Button
      onClick={handleCheckout}
      variant={variant}
      className={className}
      disabled={loading}
    >
      {loading ? 'Processing...' : buttonText}
    </Button>
  );
}