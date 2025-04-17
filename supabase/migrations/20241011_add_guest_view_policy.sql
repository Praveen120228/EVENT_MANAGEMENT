-- Drop policies if they already exist
DO $$ 
BEGIN
  -- Drop existing policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'guests' 
    AND policyname = 'Guests can view their own invitation'
  ) THEN
    DROP POLICY "Guests can view their own invitation" ON public.guests;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'guests' 
    AND policyname = 'Unauthenticated email check'
  ) THEN
    DROP POLICY "Unauthenticated email check" ON public.guests;
  END IF;
END $$;

-- Add policy for guests to find their own email in the guests table
CREATE POLICY "Guests can view their own invitation"
  ON public.guests FOR SELECT
  USING (
    guests.email = auth.email()
  ); 

-- Add policy for unauthenticated users to check if an email exists in the guests table
-- This is necessary for the login flow
CREATE POLICY "Unauthenticated email check"
  ON public.guests FOR SELECT
  USING (true);

-- Modify RLS settings to enable row security but still allow access
ALTER TABLE public.guests FORCE ROW LEVEL SECURITY; 