-- Fix sub_events table by adding the missing date column
-- This migration addresses the error: "column sub_events.date does not exist"

-- First, check if the table exists
DO $$ 
BEGIN
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
      -- Add the date column
      ALTER TABLE sub_events ADD COLUMN date DATE;

      -- Update existing rows with a default date if needed
      UPDATE sub_events SET date = CURRENT_DATE WHERE date IS NULL;
      
      RAISE NOTICE 'Added date column to sub_events table';
    ELSE
      RAISE NOTICE 'The date column already exists in sub_events table';
    END IF;
  ELSE
    RAISE NOTICE 'The sub_events table does not exist yet';
  END IF;
END $$; 