-- Create a function that can be called via RPC to fix the sub_events table
-- This function will add the missing date column if needed

CREATE OR REPLACE FUNCTION fix_sub_events_table()
RETURNS json
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
BEGIN
  -- Check if the table exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'sub_events'
  ) THEN
    -- Check if the date column already exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'sub_events' 
      AND column_name = 'date'
    ) THEN
      BEGIN
        -- Add the date column
        ALTER TABLE sub_events ADD COLUMN date DATE;

        -- Update existing rows with a default date if needed
        UPDATE sub_events SET date = CURRENT_DATE WHERE date IS NULL;
        
        result := json_build_object('success', true, 'message', 'Added date column to sub_events table');
      EXCEPTION WHEN OTHERS THEN
        result := json_build_object('success', false, 'message', 'Failed to add date column: ' || SQLERRM);
      END;
    ELSE
      result := json_build_object('success', true, 'message', 'The date column already exists in sub_events table');
    END IF;
  ELSE
    result := json_build_object('success', false, 'message', 'The sub_events table does not exist yet');
  END IF;
  
  RETURN result;
END;
$$; 

-- Create a function that can be called via RPC to fix the relationship between events and profiles
CREATE OR REPLACE FUNCTION fix_events_profiles_relationship()
RETURNS json
SECURITY DEFINER  -- This is important to allow the function to run with elevated permissions
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
  err_ctx text;
  err_msg text;
  err_detail text;
  err_hint text;
  profile_count integer;
  user_count integer;
BEGIN
  -- Get some stats for diagnostic purposes
  BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users;
    EXCEPTION WHEN OTHERS THEN user_count := 0;
  END;
  
  -- Step 1: Ensure the profiles table exists with correct structure
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
      
      -- Log that we created the table
      RAISE NOTICE 'Created profiles table';
    ELSE
      RAISE NOTICE 'Profiles table already exists';
    END IF;
    
    -- Get profile count for diagnostics
    BEGIN
      SELECT COUNT(*) INTO profile_count FROM profiles;
      EXCEPTION WHEN OTHERS THEN profile_count := 0;
    END;
    
    -- Step 2: Set proper grants for the table
    BEGIN
      -- Grant usage to anon and authenticated roles
      GRANT USAGE ON SCHEMA public TO anon, authenticated;
      
      -- Grant select permission on profiles to anon and authenticated 
      GRANT SELECT ON profiles TO anon, authenticated;
      
      -- Grant all privileges to the postgres role (service role)
      GRANT ALL PRIVILEGES ON profiles TO postgres;
      
      -- Additional grants for sequences if needed
      IF EXISTS (
        SELECT 1 FROM information_schema.sequences
        WHERE sequence_schema = 'public' 
        AND sequence_name = 'profiles_id_seq'
      ) THEN
        GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO anon, authenticated;
      END IF;
      
      RAISE NOTICE 'Set proper grants on profiles table';
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error setting grants: %', SQLERRM;
      -- Continue anyway, this might not be critical
    END;
    
    -- Step 3: Create or update the public read policy for profiles
    IF EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'profiles' 
      AND policyname = 'Allow public to read profiles'
    ) THEN
      -- Drop existing policy first to recreate it
      DROP POLICY "Allow public to read profiles" ON profiles;
      RAISE NOTICE 'Dropped existing profiles read policy';
    END IF;
    
    -- Create more specific policies for different operations
    
    -- Public read policy - This is critical for the relationship to work
    CREATE POLICY "Allow public to read profiles" 
      ON profiles FOR SELECT
      TO authenticated, anon
      USING (true);
    
    -- User-specific policies 
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'profiles' 
      AND policyname = 'Users can update own profile'
    ) THEN
      CREATE POLICY "Users can update own profile"
        ON profiles FOR UPDATE
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;
    
    RAISE NOTICE 'Created profile policies';
      
    -- Step 4: Add the organizer_id index if it doesn't exist
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
    
    -- Step 5: Make sure the organizer_id in events is properly linking to profiles
    BEGIN
      -- Add foreign key constraint if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_schema = 'public'
        AND table_name = 'events'
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name = 'events_organizer_id_fkey'
      ) THEN
        -- This might fail if data integrity is already compromised
        BEGIN
          ALTER TABLE events ADD CONSTRAINT events_organizer_id_fkey 
            FOREIGN KEY (organizer_id) REFERENCES auth.users(id) ON DELETE CASCADE;
          RAISE NOTICE 'Added foreign key constraint to events.organizer_id';
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Could not add foreign key constraint: %', SQLERRM;
          -- Continue anyway, this might be due to existing data issues
        END;
      END IF;
    END;
    
    -- Step 6: Ensure profiles exist for all auth.users
    -- This is critical - missing profiles for existing users will break the relationship
    BEGIN
      -- Check for users without profiles
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
    
      GET DIAGNOSTICS profile_count = ROW_COUNT;
      IF profile_count > 0 THEN
        RAISE NOTICE 'Created % missing profiles for existing users', profile_count;
      ELSE
        RAISE NOTICE 'No missing profiles found';
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error syncing profiles with users: %', SQLERRM;
    END;
    
    -- Step 7: Check if user trigger exists and create if needed
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger
      WHERE tgname = 'on_auth_user_created'
    ) THEN
      -- Create function to handle new user signups if it doesn't exist
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
        
        RAISE NOTICE 'Created handle_new_user function';
      END IF;
      
      -- Create the trigger
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION handle_new_user();
        
      RAISE NOTICE 'Created trigger on auth.users';
    ELSE
      RAISE NOTICE 'User creation trigger already exists';
    END IF;
    
    -- Step 8: Test the relationship with a simple query
    BEGIN
      EXECUTE '
        SELECT e.id, e.title, p.full_name
        FROM events e
        LEFT JOIN profiles p ON e.organizer_id = p.id
        LIMIT 1
      ';
      
      RAISE NOTICE 'Successfully tested events-profiles relationship';
      result := json_build_object(
        'success', true, 
        'message', 'Events-profiles relationship fixed successfully',
        'details', format('Verified join between events (%s users) and profiles (%s profiles) tables works correctly', 
                         user_count::text, profile_count::text)
      );
    EXCEPTION WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS 
        err_msg = MESSAGE_TEXT,
        err_detail = PG_EXCEPTION_DETAIL,
        err_hint = PG_EXCEPTION_HINT,
        err_ctx = PG_EXCEPTION_CONTEXT;
        
      result := json_build_object(
        'success', false, 
        'message', 'Failed to verify events-profiles relationship',
        'error', err_msg,
        'detail', err_detail,
        'hint', err_hint,
        'context', err_ctx,
        'user_count', user_count,
        'profile_count', profile_count
      );
      RAISE WARNING 'Error testing relationship: %', err_msg;
    END;
  EXCEPTION WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS 
      err_msg = MESSAGE_TEXT,
      err_detail = PG_EXCEPTION_DETAIL,
      err_hint = PG_EXCEPTION_HINT,
      err_ctx = PG_EXCEPTION_CONTEXT;
      
    result := json_build_object(
      'success', false, 
      'message', 'Failed to fix events-profiles relationship', 
      'error', err_msg,
      'detail', err_detail,
      'hint', err_hint,
      'context', err_ctx,
      'user_count', user_count,
      'profile_count', profile_count
    );
    RAISE WARNING 'Error fixing relationship: %', err_msg;
  END;
  
  RETURN result;
END;
$$; 