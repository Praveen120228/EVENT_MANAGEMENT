import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Get payment details from request
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }
    
    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
      
    const isAuthentic = generatedSignature === razorpay_signature;
    
    if (!isAuthentic) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }
    
    // Get order details from the database
    const { data: orderData, error: orderError } = await supabase
      .from('subscription_orders')
      .select('*')
      .eq('order_id', razorpay_order_id)
      .single();
      
    if (orderError || !orderData) {
      console.error('Error retrieving order:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update order status in the database
    const { error: updateError } = await supabase
      .from('subscription_orders')
      .update({
        status: 'paid',
        payment_id: razorpay_payment_id
      })
      .eq('order_id', razorpay_order_id);
      
    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      );
    }
    
    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (orderData.interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {  // yearly
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Create or update subscription in the database
    const { data: existingSubscription, error: subQueryError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', orderData.user_id)
      .single();
    
    if (existingSubscription) {
      // Update existing subscription
      const { error: updateSubError } = await supabase
        .from('subscriptions')
        .update({
          plan_id: orderData.plan_id,
          interval: orderData.interval,
          status: 'active',
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', orderData.user_id);
        
      if (updateSubError) {
        console.error('Error updating subscription:', updateSubError);
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        );
      }
    } else {
      // Create new subscription
      const { error: createSubError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: orderData.user_id,
          plan_id: orderData.plan_id,
          interval: orderData.interval,
          status: 'active',
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString()
        });
        
      if (createSubError) {
        console.error('Error creating subscription:', createSubError);
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        );
      }
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
} 