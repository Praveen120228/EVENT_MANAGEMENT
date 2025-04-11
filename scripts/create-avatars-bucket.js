import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Get directory path for current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') })

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Supabase URL or key not found in environment variables')
  process.exit(1)
}

// Create Supabase client with service role key if available (for admin operations)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAvatarsBucket() {
  console.log('Creating avatars bucket...')
  
  try {
    // Try to get the bucket to check if it exists
    const { data: existingBuckets, error: getBucketsError } = await supabase.storage.listBuckets()
    
    if (getBucketsError) {
      throw getBucketsError
    }
    
    // Check if avatars bucket already exists
    const avatarsBucketExists = existingBuckets.some(bucket => bucket.name === 'avatars')
    
    if (avatarsBucketExists) {
      console.log('Avatars bucket already exists.')
    } else {
      // Create the bucket if it doesn't exist
      const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
        public: true, // Make the bucket public
        fileSizeLimit: 5242880, // 5MB size limit
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      })
      
      if (createBucketError) {
        throw createBucketError
      }
      
      console.log('Avatars bucket created successfully.')
    }
    
    console.log('Bucket setup complete!')
  } catch (error) {
    console.error('Error creating avatars bucket:', error.message)
  }
}

// Run the function
createAvatarsBucket() 