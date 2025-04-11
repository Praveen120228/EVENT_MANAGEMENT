import { v4 as uuidv4 } from 'uuid';
import { getSupabaseClient } from '@/lib/supabase';

interface EventData {
  title: string;
  description?: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  max_guests: number;
  organizer_id: string;
  is_public?: boolean;
  status?: string;
}

export async function createEvent(eventData: EventData) {
  const supabase = getSupabaseClient();
  const invitationCode = uuidv4(); // Generate a unique code
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...eventData, invitation_code: invitationCode }]);

  if (error) throw error;
  return data;
} 