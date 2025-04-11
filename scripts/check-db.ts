import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    // Check if we can access the guests table
    const { data: guests, error } = await supabase
      .from('guests')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error accessing guests table:', error);
      return;
    }

    console.log('\nSuccessfully connected to guests table');
    
    if (guests && guests.length > 0) {
      console.log('\nGuests table structure (based on sample data):');
      const sampleGuest = guests[0];
      const structure = Object.entries(sampleGuest).map(([key, value]) => ({
        column: key,
        type: typeof value,
        example: value
      }));
      console.table(structure);
    } else {
      console.log('No guest records found. Creating a test guest...');
      
      // Try to create a test guest
      const testGuest = {
        id: 'TEST123',
        email: 'test@example.com',
        name: 'Test Guest',
        event_id: '00000000-0000-0000-0000-000000000000',
        status: 'pending'
      };

      const { data: newGuest, error: createError } = await supabase
        .from('guests')
        .insert([testGuest])
        .select();

      if (createError) {
        console.log('Error creating test guest. Here are the required fields:');
        console.log('- id (text)');
        console.log('- email (text)');
        console.log('- name (text)');
        console.log('- event_id (uuid)');
        console.log('- status (text: pending/invited/attended)');
        console.error('Create error:', createError);
      } else {
        console.log('Successfully created test guest:', newGuest);
      }
    }

  } catch (err) {
    console.error('Error checking database:', err);
  }
}

checkDatabase(); 