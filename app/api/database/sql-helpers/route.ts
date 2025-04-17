import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get the function to create
    const { function_name } = await request.json()
    
    if (!function_name) {
      return NextResponse.json(
        { error: 'Function name is required' },
        { status: 400 }
      )
    }
    
    let result
    
    // Handle different function creation
    switch (function_name) {
      case 'execute_sql':
        result = await createExecuteSqlFunction(supabase)
        break
      default:
        return NextResponse.json(
          { error: `Unknown function: ${function_name}` },
          { status: 400 }
        )
    }
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error creating SQL helper function:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

async function createExecuteSqlFunction(supabase: any) {
  // Try to create the function directly
  const { error } = await supabase.rpc('execute_raw_sql', {
    sql: `
      -- Create a function that can execute arbitrary SQL
      CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT)
      RETURNS VOID AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      -- Grant permissions
      GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;
      GRANT EXECUTE ON FUNCTION public.execute_sql TO service_role;
    `
  })
  
  if (error) {
    // Try alternate approach that might be more likely to work
    const sqlFunction = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_proc 
          WHERE proname = 'execute_sql' AND pronamespace::regnamespace::text = 'public'
        ) THEN
          CREATE FUNCTION public.execute_sql(sql_query TEXT)
          RETURNS VOID AS $$
          BEGIN
            EXECUTE sql_query;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
          
          GRANT EXECUTE ON FUNCTION public.execute_sql TO authenticated;
          GRANT EXECUTE ON FUNCTION public.execute_sql TO service_role;
        END IF;
      END
      $$;
    `
    
    // Use a raw query as a last resort
    const { error: rawError } = await supabase.rpc('pg_query', { query: sqlFunction })
    
    if (rawError) {
      return { 
        success: false, 
        error: `Failed to create execute_sql function: ${rawError.message}` 
      }
    }
  }
  
  return { 
    success: true, 
    message: 'SQL helper function created successfully' 
  }
} 