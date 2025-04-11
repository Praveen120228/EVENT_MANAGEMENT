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

async function analyzeDatabase() {
  try {
    // Get guests table structure
    const { data: guestsTable, error: guestsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'guests'
        ORDER BY ordinal_position;
      `
    });

    if (guestsError) {
      console.error('Error fetching guests table structure:', guestsError);
    } else {
      console.log('\nGuests Table Structure:');
      console.table(guestsTable);
    }

    // Get RLS policies
    const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          schemaname,
          tablename,
          policyname,
          permissive,
          roles,
          cmd,
          qual,
          with_check
        FROM pg_policies
        WHERE tablename = 'guests';
      `
    });

    if (policiesError) {
      console.error('Error fetching RLS policies:', policiesError);
    } else {
      console.log('\nRLS Policies:');
      console.table(policies);
    }

    // Get sample guest data
    const { data: sampleGuests, error: sampleError } = await supabase
      .from('guests')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.error('Error fetching sample guests:', sampleError);
    } else {
      console.log('\nSample Guest Data:');
      console.table(sampleGuests);
    }

  } catch (error) {
    console.error('Error analyzing database:', error);
  }
}

analyzeDatabase(); 