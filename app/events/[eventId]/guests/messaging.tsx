'use client';

import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  id: string;
  event_id: string;
  sender_id: string;
  sender_type: 'organizer' | 'guest';
  content: string;
  created_at: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface MessagingProps {
  eventId: string;
  organizer_id: string;
  guests: Guest[];
}

export default function GuestMessaging({ eventId, organizer_id, guests }: MessagingProps) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages when a guest is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedGuest) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if the messages table exists
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('event_id', eventId)
            .or(`sender_id.eq.${selectedGuest},sender_id.eq.${organizer_id}`)
            .order('created_at', { ascending: true });
          
          if (error) throw error;
          
          setMessages(data || []);
        } catch (err: any) {
          if (err.code === 'PGRST116' || err.message.includes('relation "messages" does not exist')) {
            // Messages table doesn't exist yet
            console.log('Messages table not found');
            setMessages([]);
          } else {
            throw err;
          }
        }
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        setError(err.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for messages
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `event_id=eq.${eventId}`
      }, (payload) => {
        const newMsg = payload.new as Message;
        // Only add message if it's from/to the selected guest
        if (newMsg.sender_id === selectedGuest || 
            (newMsg.sender_id === organizer_id && newMsg.sender_type === 'organizer')) {
          setMessages(prev => [...prev, newMsg]);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [eventId, selectedGuest, organizer_id, supabase]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedGuest) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if messages table exists
      try {
        const { error } = await supabase.from('messages').insert({
          event_id: eventId,
          sender_id: organizer_id,
          sender_type: 'organizer',
          content: newMessage.trim()
        });
        
        if (error) throw error;
        
        // Clear input field
        setNewMessage('');
      } catch (err: any) {
        if (err.code === 'PGRST116' || err.message.includes('relation "messages" does not exist')) {
          toast({
            title: 'Feature not available',
            description: 'Messaging feature is not set up yet. Please run the database migrations first.',
            variant: 'destructive'
          });
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  
  const sendAnnouncement = async () => {
    if (!announcement.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Create a batch of messages, one for each guest
      try {
        const messages = guests.map(guest => ({
          event_id: eventId,
          sender_id: organizer_id,
          sender_type: 'organizer',
          content: announcement.trim()
        }));
        
        const { error } = await supabase.from('messages').insert(messages);
        
        if (error) throw error;
        
        toast({
          title: 'Announcement sent',
          description: `Your announcement has been sent to ${guests.length} guests.`,
          variant: 'default'
        });
        
        // Clear input field
        setAnnouncement('');
      } catch (err: any) {
        if (err.code === 'PGRST116' || err.message.includes('relation "messages" does not exist')) {
          toast({
            title: 'Feature not available',
            description: 'Announcements feature is not set up yet. Please run the database migrations first.',
            variant: 'destructive'
          });
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      console.error('Error sending announcement:', err);
      setError(err.message || 'Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };
  
  const getGuestStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800">Declined</Badge>;
      case 'invited':
        return <Badge className="bg-blue-100 text-blue-800">Invited</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Guest Communication
        </CardTitle>
        <CardDescription>
          Send messages to individual guests or announcements to all guests
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="individual" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individual Messages</TabsTrigger>
            <TabsTrigger value="announcement">Announcements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Guest List */}
              <div className="border rounded-md overflow-hidden">
                <div className="p-3 bg-muted font-medium">Select Guest</div>
                <div className="h-[400px] overflow-y-auto">
                  {guests.length > 0 ? (
                    <div className="divide-y">
                      {guests.map(guest => (
                        <div 
                          key={guest.id}
                          className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedGuest === guest.id ? 'bg-muted/50' : ''
                          }`}
                          onClick={() => setSelectedGuest(guest.id)}
                        >
                          <div className="font-medium">{guest.name}</div>
                          <div className="text-sm text-muted-foreground">{guest.email}</div>
                          <div className="mt-1">{getGuestStatusBadge(guest.status)}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No guests yet
                    </div>
                  )}
                </div>
              </div>
              
              {/* Message Thread */}
              <div className="md:col-span-2 border rounded-md overflow-hidden">
                {selectedGuest ? (
                  <>
                    <div className="p-3 bg-muted font-medium border-b">
                      {guests.find(g => g.id === selectedGuest)?.name || 'Guest'}
                    </div>
                    
                    <div className="h-[350px] overflow-y-auto p-3 space-y-3">
                      {messages.length > 0 ? (
                        messages.map(message => (
                          <div 
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.sender_type === 'organizer' 
                                ? 'bg-blue-50 ml-auto max-w-[80%] text-right' 
                                : 'bg-gray-50 mr-auto max-w-[80%]'
                            }`}
                          >
                            <div className="text-sm text-muted-foreground mb-1">
                              {message.sender_type === 'organizer' ? 'You' : 'Guest'} • {
                                new Date(message.created_at).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              }
                            </div>
                            <p>{message.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 text-muted-foreground">
                          No messages yet
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 min-h-[60px]"
                          disabled={loading}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={loading || !newMessage.trim()}
                          className="self-end"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    Select a guest to start messaging
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="announcement" className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Send to all guests ({guests.length})</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This will send the same message to all guests for this event
              </p>
              
              <Textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Type your announcement..."
                className="min-h-[100px] mb-4"
                disabled={loading}
              />
              
              <Button 
                onClick={sendAnnouncement} 
                disabled={loading || !announcement.trim() || guests.length === 0}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Announcement to All Guests
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 