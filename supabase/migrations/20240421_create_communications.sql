-- Create communications table
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  sent_to TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by event_id
CREATE INDEX IF NOT EXISTS communications_event_id_idx ON communications(event_id);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_communications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_communications_updated_at
  BEFORE UPDATE ON communications
  FOR EACH ROW
  EXECUTE FUNCTION update_communications_updated_at();

-- Enable Row Level Security
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Communications are viewable by event owners and guests"
  ON communications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = communications.event_id
      AND (
        events.organizer_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM guests
          WHERE guests.event_id = events.id
          AND guests.id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Communications are insertable by event owners"
  ON communications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = communications.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Communications are updatable by event owners"
  ON communications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = communications.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = communications.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Communications are deletable by event owners"
  ON communications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = communications.event_id
      AND events.organizer_id = auth.uid()
    )
  ); 