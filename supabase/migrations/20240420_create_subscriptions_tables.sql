-- Create the subscription_orders table
CREATE TABLE IF NOT EXISTS subscription_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  plan_id TEXT NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
  receipt TEXT NOT NULL,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  plan_id TEXT NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index to improve query performance
CREATE INDEX IF NOT EXISTS user_subscriptions_idx ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS user_orders_idx ON subscription_orders (user_id);
CREATE INDEX IF NOT EXISTS order_id_idx ON subscription_orders (order_id);

-- Set up RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_orders ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own subscriptions
CREATE POLICY view_own_subscriptions
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to view their own orders
CREATE POLICY view_own_orders
  ON subscription_orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow server-side insert/update through the service role
CREATE POLICY insert_subscription_service_role
  ON subscriptions
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY update_subscription_service_role
  ON subscriptions
  FOR UPDATE
  USING (false);

CREATE POLICY insert_order_service_role
  ON subscription_orders
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY update_order_service_role
  ON subscription_orders
  FOR UPDATE
  USING (false);

-- Create a function to check if a user has an active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid UUID) 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM subscriptions 
        WHERE user_id = user_uuid 
        AND status = 'active' 
        AND current_period_end > now()
    );
END;
$$;

-- Create a function to get a user's subscription plan
CREATE OR REPLACE FUNCTION public.get_user_plan(user_uuid UUID) 
RETURNS TEXT 
LANGUAGE plpgsql 
AS $$
DECLARE
    user_plan TEXT;
BEGIN
    SELECT plan_id INTO user_plan
    FROM subscriptions 
    WHERE user_id = user_uuid 
    AND status = 'active' 
    AND current_period_end > now();
    
    RETURN COALESCE(user_plan, 'free');
END;
$$; 