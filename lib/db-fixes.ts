'use client';

import { getSupabaseClient } from './supabase';

/**
 * Fix the relationship between events and profiles tables
 * This function attempts to repair the database schema issues by:
 * 1. Ensuring the profiles table exists and has the right columns
 * 2. Adding needed RLS policies
 * 3. Adding appropriate indexes
 */
export async function fixEventsProfilesRelationship() {
  const supabase = getSupabaseClient();
  
  try {
    if (!supabase) {
      return { 
        success: false, 
        message: 'Unable to connect to the database. Please try again later.' 
      };
    }
    
    // First check if we can execute the built-in query directly
    try {
      const { data: checkData, error: checkError } = await supabase
        .from('events')
        .select(`
          *,
          organizer:profiles(full_name, avatar_url)
        `)
        .limit(1);
      
      // If there's no error, we don't need to fix anything
      if (!checkError) {
        console.log('Events-profiles relationship is working correctly');
        return { success: true, message: 'Relationship already working' };
      }
      
      console.error('Error with events-profiles relationship:', checkError);
    } catch (checkErr) {
      console.error('Error checking relationship:', checkErr);
      // Continue with the fix anyway
    }
    
    // Check if the current user has admin permissions
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return { 
        success: false, 
        message: 'Could not verify your permissions. Please try again later.',
        error: sessionError.message 
      };
    }
    
    // Check if user has access to the service_role functions
    // The fix function requires elevated permissions
    let serviceRoleAccess = false;
    try {
      // Try a simple RPC call that would only work with admin permissions
      const { data: adminCheck, error: adminError } = await supabase.rpc('check_admin_access', {});
      serviceRoleAccess = !adminError;
    } catch (e) {
      // Function probably doesn't exist, assume no admin access
      serviceRoleAccess = false;
    }
    
    // Attempt to create a diagnostic record of the current state
    const diagnostics = await runDatabaseDiagnostics();
    
    // Call our RPC function to fix the relationship
    const { data, error } = await supabase.rpc('fix_events_profiles_relationship');
    
    if (error) {
      console.error('Error fixing events-profiles relationship:', error);
      let errorDetails = '';
      
      // Provide more context on the error based on diagnostics
      if (diagnostics && !diagnostics.success && 'errors' in diagnostics && Array.isArray(diagnostics.errors)) {
        errorDetails = `Diagnostic results show: ${diagnostics.errors.join(', ')}`;
      }
      
      // Special message for permission issues
      if (error.message.includes('permission denied') || error.code === '42501') {
        return { 
          success: false, 
          message: 'Permission denied. This fix requires admin privileges.',
          error: error.message,
          details: 'Please contact your Supabase administrator to run this fix or upgrade to use the service_role key.',
          diagnostics 
        };
      }
      
      return { 
        success: false, 
        message: 'Could not fix the relationship. Please contact support.',
        error: error.message,
        details: errorDetails || 'The database function failed to run successfully.',
        diagnostics
      };
    }
    
    // If data is empty or null, something went wrong but didn't trigger an error
    if (!data) {
      return {
        success: false,
        message: 'The fix function returned no result.',
        details: 'This usually indicates a permission issue or a problem with the function implementation.',
        diagnostics
      };
    }
    
    // Return the result from the database function
    return {
      success: data.success,
      message: data.message,
      details: data.details,
      error: data.error,
      diagnostics
    };
  } catch (err) {
    console.error('Unexpected error fixing relationship:', err);
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again later.',
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

/**
 * Fix the sub_events table by adding the missing date column
 * This function addresses the error: "column sub_events.date does not exist"
 */
export async function fixSubEventsTable() {
  const supabase = getSupabaseClient();
  
  try {
    if (!supabase) {
      return { 
        success: false, 
        message: 'Unable to connect to the database. Please try again later.' 
      };
    }
    
    // Call our RPC function to fix the sub_events table
    const { data, error } = await supabase.rpc('fix_sub_events_table');
    
    if (error) {
      console.error('Error fixing sub_events table:', error);
      return { 
        success: false, 
        message: 'Could not fix the sub_events table. Please contact support.',
        error: error.message 
      };
    }
    
    return {
      success: data.success,
      message: data.message
    };
  } catch (err) {
    console.error('Unexpected error fixing sub_events table:', err);
    return { 
      success: false, 
      message: 'An unexpected error occurred. Please try again later.',
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

/**
 * Run database diagnostics to identify common issues
 * This function checks for various potential problems in the database structure
 */
export async function runDatabaseDiagnostics() {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return { 
      success: false, 
      message: 'Unable to connect to the database. Please try again later.' 
    };
  }
  
  try {
    const results: {
      success: boolean;
      message: string;
      profiles: TableCheckResult;
      events: TableCheckResult;
      guests: TableCheckResult;
      sub_events: TableCheckResult;
      policies: PolicyCheckResult;
      joins: JoinCheckResult;
      errors: string[];
    } = {
      success: true,
      message: 'Diagnostics completed',
      profiles: await checkTableExists(supabase, 'profiles'),
      events: await checkTableExists(supabase, 'events'),
      guests: await checkTableExists(supabase, 'guests'),
      sub_events: await checkTableExists(supabase, 'sub_events'),
      policies: await checkPolicies(supabase),
      joins: await checkJoins(supabase),
      errors: []
    };
    
    // Add any errors found to the errors array
    if (!results.profiles.exists) {
      results.errors.push('Profiles table does not exist');
    }
    
    if (!results.events.exists) {
      results.errors.push('Events table does not exist');
    }
    
    if (!results.joins.eventsToProfiles) {
      results.errors.push('Events to profiles relationship is broken');
    }
    
    // Mark as failed if any errors found
    if (results.errors.length > 0) {
      results.success = false;
      results.message = `Found ${results.errors.length} issue(s) with the database`;
    }
    
    return results;
  } catch (err) {
    console.error('Error running diagnostics:', err);
    return { 
      success: false, 
      message: 'Error running diagnostics',
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

interface TableCheckResult {
  exists: boolean;
  error: string | null;
  count: number | null;
}

interface PolicyCheckResult {
  publicProfilesReadable: boolean;
  errors: {
    publicProfiles?: string | null;
    general?: string | null;
  };
}

interface JoinCheckResult {
  eventsToProfiles: boolean;
  eventsToGuests: boolean;
  eventsToSubEvents: boolean;
  errors: Record<string, string>;
}

/**
 * Check if a table exists in the database
 */
async function checkTableExists(supabase: any, tableName: string) {
  try {
    // Try to select a single row to see if table exists
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    return {
      exists: !error,
      error: error ? error.message : null,
      count: count ?? null
    };
  } catch (err) {
    return {
      exists: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      count: null
    };
  }
}

/**
 * Check if required policies exist
 */
async function checkPolicies(supabase: any) {
  try {
    // We can check if policies exist by trying specific queries that should be allowed
    // This is an indirect way since we can't query the policies directly via client API
    
    // Check if public profiles read policy exists
    const { data: publicProfileData, error: publicProfileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    return {
      publicProfilesReadable: !publicProfileError,
      errors: {
        publicProfiles: publicProfileError ? publicProfileError.message : null
      }
    };
  } catch (err) {
    return {
      publicProfilesReadable: false,
      errors: {
        general: err instanceof Error ? err.message : 'Unknown error'
      }
    };
  }
}

/**
 * Check if joins between tables work correctly
 */
async function checkJoins(supabase: any): Promise<JoinCheckResult> {
  const results: JoinCheckResult = {
    eventsToProfiles: false,
    eventsToGuests: false,
    eventsToSubEvents: false,
    errors: {
      eventsToProfiles: '',
      eventsToGuests: '',
      eventsToSubEvents: ''
    }
  };
  
  try {
    // Check events to profiles join
    const { data: eventsToProfilesData, error: eventsToProfilesError } = await supabase
      .from('events')
      .select(`
        id,
        organizer:profiles(id)
      `)
      .limit(1);
    
    results.eventsToProfiles = !eventsToProfilesError;
    if (eventsToProfilesError) {
      results.errors.eventsToProfiles = eventsToProfilesError.message;
    } else {
      results.errors.eventsToProfiles = '';
    }
  } catch (err) {
    results.errors.eventsToProfiles = err instanceof Error ? err.message : 'Unknown error';
  }
  
  try {
    // Check events to guests join
    const { data: eventsToGuestsData, error: eventsToGuestsError } = await supabase
      .from('events')
      .select(`
        id,
        guests(id)
      `)
      .limit(1);
    
    results.eventsToGuests = !eventsToGuestsError;
    if (eventsToGuestsError) {
      results.errors.eventsToGuests = eventsToGuestsError.message;
    } else {
      results.errors.eventsToGuests = '';
    }
  } catch (err) {
    results.errors.eventsToGuests = err instanceof Error ? err.message : 'Unknown error';
  }
  
  try {
    // Check events to sub_events join
    const { data: eventsToSubEventsData, error: eventsToSubEventsError } = await supabase
      .from('events')
      .select(`
        id,
        sub_events(id)
      `)
      .limit(1);
    
    results.eventsToSubEvents = !eventsToSubEventsError;
    if (eventsToSubEventsError) {
      results.errors.eventsToSubEvents = eventsToSubEventsError.message;
    } else {
      results.errors.eventsToSubEvents = '';
    }
  } catch (err) {
    results.errors.eventsToSubEvents = err instanceof Error ? err.message : 'Unknown error';
  }
  
  return results;
}

/**
 * Fix the relationship between events and profiles tables using the server-side API
 * This uses a server route with the service role key to bypass permission issues
 */
export async function fixEventsProfilesRelationshipWithServiceRole(adminToken?: string) {
  try {
    // Get admin token from localStorage if not provided
    const token = adminToken || localStorage.getItem('admin_token') || '';
    
    // Call the server API route
    const response = await fetch('/api/database/fix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fixType: 'events-profiles',
        adminToken: token
      })
    });
    
    if (!response.ok) {
      // Handle error response
      const errorData = await response.json();
      
      if (response.status === 401) {
        return {
          success: false,
          message: 'Admin authentication required',
          error: 'Please provide a valid admin token',
          needsAuth: true
        };
      }
      
      return {
        success: false,
        message: errorData.message || 'Failed to fix relationship (server error)',
        error: errorData.error,
        details: errorData.details
      };
    }
    
    // Parse response data
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message,
      details: data.details,
      error: data.error
    };
  } catch (err) {
    console.error('Error calling server fix API:', err);
    return {
      success: false,
      message: 'Failed to connect to the server',
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}

/**
 * Fix issues with the sub_events table using the server-side API
 * This uses a server route with the service role key to bypass permission issues
 */
export async function fixSubEventsTableWithServiceRole(adminToken?: string) {
  try {
    // Get admin token from localStorage if not provided
    const token = adminToken || localStorage.getItem('admin_token') || '';
    
    // Call the server API route
    const response = await fetch('/api/database/fix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fixType: 'sub-events',
        adminToken: token
      })
    });
    
    if (!response.ok) {
      // Handle error response
      const errorData = await response.json();
      
      if (response.status === 401) {
        return {
          success: false,
          message: 'Admin authentication required',
          error: 'Please provide a valid admin token',
          needsAuth: true
        };
      }
      
      return {
        success: false,
        message: errorData.message || 'Failed to fix sub-events table (server error)',
        error: errorData.error,
        details: errorData.details
      };
    }
    
    // Parse response data
    const data = await response.json();
    
    return {
      success: data.success,
      message: data.message,
      details: data.details,
      error: data.error
    };
  } catch (err) {
    console.error('Error calling server fix API:', err);
    return {
      success: false,
      message: 'Failed to connect to the server',
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
} 