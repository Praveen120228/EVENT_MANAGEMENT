-- Create a new table for guest templates
CREATE TABLE IF NOT EXISTS guest_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  guests JSONB NOT NULL,
  organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups by organizer
CREATE INDEX IF NOT EXISTS guest_templates_organizer_id_idx ON guest_templates(organizer_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_guest_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_guest_templates_updated_at
  BEFORE UPDATE ON guest_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_guest_templates_updated_at();

-- Enable Row Level Security
ALTER TABLE guest_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own guest templates"
  ON guest_templates FOR SELECT
  USING (auth.uid() = organizer_id);

CREATE POLICY "Users can insert their own guest templates"
  ON guest_templates FOR INSERT
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own guest templates"
  ON guest_templates FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their own guest templates"
  ON guest_templates FOR DELETE
  USING (auth.uid() = organizer_id); 