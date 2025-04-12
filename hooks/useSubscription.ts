'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from './useSupabase';

export type Subscription = {
  id: string;
  user_id: string;
  plan_id: string;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
};

type SubscriptionHook = {
  subscription: Subscription | null;
  isLoading: boolean;
  error: Error | null;
  isPro: boolean;
  isPremium: boolean;
  isFree: boolean;
  refetch: () => Promise<void>;
};

export function useSubscription(): SubscriptionHook {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { supabase, user } = useSupabase();

  const fetchSubscription = async () => {
    if (!user || !supabase) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No subscription found
          setSubscription(null);
        } else {
          throw error;
        }
      } else {
        setSubscription(data as Subscription);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user, supabase]);

  // Subscribe to changes in subscription table
  useEffect(() => {
    if (!supabase || !user) return;

    const subscription = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setSubscription(payload.new as Subscription);
          } else if (payload.eventType === 'DELETE') {
            setSubscription(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase, user]);

  const isPro = Boolean(subscription && subscription.plan_id === 'pro');
  const isPremium = Boolean(subscription && subscription.plan_id === 'premium');
  const isFree = !subscription;

  return {
    subscription,
    isLoading,
    error,
    isPro,
    isPremium,
    isFree,
    refetch: fetchSubscription,
  };
}