-- Add missing columns to profiles table if they don't exist
DO $$
BEGIN
  -- Add timezone column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'timezone') THEN
    ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'UTC';
  END IF;
  
  -- Add language column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'language') THEN
    ALTER TABLE profiles ADD COLUMN language TEXT DEFAULT 'en';
  END IF;
  
  -- Add theme column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'theme') THEN
    ALTER TABLE profiles ADD COLUMN theme TEXT DEFAULT 'system';
  END IF;
  
  -- Add notification preference columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email_notifications') THEN
    ALTER TABLE profiles ADD COLUMN email_notifications BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'event_reminders') THEN
    ALTER TABLE profiles ADD COLUMN event_reminders BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'guest_updates') THEN
    ALTER TABLE profiles ADD COLUMN guest_updates BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketing_emails') THEN
    ALTER TABLE profiles ADD COLUMN marketing_emails BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'weekly_digest') THEN
    ALTER TABLE profiles ADD COLUMN weekly_digest BOOLEAN DEFAULT true;
  END IF;
END $$; 