'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Trash2, BarChart4, AlertCircle, CheckCircle } from 'lucide-react';

interface Poll {
  id: string;
  event_id: string;
  question: string;
  options: string[];
  created_at: string;
}

interface PollResponse {
  poll_id: string;
  guest_id: string;
  selected_option: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  status: string;
}

export default function PollsPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const eventId = params.eventId as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([]);
  
  // New poll state
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['', '']);
  
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (!eventId) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch event to verify ownership (this would be handled by RLS normally)
        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('organizer_id')
          .eq('id', eventId)
          .single();
        
        if (eventError) throw eventError;
        
        // Fetch guests for this event
        const { data: guestData, error: guestError } = await supabase
          .from('guests')
          .select('id, name, email, status')
          .eq('event_id', eventId);
        
        if (guestError) throw guestError;
        
        setGuests(guestData || []);
        
        // Try to fetch polls if they exist
        try {
          const { data: pollData, error: pollError } = await supabase
            .from('polls')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false });
          
          if (!pollError) {
            setPolls(pollData || []);
            
            // If we have polls, try to fetch responses
            if (pollData && pollData.length > 0) {
              const pollIds = pollData.map(poll => poll.id);
              
              const { data: responseData, error: responseError } = await supabase
                .from('poll_responses')
                .select('poll_id, guest_id, selected_option')
                .in('poll_id', pollIds);
              
              if (!responseError) {
                setPollResponses(responseData || []);
              }
            }
          }
        } catch (err) {
          console.error('Error fetching polls:', err);
          // Don't throw - polls might not exist yet
        }
      } catch (err: any) {
        console.error('Error loading polls:', err);
        setError(err.message || 'Failed to load poll data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [eventId, supabase]);
  
  const addPollOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  };
  
  const removePollOption = (index: number) => {
    if (newPollOptions.length <= 2) return;
    const updatedOptions = [...newPollOptions];
    updatedOptions.splice(index, 1);
    setNewPollOptions(updatedOptions);
  };
  
  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...newPollOptions];
    updatedOptions[index] = value;
    setNewPollOptions(updatedOptions);
  };
  
  const createPoll = async () => {
    if (!newPollQuestion.trim()) return;
    
    // Filter out empty options
    const options = newPollOptions.filter(option => option.trim() !== '');
    if (options.length < 2) {
      setError('A poll must have at least 2 options');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if polls table exists
      try {
        const { data, error } = await supabase.from('polls').insert({
          event_id: eventId,
          question: newPollQuestion.trim(),
          options
        }).select();
        
        if (error) throw error;
        
        // Add the new poll to state
        if (data && data.length > 0) {
          setPolls(prev => [data[0] as Poll, ...prev]);
        }
        
        // Reset form
        setNewPollQuestion('');
        setNewPollOptions(['', '']);
        
        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err: any) {
        if (err.code === 'PGRST116' || err.message.includes('relation "polls" does not exist')) {
          setError('The polls feature is not set up yet. Please run the database migrations first.');
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error('Error creating poll:', err);
      setError(err.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };
  
  const deletePoll = async (pollId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);
      
      if (error) throw error;
      
      // Update state
      setPolls(prev => prev.filter(poll => poll.id !== pollId));
      setPollResponses(prev => prev.filter(response => response.poll_id !== pollId));
    } catch (err: any) {
      console.error('Error deleting poll:', err);
      setError(err.message || 'Failed to delete poll');
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate poll results
  const getPollResults = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return [];
    
    const responses = pollResponses.filter(r => r.poll_id === pollId);
    const totalResponses = responses.length;
    
    return poll.options.map(option => {
      const count = responses.filter(r => r.selected_option === option).length;
      const percentage = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
      
      return {
        option,
        count,
        percentage
      };
    });
  };
  
  return (
    <div className="container max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Polls & Feedback</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {showSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-100">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            Poll created successfully
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Poll</TabsTrigger>
          <TabsTrigger value="results" className="relative">
            Results
            {polls.length > 0 && (
              <span className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {polls.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Poll</CardTitle>
              <CardDescription>
                Create a poll to gather feedback from your guests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="Enter your question here..."
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Options</Label>
                {newPollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      disabled={loading}
                    />
                    {newPollOptions.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePollOption(index)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addPollOption}
                  disabled={loading}
                  className="mt-2"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={createPoll} 
                disabled={loading || !newPollQuestion.trim() || newPollOptions.filter(o => o.trim()).length < 2}
              >
                Create Poll
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {polls.length > 0 ? (
            <div className="space-y-6">
              {polls.map(poll => {
                const results = getPollResults(poll.id);
                const responseCount = pollResponses.filter(r => r.poll_id === poll.id).length;
                
                return (
                  <Card key={poll.id}>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <CardTitle>{poll.question}</CardTitle>
                        <CardDescription>
                          Created on {new Date(poll.created_at).toLocaleDateString()}
                          {' • '}
                          {responseCount} {responseCount === 1 ? 'response' : 'responses'} from {guests.length} guests
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePoll(poll.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.map((result, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{result.option}</span>
                              <span className="font-medium">{result.count} ({result.percentage}%)</span>
                            </div>
                            <Progress value={result.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Polls Yet</CardTitle>
                <CardDescription>
                  Create your first poll to start gathering feedback from your guests
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <BarChart4 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Polls will help you collect feedback from your guests
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 