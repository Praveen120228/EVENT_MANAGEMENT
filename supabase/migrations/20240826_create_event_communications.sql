-- Create event_announcements table
CREATE TABLE IF NOT EXISTS event_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_announcements_event_id ON event_announcements(event_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at timestamp
CREATE TRIGGER update_event_announcements_updated_at
BEFORE UPDATE ON event_announcements
FOR EACH ROW
EXECUTE FUNCTION update_event_announcements_updated_at();

-- Set up RLS policies
ALTER TABLE event_announcements ENABLE ROW LEVEL SECURITY;

-- Policy for select: organizers can view their own event announcements
CREATE POLICY select_event_announcements 
ON event_announcements 
FOR SELECT 
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Policy for insert: organizers can insert announcements for their own events
CREATE POLICY insert_event_announcements
ON event_announcements
FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Policy for update: organizers can update their own event announcements
CREATE POLICY update_event_announcements
ON event_announcements
FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Policy for delete: organizers can delete their own event announcements
CREATE POLICY delete_event_announcements
ON event_announcements
FOR DELETE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Create a policy to allow guests to view announcements for events they're invited to
CREATE POLICY guest_select_event_announcements
ON event_announcements
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM guests 
    WHERE guests.event_id = event_announcements.event_id
    AND guests.email = auth.email()
  )
  OR
  -- Anonymous access via direct link (this will be controlled in the application)
  auth.role() = 'anon'
);

-- Create event_polls table
CREATE TABLE IF NOT EXISTS event_polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_polls_event_id ON event_polls(event_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_polls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at timestamp
CREATE TRIGGER update_event_polls_updated_at
BEFORE UPDATE ON event_polls
FOR EACH ROW
EXECUTE FUNCTION update_event_polls_updated_at();

-- Set up RLS policies
ALTER TABLE event_polls ENABLE ROW LEVEL SECURITY;

-- Policy for select: organizers can view their own event polls
CREATE POLICY select_event_polls
ON event_polls
FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Policy for insert: organizers can insert polls for their own events
CREATE POLICY insert_event_polls
ON event_polls
FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Policy for update: organizers can update their own event polls
CREATE POLICY update_event_polls
ON event_polls
FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Policy for delete: organizers can delete their own event polls
CREATE POLICY delete_event_polls
ON event_polls
FOR DELETE
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Create a policy to allow guests to view polls for events they're invited to
CREATE POLICY guest_select_event_polls
ON event_polls
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM guests 
    WHERE guests.event_id = event_polls.event_id
    AND guests.email = auth.email()
  )
  OR
  -- Anonymous access via direct link (this will be controlled in the application)
  auth.role() = 'anon'
);

-- Create event_poll_responses table to track guest responses to polls
CREATE TABLE IF NOT EXISTS event_poll_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES event_polls(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, guest_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_event_poll_responses_poll_id ON event_poll_responses(poll_id);
CREATE INDEX IF NOT EXISTS idx_event_poll_responses_guest_id ON event_poll_responses(guest_id);

-- Set up RLS policies
ALTER TABLE event_poll_responses ENABLE ROW LEVEL SECURITY;

-- Policy for select: organizers can view responses for their own polls
CREATE POLICY select_event_poll_responses
ON event_poll_responses
FOR SELECT
USING (
  poll_id IN (
    SELECT event_polls.id FROM event_polls
    JOIN events ON event_polls.event_id = events.id
    WHERE events.organizer_id = auth.uid()
  )
);

-- Policy for insert: guests can respond to polls for events they're invited to
CREATE POLICY insert_event_poll_responses
ON event_poll_responses
FOR INSERT
WITH CHECK (
  guest_id IN (
    SELECT guests.id FROM guests
    WHERE guests.email = auth.email()
  )
  AND
  poll_id IN (
    SELECT event_polls.id FROM event_polls
    JOIN guests ON event_polls.event_id = guests.event_id
    WHERE guests.id = guest_id
  )
);

-- Policy for update: guests can update their own poll responses
CREATE POLICY update_event_poll_responses
ON event_poll_responses
FOR UPDATE
USING (
  guest_id IN (
    SELECT guests.id FROM guests
    WHERE guests.email = auth.email()
  )
);

-- Create email_logs table to track all sent communications
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('invitation', 'reminder', 'announcement', 'custom')),
  subject TEXT,
  content TEXT,
  recipient_count INTEGER NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create an index on event_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_event_id ON email_logs(event_id);

-- Set up RLS policies
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policy for select: organizers can view email logs for their own events
CREATE POLICY select_email_logs
ON email_logs
FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
);

-- Policy for insert: organizers can log emails for their own events
CREATE POLICY insert_email_logs
ON email_logs
FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE organizer_id = auth.uid()
  )
  OR
  -- Allow the application to insert email logs (for automated emails)
  auth.role() = 'service_role'
); 