-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('invitation', 'reminder', 'confirmation', 'custom')),
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS email_templates_organizer_id_idx ON email_templates(organizer_id);
CREATE INDEX IF NOT EXISTS email_templates_event_id_idx ON email_templates(event_id);
CREATE INDEX IF NOT EXISTS email_templates_type_idx ON email_templates(type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER set_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_templates_updated_at();

-- Enable Row Level Security
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Templates are viewable by event owners"
  ON email_templates FOR SELECT
  USING (
    auth.uid() = organizer_id OR
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = email_templates.event_id
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Templates are insertable by event owners"
  ON email_templates FOR INSERT
  WITH CHECK (
    auth.uid() = organizer_id
  );

CREATE POLICY "Templates are updatable by event owners"
  ON email_templates FOR UPDATE
  USING (
    auth.uid() = organizer_id
  )
  WITH CHECK (
    auth.uid() = organizer_id
  );

CREATE POLICY "Templates are deletable by event owners"
  ON email_templates FOR DELETE
  USING (
    auth.uid() = organizer_id
  ); 