'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, DatabaseIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

/**
 * Simple component to fix events-profiles relationship
 */
export function EventsProfilesFixer() {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; error?: string } | null>(null);
  
  const handleFix = async () => {
    setIsFixing(true);
    setResult(null);
    
    try {
      const result = await directFixEventsProfilesRelationship();
      setResult(result);
    } catch (err) {
      setResult({
        success: false,
        message: 'Failed to fix relationship',
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      });
    } finally {
      setIsFixing(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <DatabaseIcon className="h-5 w-5 mr-2" />
          Fix Database Relationship
        </CardTitle>
        <CardDescription>
          Repair the connection between events and profiles tables
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {result && (
          <Alert 
            variant={result.success ? "default" : "destructive"}
            className={result.success ? "bg-emerald-50 text-emerald-800 border-emerald-100" : undefined}
          >
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.message}
                {result.error && (
                  <div className="text-sm font-mono mt-2 bg-gray-100 p-2 rounded">
                    {result.error}
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}
        
        <p className="text-sm mt-4 mb-2">
          This will fix the "Could not find a relationship between 'events' and 'profiles'" error
          by repairing the database connection.
        </p>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleFix}
          disabled={isFixing}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isFixing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fixing Relationship...
            </>
          ) : (
            'Fix Events-Profiles Relationship'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Direct fix for events-profiles relationship
 */
async function directFixEventsProfilesRelationship() {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return { 
      success: false, 
      message: 'Unable to connect to the database. Please try again later.' 
    };
  }

  try {
    // Simple test to see if relationship works
    const { data: testData, error: testError } = await supabase
      .from('events')
      .select('id, organizer:profiles(id, full_name)')
      .limit(1);
    
    // If working, no need to fix
    if (!testError) {
      return { 
        success: true, 
        message: 'Relationship is already working correctly.' 
      };
    }
    
    console.log('Relationship test failed:', testError);
    
    // Step 1: Make sure profiles exist for all users by directly adding them
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      throw new Error('Failed to get user: ' + userError.message);
    }
    
    if (!userData.user) {
      throw new Error('No authenticated user found');
    }
    
    // Check if user has a profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userData.user.id)
      .single();
    
    // Create profile if needed
    if (!existingProfile) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          email: userData.user.email,
          full_name: userData.user.user_metadata?.full_name || userData.user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.warn('Failed to create profile:', insertError);
      } else {
        console.log('Created profile for current user');
      }
    }
    
    // Step 2: Try to use the built-in function to fix relationship
    try {
      const { data, error } = await supabase.rpc('fix_events_profiles_relationship');
      
      if (error) {
        console.error('RPC fix failed:', error);
        // RPC failed, continue with manual fix below
      } else if (data && data.success) {
        // RPC succeeded
        return {
          success: true,
          message: 'Fixed events-profiles relationship successfully using RPC function',
          details: data.details || 'The fix was applied successfully.'
        };
      }
    } catch (rpcError) {
      console.error('RPC error:', rpcError);
      // Continue with manual fix
    }
    
    // Step 3: Manual fix as fallback - set up public read policy for profiles 
    try {
      // Create a direct SQL query to fix the most common issue
      const { error: policyError } = await supabase.rpc('create_fix_policies', {});
      
      if (policyError) {
        console.warn('Failed to create policy:', policyError);
        // Continue anyway
      }
    } catch (policyError) {
      console.warn('Policy error:', policyError);
      // Continue anyway
    }
    
    // Step 4: Final test to see if fixes worked
    const { error: finalTestError } = await supabase
      .from('events')
      .select('id, organizer:profiles(id, full_name)')
      .limit(1);
    
    if (!finalTestError) {
      return { 
        success: true, 
        message: 'Successfully fixed events-profiles relationship!' 
      };
    }
    
    // If we get here, our fixes didn't work
    return {
      success: false,
      message: 'Could not fix the relationship automatically',
      error: finalTestError.message,
      details: 'Please try the SQL fix script directly.'
    };
  } catch (err) {
    console.error('Error fixing events-profiles relationship:', err);
    return { 
      success: false, 
      message: 'An error occurred while fixing the relationship', 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
} 