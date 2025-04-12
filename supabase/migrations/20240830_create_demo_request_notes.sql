-- Create the demo_request_notes table
CREATE TABLE IF NOT EXISTS public.demo_request_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.demo_requests(id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS demo_request_notes_request_id_idx ON public.demo_request_notes (request_id);

-- Enable Row Level Security
ALTER TABLE public.demo_request_notes ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users (admin only)
CREATE POLICY "Admin users can select demo request notes" 
ON public.demo_request_notes
FOR SELECT 
TO authenticated
USING (
  -- Check if user is an admin, implement your admin check logic here
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

CREATE POLICY "Admin users can insert demo request notes" 
ON public.demo_request_notes
FOR INSERT 
TO authenticated
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

CREATE POLICY "Admin users can update demo request notes" 
ON public.demo_request_notes
FOR UPDATE 
TO authenticated
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

CREATE POLICY "Admin users can delete demo request notes" 
ON public.demo_request_notes
FOR DELETE 
TO authenticated
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