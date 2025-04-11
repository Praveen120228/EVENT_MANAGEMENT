'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';
import { Loader2, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { fixEventsProfilesRelationship } from '@/lib/db-fixes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvitationPageProps {
  params: {
    code: string;
  };
}

export default function InvitationPage({ params }: InvitationPageProps) {
  const { code } = params;
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [error, setError] = useState<string | null>(null);
  const [isRelationshipError, setIsRelationshipError] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [fixResult, setFixResult] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
      if (loading) {
        setError("Loading took too long. Please try again or contact support.");
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [loading]);

  const attemptFix = async () => {
    setFixing(true);
    try {
      const result = await fixEventsProfilesRelationship();
      setFixResult(result);
      
      if (result.success) {
        // Try loading the event again after successful fix
        joinEvent();
      }
    } catch (err) {
      console.error('Error fixing relationship:', err);
      setFixResult({
        success: false, 
        message: 'Error attempting to fix the database. Please contact support.'
      });
    } finally {
      setFixing(false);
    }
  };

  const joinEvent = async () => {
    try {
      setLoading(true);
      
      // First try searching by invitation_code - only get id field to avoid relationship issues
      let { data, error } = await supabase
        .from('events')
        .select('id')
        .eq('invitation_code', code)
        .single();

      // If that fails, try searching by event id directly
      if (error || !data) {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id')
          .eq('id', code)
          .single();
        
        if (eventError || !eventData) {
          console.error('Invalid invitation code or event ID');
          setError('Invalid invitation link. Please check with the event organizer.');
          setLoading(false);
          return;
        }
        
        data = eventData;
      }

      // Redirect to the event page
      router.push(`/events/${data.id}`);
    } catch (err: any) {
      console.error('Error joining event:', err);
      
      // Check if this is a relationship error
      if (err.message && err.message.includes('relationship between') && 
          err.message.includes('events') && err.message.includes('profiles')) {
        setIsRelationshipError(true);
        setError('Database relationship error. This can be fixed automatically.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      joinEvent().catch(err => {
        console.error('Unhandled error in joinEvent:', err);
        setError('An unexpected error occurred. Please try again later.');
        setLoading(false);
      });
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError('Failed to process invitation. Please try again later.');
      setLoading(false);
    }
  }, [code]);

  if (isRelationshipError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-6 max-w-md">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <h1 className="mb-4 text-xl font-bold text-amber-700">Database Configuration Issue</h1>
          <p className="mb-6 text-amber-600">There's a database relationship error that's preventing this invitation link from working properly.</p>
          
          {fixResult ? (
            <div className={`p-4 rounded-lg mb-4 ${fixResult.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              <div className="flex items-center mb-2">
                {fixResult.success ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2" />
                )}
                <span className="font-semibold">{fixResult.success ? 'Fix Applied' : 'Fix Failed'}</span>
              </div>
              <p>{fixResult.message}</p>
            </div>
          ) : null}
          
          <div className="flex justify-center">
            <Button 
              onClick={attemptFix} 
              disabled={!!fixing || !!(fixResult && fixResult.success)}
              className={`${fixing ? 'bg-amber-400' : 'bg-amber-500 hover:bg-amber-600'} text-white`}
            >
              {fixing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fixing Database...
                </>
              ) : fixResult && fixResult.success ? (
                'Fixed Successfully'
              ) : (
                'Fix Database Issue'
              )}
            </Button>
          </div>
          
          {fixResult && fixResult.success && (
            <p className="mt-4 text-emerald-600">
              Please <Button variant="link" onClick={joinEvent} className="p-0 h-auto text-emerald-600 font-semibold underline">click here</Button> to try joining the event again.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <div className="rounded-lg border border-red-100 bg-red-50 p-6 max-w-md">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="mb-4 text-xl font-bold text-red-700">Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      <p className="mt-4 text-lg">Joining event...</p>
      {loadingTimeout && (
        <Alert className="mt-6 max-w-md">
          <AlertDescription>
            This is taking longer than expected. If you continue to see this message, please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 