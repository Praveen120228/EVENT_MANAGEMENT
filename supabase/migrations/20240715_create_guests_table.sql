-- Create guests table
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'declined')),
  response_date TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS guests_event_id_idx ON public.guests(event_id);
CREATE INDEX IF NOT EXISTS guests_email_idx ON public.guests(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_guests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER set_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW
  EXECUTE FUNCTION update_guests_updated_at();

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Guests are viewable by event owners"
  ON public.guests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guests.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Guests are insertable by event owners"
  ON public.guests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guests.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Guests are updatable by event owners"
  ON public.guests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guests.event_id
      AND events.organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guests.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Guests are deletable by event owners"
  ON public.guests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guests.event_id
      AND events.organizer_id = auth.uid()
    )
  ); 