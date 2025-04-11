-- Create sub_events table
CREATE TABLE IF NOT EXISTS sub_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by event_id
CREATE INDEX IF NOT EXISTS sub_events_event_id_idx ON sub_events(event_id);

-- Create index for faster lookups by start_time
CREATE INDEX IF NOT EXISTS sub_events_start_time_idx ON sub_events(start_time);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_sub_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sub_events_updated_at
  BEFORE UPDATE ON sub_events
  FOR EACH ROW
  EXECUTE FUNCTION update_sub_events_updated_at();

-- Enable Row Level Security
ALTER TABLE sub_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Sub-events are viewable by event owners and guests"
  ON sub_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sub_events.event_id
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

CREATE POLICY "Sub-events are insertable by event owners"
  ON sub_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sub_events.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Sub-events are updatable by event owners"
  ON sub_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sub_events.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sub_events.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Sub-events are deletable by event owners"
  ON sub_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = sub_events.event_id
      AND events.organizer_id = auth.uid()
    )
  ); 