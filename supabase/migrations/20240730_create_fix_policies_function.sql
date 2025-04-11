-- Create a function that can be called via RPC to create/update policies
-- This is a simpler helper function that focuses just on policy creation

CREATE OR REPLACE FUNCTION create_fix_policies()
RETURNS json
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result json;
BEGIN
  BEGIN
    -- Drop policy if it exists
    IF EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'profiles' 
      AND policyname = 'Allow public to read profiles'
    ) THEN
      DROP POLICY "Allow public to read profiles" ON profiles;
    END IF;
    
    -- Create public read policy for profiles
    CREATE POLICY "Allow public to read profiles" 
      ON profiles FOR SELECT
      TO authenticated, anon
      USING (true);
    
    -- Make sure profiles table has RLS enabled
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Set basic grants
    GRANT USAGE ON SCHEMA public TO anon, authenticated;
    GRANT SELECT ON profiles TO anon, authenticated;
    
    result := json_build_object(
      'success', true, 
      'message', 'Successfully created/updated policies for profiles table'
    );
  EXCEPTION WHEN OTHERS THEN
    result := json_build_object(
      'success', false, 
      'message', 'Failed to create/update policies',
      'error', SQLERRM
    );
  END;
  
  RETURN result;
END;
$$; 