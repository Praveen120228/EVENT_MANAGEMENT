'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail, Building, Calendar, MessageSquare, Info } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { DemoRequest } from '@/lib/admin-utils';
import { format } from 'date-fns';

export default function DemoRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [demoRequest, setDemoRequest] = useState<DemoRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDemoRequest();
  }, [requestId]);

  async function fetchDemoRequest() {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = getSupabaseClient();
      
      // Fetch the demo request
      const { data, error } = await supabase
        .from('demo_requests')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Demo request not found');
      }
      
      setDemoRequest(data as DemoRequest);
      
      // Fetch notes if they exist
      const { data: notesData } = await supabase
        .from('demo_request_notes')
        .select('notes')
        .eq('request_id', requestId)
        .single();
      
      if (notesData) {
        setNotes(notesData.notes);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch demo request');
    } finally {
      setLoading(false);
    }
  }

  async function saveNotes() {
    setSaveLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const supabase = getSupabaseClient();
      
      // Check if notes entry exists
      const { data: existingNotes } = await supabase
        .from('demo_request_notes')
        .select('id')
        .eq('request_id', requestId)
        .single();
      
      if (existingNotes) {
        // Update existing notes
        const { error } = await supabase
          .from('demo_request_notes')
          .update({ 
            notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingNotes.id);
        
        if (error) throw error;
      } else {
        // Create new notes entry
        const { error } = await supabase
          .from('demo_request_notes')
          .insert({ 
            request_id: requestId,
            notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      setSuccess('Notes saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to save notes');
    } finally {
      setSaveLoading(false);
    }
  }

  // Helper function to render status badge
  function renderStatusBadge(status: DemoRequest['status']) {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      contacted: { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted' },
      scheduled: { color: 'bg-purple-100 text-purple-800', label: 'Scheduled' },
      completed: { color: 'bg-emerald-100 text-emerald-800', label: 'Completed' },
      declined: { color: 'bg-gray-100 text-gray-800', label: 'Declined' }
    };
    
    const config = statusConfig[status];
    
    return (
      <Badge className={`${config.color} font-medium`}>
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/admin/demo-requests')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Requests
        </Button>
        <h1 className="text-2xl font-bold">Demo Request Details</h1>
      </div>

      {error && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-100">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-emerald-50 text-emerald-800 border-emerald-100">
          <Info className="h-4 w-4 mr-2" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        </div>
      ) : demoRequest ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{demoRequest.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {demoRequest.email}
                    </CardDescription>
                  </div>
                  {renderStatusBadge(demoRequest.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoRequest.company && (
                  <div className="flex items-start">
                    <Building className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-500">Company</div>
                      <div>{demoRequest.company}</div>
                    </div>
                  </div>
                )}

                {demoRequest.event_type && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-500">Event Type</div>
                      <div>{demoRequest.event_type}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-500">Message</div>
                    <div className="mt-1 whitespace-pre-wrap">
                      {demoRequest.message || 'No message provided'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="text-sm text-gray-500">
                    Submitted on {format(new Date(demoRequest.created_at), 'MMMM d, yyyy')} at {format(new Date(demoRequest.created_at), 'h:mm a')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
                <CardDescription>
                  Add private notes about this request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes here..."
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={saveNotes}
                  disabled={saveLoading}
                  className="mt-4 w-full"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Notes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          Demo request not found
        </div>
      )}
    </div>
  );
} 