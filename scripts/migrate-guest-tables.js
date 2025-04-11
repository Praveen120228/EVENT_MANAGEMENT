import fs from 'fs';
import path from 'path';

function generateInstructions() {
  try {
    console.log('\n======== MANUAL MIGRATION INSTRUCTIONS ========\n');
    
    // Read migration SQL
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20240715_create_guests_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('The migration function is not available. Please follow these steps:');
    console.log('1. Log in to your Supabase dashboard at https://app.supabase.io');
    console.log('2. Go to your project');
    console.log('3. Navigate to the SQL Editor tab');
    console.log('4. Create a new query');
    console.log('5. Copy and paste the following SQL:');
    console.log('\n--------------------------------------------\n');
    console.log(migrationSQL);
    console.log('\n--------------------------------------------\n');
    console.log('6. Run the query');
    console.log('7. Refresh your application');
    console.log('\nThis will recreate the guests table that was previously dropped.\n');
  } catch (error) {
    console.error('Error generating instructions:', error);
  }
}

generateInstructions(); 