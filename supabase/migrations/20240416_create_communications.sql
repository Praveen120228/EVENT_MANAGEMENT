-- Create communications table
CREATE TABLE IF NOT EXISTS public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  sent_to INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for faster lookups by event
CREATE INDEX IF NOT EXISTS communications_event_id_idx ON public.communications (event_id);

-- Set up updated_at trigger
CREATE TRIGGER set_communications_updated_at
BEFORE UPDATE ON public.communications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Allow users to select communications for events they own
CREATE POLICY communications_select_policy ON public.communications
FOR SELECT USING (
  event_id IN (
    SELECT id FROM public.events WHERE organizer_id = auth.uid()
  )
);

-- Allow users to insert communications for events they own
CREATE POLICY communications_insert_policy ON public.communications
FOR INSERT WITH CHECK (
  event_id IN (
    SELECT id FROM public.events WHERE organizer_id = auth.uid()
  )
);

-- Allow users to update communications for events they own
CREATE POLICY communications_update_policy ON public.communications
FOR UPDATE USING (
  event_id IN (
    SELECT id FROM public.events WHERE organizer_id = auth.uid()
  )
);

-- Allow users to delete communications for events they own
CREATE POLICY communications_delete_policy ON public.communications
FOR DELETE USING (
  event_id IN (
    SELECT id FROM public.events WHERE organizer_id = auth.uid()
  )
); 