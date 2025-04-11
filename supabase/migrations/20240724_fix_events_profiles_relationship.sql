-- Fix the relationship between events and profiles

-- First, make sure the profiles table exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policy for public reading of profiles (needed for event pages)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow public to read profiles'
  ) THEN
    CREATE POLICY "Allow public to read profiles" 
      ON profiles FOR SELECT
      TO authenticated, anon
      USING (true);
  END IF;
END $$;

-- Add an index to organizer_id in events table for faster lookups
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

-- Ensure we have a policy for public events that allows anonymous reads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' 
    AND policyname = 'Public events can be viewed by anyone'
  ) THEN
    CREATE POLICY "Public events can be viewed by anyone" 
      ON events FOR SELECT 
      TO authenticated, anon
      USING (is_public = true AND status = 'published');
  END IF;
END $$; 