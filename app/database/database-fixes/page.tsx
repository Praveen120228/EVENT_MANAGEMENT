'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Database, AlertTriangle } from 'lucide-react'

export default function DatabaseFixesPage() {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const createEventAnnouncementsTable = async () => {
    setLoading(true)
    setResults(null)
    
    try {
      // First check if the table already exists
      const { data, error: checkError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'event_announcements')
        .maybeSingle()
      
      if (checkError) {
        throw new Error(`Error checking for table: ${checkError.message}`)
      }
      
      if (data) {
        setResults({
          success: true,
          message: 'Table already exists',
          details: 'The event_announcements table is already present in your database.'
        })
        return
      }
      
      // Call our API endpoint to create the table
      const response = await fetch('/api/database/create-tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table: 'event_announcements' }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Unknown error')
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create table')
      }
      
      setResults({
        success: true,
        message: 'Table created successfully!',
        details: 'The event_announcements table has been created in your database. You can now use the communications feature.'
      })
      
    } catch (err) {
      console.error('Error creating table:', err)
      setResults({
        success: false,
        message: 'Failed to create table',
        details: err instanceof Error ? err.message : String(err)
      })
    } finally {
      setLoading(false)
    }
  }
  
  const createExecuteSqlFunction = async () => {
    setLoading(true)
    setResults(null)
    
    try {
      // Create the execute_sql function directly
      const { error } = await supabase.rpc('create_execute_sql_function', {})
      
      if (error) {
        // Try alternate approach
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
            RETURNS VOID AS $$
            BEGIN
              EXECUTE sql_query;
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
            
            GRANT EXECUTE ON FUNCTION execute_sql TO authenticated;
            GRANT EXECUTE ON FUNCTION execute_sql TO service_role;
          `
        })
        
        if (sqlError) {
          throw new Error(`Failed to create function: ${sqlError.message}`)
        }
      }
      
      setResults({
        success: true,
        message: 'SQL function created',
        details: 'The execute_sql function has been created in your database. You can now use it to create tables.'
      })
      
    } catch (err) {
      console.error('Error creating function:', err)
      setResults({
        success: false,
        message: 'Failed to create SQL function',
        details: err instanceof Error ? err.message : String(err)
      })
    } finally {
      setLoading(false)
    }
  }

  const createTableSimpleApproach = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      // Call our simple API endpoint that uses a direct approach
      const response = await fetch('/api/database/simple-create-table');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create table');
      }
      
      setResults({
        success: true,
        message: 'Table created successfully!',
        details: 'The event_announcements table has been created. Please refresh your browser to see the changes and use the communications feature.'
      });
    } catch (err) {
      console.error('Error creating table:', err);
      setResults({
        success: false,
        message: 'Failed to create table',
        details: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setLoading(false);
    }
  };

  const seedSampleAnnouncements = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      // Call our seed API endpoint
      const response = await fetch('/api/database/seed-announcements');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to add sample announcements');
      }
      
      setResults({
        success: true,
        message: 'Sample announcements added!',
        details: result.message + '. Refresh your browser to see the announcements in the communications dashboard.'
      });
    } catch (err) {
      console.error('Error seeding announcements:', err);
      setResults({
        success: false,
        message: 'Failed to add sample announcements',
        details: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Database Fixes</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Fix Communications Dashboard
            </CardTitle>
            <CardDescription>
              Creates the missing event_announcements table directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              This will create the event_announcements table directly using a single operation. This is the simplest fix for the 404 errors in the communications dashboard.
            </p>
            <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Recommended Option</AlertTitle>
              <AlertDescription>
                Use this option to quickly fix the communications dashboard errors.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button 
              variant="default" 
              onClick={createTableSimpleApproach}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Creating...' : 'Create Table'}
            </Button>
            
            <Button
              variant="outline"
              onClick={seedSampleAnnouncements}
              disabled={loading}
            >
              Add Sample Announcements
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Create Execute SQL Function
            </CardTitle>
            <CardDescription>
              Creates the execute_sql function needed for table creation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              This action will create a utility function in your Supabase database that allows executing SQL statements. This is needed before creating tables.
            </p>
            <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This requires database admin privileges. Only do this if you're the database owner.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline"
              onClick={createExecuteSqlFunction}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create SQL Function'}
            </Button>
          </CardFooter>
        </Card>
        
        {results && (
          <>
            <Separator className="my-4" />
            <Alert className={results.success ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}>
              {results.success ? 
                <CheckCircle className="h-4 w-4" /> : 
                <XCircle className="h-4 w-4" />
              }
              <AlertTitle>{results.message}</AlertTitle>
              <AlertDescription>
                {results.details}
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </div>
  )
}