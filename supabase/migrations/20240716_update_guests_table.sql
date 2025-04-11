-- Add response_date column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'guests' 
      AND column_name = 'response_date'
  ) THEN
    ALTER TABLE public.guests ADD COLUMN response_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;
  END IF;
END $$;

-- Add message column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'guests' 
      AND column_name = 'message'
  ) THEN
    ALTER TABLE public.guests ADD COLUMN message TEXT DEFAULT NULL;
  END IF;
END $$; 