'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fixEventsProfilesRelationship, fixSubEventsTable } from '@/lib/db-fixes';
import { Loader2, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DatabaseFixesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const handleFix = async (fixType: string, fixFunction: () => Promise<any>) => {
    setLoading(fixType);
    try {
      const result = await fixFunction();
      setResults(prev => ({
        ...prev,
        [fixType]: result
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [fixType]: {
          success: false,
          message: `Error: ${error.message || 'Unknown error occurred'}`
        }
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Database Fixes</h1>
      </div>

      <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-100">
        <AlertTriangle className="h-4 w-4 mr-2" />
        <AlertDescription>
          These tools are for administrators to fix database schema issues. Use them only when you encounter errors.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fix Events-Profiles Relationship</CardTitle>
            <CardDescription>
              Addresses the error: &quot;Could not find a relationship between &apos;events&apos; and &apos;profiles&apos;&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results['profiles'] && (
              <div className={`p-4 rounded-lg mb-4 ${results['profiles'].success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                <div className="flex items-center mb-2">
                  {results['profiles'].success ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mr-2" />
                  )}
                  <span className="font-semibold">{results['profiles'].success ? 'Success' : 'Failed'}</span>
                </div>
                <p>{results['profiles'].message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleFix('profiles', fixEventsProfilesRelationship)}
              disabled={loading === 'profiles'}
              className="w-full"
            >
              {loading === 'profiles' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fixing Relationship...
                </>
              ) : (
                'Fix Events-Profiles Relationship'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fix Sub-Events Table</CardTitle>
            <CardDescription>
              Addresses the error: &quot;column sub_events.date does not exist&quot;
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results['subevents'] && (
              <div className={`p-4 rounded-lg mb-4 ${results['subevents'].success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                <div className="flex items-center mb-2">
                  {results['subevents'].success ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mr-2" />
                  )}
                  <span className="font-semibold">{results['subevents'].success ? 'Success' : 'Failed'}</span>
                </div>
                <p>{results['subevents'].message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleFix('subevents', fixSubEventsTable)}
              disabled={loading === 'subevents'}
              className="w-full"
            >
              {loading === 'subevents' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fixing Sub-Events Table...
                </>
              ) : (
                'Fix Sub-Events Table'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 