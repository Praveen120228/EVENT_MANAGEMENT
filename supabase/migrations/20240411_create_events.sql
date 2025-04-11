-- Create enum for event types
CREATE TYPE event_type AS ENUM (
  'workshop',
  'meetup',
  'business',
  'college',
  'personal'
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  max_guests INTEGER NOT NULL,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  is_public BOOLEAN DEFAULT false,
  invitation_link TEXT UNIQUE
);

-- Create RLS policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy for organizers to manage their own events
CREATE POLICY "Users can manage their own events"
  ON events
  FOR ALL
  USING (auth.uid() = organizer_id);

-- Policy for viewing published events (if they're public)
CREATE POLICY "Anyone can view published public events"
  ON events
  FOR SELECT
  USING (status = 'published' AND is_public = true);

-- Create function to generate unique invitation link
CREATE OR REPLACE FUNCTION generate_invitation_link()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invitation_link := encode(gen_random_bytes(8), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate invitation link
CREATE TRIGGER set_invitation_link
  BEFORE INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION generate_invitation_link();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 