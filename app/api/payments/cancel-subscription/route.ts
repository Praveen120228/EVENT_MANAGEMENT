import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Get subscription ID from request
    const { subscriptionId } = await request.json();
    
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscription ID' },
        { status: 400 }
      );
    }
    
    // Get the subscription to check if it exists and is active
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();
      
    if (fetchError || !subscription) {
      console.error('Error fetching subscription:', fetchError);
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    if (subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      );
    }
    
    // Update subscription status to canceled
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString(),
        canceled_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);
      
    if (updateError) {
      console.error('Error updating subscription:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled',
      // The subscription will remain active until the end of the current billing period
      end_date: subscription.current_period_end
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
} 