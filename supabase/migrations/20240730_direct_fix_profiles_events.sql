-- Direct fix script for events-profiles relationship
-- This script can be run directly from the Supabase dashboard SQL editor
-- It will fix the relationship between events and profiles tables

-- Part 1: Make sure profile exists for every user
DO $$
DECLARE
  profiles_created integer := 0;
BEGIN
  -- Create profiles for users that don't have them
  WITH users_without_profiles AS (
    SELECT u.id, u.email 
    FROM auth.users u
    LEFT JOIN profiles p ON u.id = p.id
    WHERE p.id IS NULL
  )
  INSERT INTO profiles (id, email, full_name, created_at, updated_at)
  SELECT 
    id, 
    email, 
    email as full_name, 
    now() as created_at, 
    now() as updated_at
  FROM users_without_profiles;
  
  GET DIAGNOSTICS profiles_created = ROW_COUNT;
  RAISE NOTICE 'Created % profiles for users that were missing them', profiles_created;
END $$;

-- Part 2: Ensure public read access to profiles
DO $$
BEGIN
  -- Drop policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow public to read profiles'
  ) THEN
    DROP POLICY "Allow public to read profiles" ON profiles;
    RAISE NOTICE 'Dropped existing profiles read policy';
  END IF;
  
  -- Create policy to allow public reading of profiles
  -- This is critical for the relationship to work
  CREATE POLICY "Allow public to read profiles" 
    ON profiles FOR SELECT
    TO authenticated, anon
    USING (true);
  
  RAISE NOTICE 'Created public read access policy for profiles';
END $$;

-- Part 3: Set proper grants
DO $$
BEGIN
  -- Grant usage to anon and authenticated roles
  GRANT USAGE ON SCHEMA public TO anon, authenticated;
  
  -- Grant select permission on profiles to anon and authenticated
  GRANT SELECT ON profiles TO anon, authenticated;
  
  RAISE NOTICE 'Set proper grants on profiles table';
END $$;

-- Part 4: Add index to events.organizer_id for better performance
DO $$
BEGIN
  -- Add index if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'events'
    AND indexname = 'events_organizer_id_idx'
  ) THEN
    CREATE INDEX events_organizer_id_idx ON events(organizer_id);
    RAISE NOTICE 'Created index on events.organizer_id';
  ELSE
    RAISE NOTICE 'Index on events.organizer_id already exists';
  END IF;
END $$;

-- Part 5: Test the relationship
DO $$
DECLARE
  test_result text;
BEGIN
  BEGIN
    EXECUTE 'SELECT COUNT(*) FROM events e LEFT JOIN profiles p ON e.organizer_id = p.id' INTO test_result;
    RAISE NOTICE 'Relationship test successful. Found % relationships between events and profiles', test_result;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Relationship test failed: %', SQLERRM;
  END;
END $$;

-- Part 6: Create function to automatically create profile when user is created
DO $$
BEGIN
  -- Create function if it doesn't exist
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
  
  -- Create the trigger if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION handle_new_user();
    
    RAISE NOTICE 'Created trigger for automatic profile creation on signup';
  ELSE
    RAISE NOTICE 'User creation trigger already exists';
  END IF;
END $$; 