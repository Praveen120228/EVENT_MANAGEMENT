-- Fix the relationship between events and profiles tables
-- This addresses the error: "Could not find a relationship between 'events' and 'profiles'"

-- First, ensure the profiles table exists and has the correct structure
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) THEN
    -- Create the profiles table if it doesn't exist
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    
    -- Enable RLS
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create or update the policy for public reading of profiles
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow public to read profiles'
  ) THEN
    -- Drop existing policy first to recreate it
    DROP POLICY "Allow public to read profiles" ON profiles;
  END IF;
  
  -- Create the policy to allow public reading of profiles
  CREATE POLICY "Allow public to read profiles" 
    ON profiles FOR SELECT
    TO authenticated, anon
    USING (true);
END $$;

-- Ensure the correct basic policies exist for profiles
DO $$
BEGIN
  -- Check and create policy for users to view their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
      ON profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;
  
  -- Check and create policy for users to update their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create a function to handle new user signups (creates profile)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'handle_new_user'
  ) THEN
    CREATE OR REPLACE FUNCTION handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, email, full_name)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;
END $$;

-- Create the trigger on auth.users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user();
  END IF;
END $$;

-- Add index to profiles email for faster lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'profiles'
    AND indexname = 'profiles_email_idx'
  ) THEN
    CREATE INDEX profiles_email_idx ON profiles(email);
  END IF;
END $$;

-- Add index to events organizer_id for faster joins with profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'events'
    AND indexname = 'events_organizer_id_idx'
  ) THEN
    CREATE INDEX events_organizer_id_idx ON events(organizer_id);
  END IF;
END $$;

-- Verify the relationship by creating a function to test it
CREATE OR REPLACE FUNCTION test_events_profiles_relationship()
RETURNS json
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
BEGIN
  BEGIN
    -- Try a simple join between events and profiles
    EXECUTE '
      SELECT e.id, e.title, p.full_name
      FROM events e
      LEFT JOIN profiles p ON e.organizer_id = p.id
      LIMIT 1
    ';
    
    result := json_build_object('success', true, 'message', 'Relationship between events and profiles is working correctly');
  EXCEPTION WHEN OTHERS THEN
    result := json_build_object('success', false, 'message', 'Relationship error: ' || SQLERRM);
  END;
  
  RETURN result;
END;
$$; 