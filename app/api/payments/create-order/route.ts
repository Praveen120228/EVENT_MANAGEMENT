import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Initialize Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 