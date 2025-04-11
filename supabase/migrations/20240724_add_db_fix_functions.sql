-- Create a function that can be called via RPC to fix policies
-- This function will check and add a public read policy to profiles table

CREATE OR REPLACE FUNCTION create_profiles_read_policy()
RETURNS json
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
BEGIN
  -- Check if the policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow public to read profiles'
  ) THEN
    BEGIN
      -- Add public read access to profiles
      CREATE POLICY "Allow public to read profiles" 
        ON profiles FOR SELECT
        TO authenticated, anon
        USING (true);
      
      result := json_build_object('success', true, 'message', 'Policy created successfully');
    EXCEPTION WHEN OTHERS THEN
      result := json_build_object('success', false, 'message', 'Failed to create policy: ' || SQLERRM);
    END;
  ELSE
    result := json_build_object('success', true, 'message', 'Policy already exists');
  END IF;
  
  -- Also ensure event policies exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' 
    AND policyname = 'Public events can be viewed by anyone'
  ) THEN
    BEGIN
      CREATE POLICY "Public events can be viewed by anyone" 
        ON events FOR SELECT 
        TO authenticated, anon
        USING (is_public = true AND status = 'published');
    EXCEPTION WHEN OTHERS THEN
      -- Just log the error but don't fail the function
      RAISE NOTICE 'Could not create events policy: %', SQLERRM;
    END;
  END IF;
  
  RETURN result;
END;
$$; 