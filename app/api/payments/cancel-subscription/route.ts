import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

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

export async function POST(request: Request) {
  try {
    // Ensure we have a Supabase client - if service role client failed, use auth client
    if (!supabase) {
      supabase = createServerComponentClient<Database>({ cookies });
    }
    
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