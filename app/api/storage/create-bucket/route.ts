import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use server-side environment variables for service role
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper function to install RLS policies for avatars bucket
async function installAvatarsPolicies(supabase: any) {
  // Drop existing policies first to avoid conflicts
  const policies = [
    "Users can view their own avatars",
    "Users can upload their own avatars",
    "Users can update their own avatars",
    "Users can delete their own avatars",
    "Public can view avatars"
  ]

  // Try to drop existing policies first
  for (const policy of policies) {
    try {
      await supabase.rpc('exec_sql', {
        sql: `DROP POLICY IF EXISTS "${policy}" ON storage.objects`
      })
    } catch (err) {
      console.warn('Error dropping policy:', err)
      // Continue even if dropping fails
    }
  }

  // Now create the policies
  const createPolicies = [
    // Allow authenticated users to upload their own avatars
    `CREATE POLICY "Users can upload their own avatars" 
     ON storage.objects FOR INSERT 
     WITH CHECK (bucket_id = 'avatars')`,
    
    // Allow anyone to view avatars (public bucket)
    `CREATE POLICY "Public can view avatars" 
     ON storage.objects FOR SELECT 
     USING (bucket_id = 'avatars')`,
     
    // Allow users to update their own avatars
    `CREATE POLICY "Users can update their own avatars" 
     ON storage.objects FOR UPDATE 
     USING (bucket_id = 'avatars')`,
     
    // Allow users to delete their own avatars
    `CREATE POLICY "Users can delete their own avatars" 
     ON storage.objects FOR DELETE 
     USING (bucket_id = 'avatars')`
  ]

  // Apply all policies
  for (const policyQuery of createPolicies) {
    try {
      await supabase.rpc('exec_sql', { sql: policyQuery })
    } catch (err) {
      console.error('Failed to create policy:', err)
      // Continue with other policies
    }
  }
}

export async function GET(req: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase environment variables are not configured' },
      { status: 500 }
    )
  }

  try {
    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      return NextResponse.json(
        { error: `Failed to list buckets: ${listError.message}` },
        { status: 500 }
      )
    }
    
    const avatarsBucketExists = buckets.some(b => b.name === 'avatars')
    
    if (avatarsBucketExists) {
      // If bucket exists, just update policies
      await installAvatarsPolicies(supabase)
      return NextResponse.json({ 
        message: 'Avatars bucket already exists, policies updated',
        bucketExists: true 
      })
    }
    
    // Create the bucket
    const { error: createError } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024
    })
    
    if (createError) {
      return NextResponse.json(
        { error: `Failed to create avatars bucket: ${createError.message}` },
        { status: 500 }
      )
    }
    
    // Install RLS policies
    await installAvatarsPolicies(supabase)
    
    return NextResponse.json({ 
      message: 'Avatars bucket created successfully with policies',
      bucketExists: false
    })
    
  } catch (err: any) {
    console.error('Error creating bucket:', err)
    return NextResponse.json(
      { error: `Unexpected error: ${err.message}` },
      { status: 500 }
    )
  }
} 