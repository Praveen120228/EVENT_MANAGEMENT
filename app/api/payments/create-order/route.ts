import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { randomUUID } from 'crypto';
import { Database } from '@/types/supabase';

// Initialize Razorpay with your key_id and key_secret - but only if both are available
let razorpay: Razorpay | null = null;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (razorpayKeyId && razorpayKeySecret) {
  try {
    razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });
  } catch (error) {
    console.error('Error initializing Razorpay client:', error);
  }
} else {
  console.warn('Razorpay credentials missing: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET not set');
}

// Initialize Supabase client - with fallback to auth client
let supabase: SupabaseClient<Database> | null = null;

// Try to create Supabase client with service role if available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Service Role Key not found. Falling back to auth client.');
  // Fallback to auth client which will work for authenticated requests
} else {
  try {
    supabase = createClient<Database>(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Error creating Supabase client with service role:', error);
    // Will fallback to auth client below
  }
}

const PLAN_PRICES = {
  'pro': {
    monthly: 29900, // ₹299 in paise (smallest currency unit)
    yearly: 299900, // ₹2999 in paise
  },
  'premium': {
    monthly: 79900, // ₹799 in paise
    yearly: 799900, // ₹7999 in paise
  }
};

export async function POST(request: Request) {
  try {
    // Ensure we have a Supabase client - if service role client failed, use auth client
    if (!supabase) {
      supabase = createServerComponentClient<Database>({ cookies });
    }
    
    // Check if Razorpay is initialized
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment system not properly configured. Please contact support.' },
        { status: 500 }
      );
    }
    
    // Get plan details from request
    const { planId, interval, userId } = await request.json();
    
    if (!planId || !interval || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Validate plan and interval
    if (!PLAN_PRICES[planId as keyof typeof PLAN_PRICES] || 
        !['monthly', 'yearly'].includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid plan or interval' },
        { status: 400 }
      );
    }
    
    // Get price for the selected plan and interval
    const amount = PLAN_PRICES[planId as keyof typeof PLAN_PRICES][interval as 'monthly' | 'yearly'];
    
    // Create a receipt ID
    const receiptId = `rcpt_${randomUUID().replace(/-/g, '')}`;
    
    // Create order in Razorpay
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        planId,
        interval,
        userId
      }
    });
    
    // Save order details in your database
    const { error } = await supabase
      .from('subscription_orders')
      .insert({
        order_id: order.id,
        user_id: userId,
        plan_id: planId,
        interval: interval,
        amount: amount,
        status: 'created',
        receipt: receiptId
      });
      
    if (error) {
      console.error('Error saving order to database:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
    
    // Return order details to client
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: razorpayKeyId,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 