-- Create avatars storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create avatar storage bucket policies
-- Allow authenticated users to view their own avatars
CREATE POLICY "Users can view their own avatars"
ON storage.objects
FOR SELECT
USING (
  auth.uid() = (storage.foldername(name))[1]::uuid
  AND bucket_id = 'avatars'
);

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
WITH CHECK (
  auth.uid() = (storage.foldername(name))[1]::uuid
  AND bucket_id = 'avatars'
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
USING (
  auth.uid() = (storage.foldername(name))[1]::uuid
  AND bucket_id = 'avatars'
)
WITH CHECK (
  auth.uid() = (storage.foldername(name))[1]::uuid
  AND bucket_id = 'avatars'
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  auth.uid() = (storage.foldername(name))[1]::uuid
  AND bucket_id = 'avatars'
);

-- Set up public access to avatars (can be viewed without authentication)
CREATE POLICY "Public can view avatars"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'avatars'
); 