# Profile Settings & Avatar Upload Integration

This document explains how the user settings page and avatar upload functionality work in the Specyf Platform.

## Overview

We've enhanced the settings page with several key features:

1. **Profile Management**: Users can update their personal information
2. **Avatar Upload**: Users can upload and manage profile photos
3. **Password Management**: Secure password changing with validation
4. **Notification Preferences**: Control over email and notification settings

## Technical Implementation

### Avatar Upload Flow

1. When a user selects an image file using the file input:
   - The `handleAvatarChange` function validates the file (size & file type)
   - A preview is generated using FileReader for immediate visual feedback
   - The avatar file is stored in component state until the user saves changes

2. When the user clicks "Save Changes":
   - The `handleProfileUpdate` function calls the API to ensure the 'avatars' bucket exists with proper policies
   - The file is uploaded to the 'avatars' bucket in a folder named with the user's ID
   - The public URL is obtained and saved to the user's profile record
   - The UI is updated to show the new avatar

### Database Structure

- **Profiles Table**: Contains user information including the `avatar_url` field
- **Storage Bucket**: A public 'avatars' bucket stores the image files with appropriate security policies

### Bucket Creation Options

There are four ways to ensure the 'avatars' bucket exists:

1. **API Route**: We now use a secure API route that creates the bucket and sets proper RLS policies
2. **Admin Panel**: Use the admin storage page at `/admin/storage` to create the bucket with a single click
3. **Manual Creation**: Create the bucket through the Supabase dashboard (Storage > New Bucket > "avatars")
4. **Migration**: Run the provided migration (`20240423_create_storage_buckets.sql`) during project setup

## Setup Requirements

For the avatar upload functionality to work properly:

1. **Supabase Project Configuration**:
   - Make sure the `.env.local` file contains valid Supabase URL and anon key
   - For RLS policies to work, add the SUPABASE_SERVICE_ROLE_KEY to `.env.local`

2. **Admin Storage Management**:
   - Visit `/admin/storage` in your browser
   - Click "Refresh Buckets" to check if the avatars bucket exists
   - If it doesn't exist, click "Create Avatars Bucket" to create it
   - This now uses the server API route to create the bucket with proper permissions

3. **Manual Bucket Creation**:
   - In your Supabase project dashboard, go to Storage > New Bucket
   - Create a bucket named 'avatars'
   - Set it to public
   - Enable Row-Level Security (RLS)
   - Add the appropriate RLS policies manually in the SQL editor:

```sql
-- Allow anyone to view avatars (public bucket)
CREATE POLICY "Public can view avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

-- Allow authenticated users to update their avatar
CREATE POLICY "Users can update their own avatars" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars');

-- Allow authenticated users to delete their avatar
CREATE POLICY "Users can delete their own avatars" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'avatars');
```

## Troubleshooting

If avatar uploads are not working:

1. **"Bucket not found" error**:
   - Visit the admin page at `/admin/storage` and create the avatars bucket
   - This error should be automatically resolved now that we're using the API route

2. **"StorageApiError: new row violates row-level security policy" error**:
   - This means the bucket exists but the RLS policies are not configured correctly
   - Ensure your `.env.local` file has the SUPABASE_SERVICE_ROLE_KEY set correctly
   - Visit the `/admin/storage` page and click "Create Avatars Bucket" to update policies
   - Or manually update the policies in your Supabase SQL editor using the SQL above

3. **Permission errors**:
   - Ensure the SUPABASE_SERVICE_ROLE_KEY is correctly set in your `.env.local` file
   - The API route uses this key to set up the proper RLS policies

4. **Other issues**:
   - Check browser console for detailed error messages
   - Verify file size (under 5MB) and file type (JPEG, PNG, GIF, WEBP)
   - Ensure user is authenticated before attempting to upload

## Future Improvements

Potential enhancements for the avatar upload feature:

- Image cropping and resizing before upload
- Multiple resolution versions of avatars for different display contexts
- Automatic cleanup of old avatar files when a user uploads a new one 