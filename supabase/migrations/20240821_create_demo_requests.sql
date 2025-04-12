-- Create demo_requests table
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  event_type TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS demo_requests_email_idx ON demo_requests(email);
CREATE INDEX IF NOT EXISTS demo_requests_status_idx ON demo_requests(status);
CREATE INDEX IF NOT EXISTS demo_requests_created_at_idx ON demo_requests(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_demo_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER set_demo_requests_updated_at
  BEFORE UPDATE ON demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_demo_requests_updated_at();

-- Enable Row Level Security
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert demo requests (no auth needed)
CREATE POLICY "Anyone can insert demo requests"
  ON demo_requests FOR INSERT
  WITH CHECK (true);

-- Create policy to allow only admins to view and modify demo requests
CREATE POLICY "Only admins can select demo requests"
  ON demo_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@specyf.com', 
        'dev@specyf.com'
        -- Add other admin emails as needed
      )
    )
  );

CREATE POLICY "Only admins can update demo requests"
  ON demo_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@specyf.com', 
        'dev@specyf.com'
        -- Add other admin emails as needed
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@specyf.com', 
        'dev@specyf.com'
        -- Add other admin emails as needed
      )
    )
  );

CREATE POLICY "Only admins can delete demo requests"
  ON demo_requests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN (
        'admin@specyf.com', 
        'dev@specyf.com'
        -- Add other admin emails as needed
      )
    )
  ); 