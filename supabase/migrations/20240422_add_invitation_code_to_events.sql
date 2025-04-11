'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export default function InvitationPage({ params }) {
  const { code } = params;
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    const joinEvent = async () => {
      const { data: event, error } = await supabase
        .from('events')
        .select('id')
        .eq('invitation_code', code)
        .single();

      if (error || !event) {
        console.error('Invalid invitation code');
        return;
      }

      // Add guest to the event
      const { error: guestError } = await supabase
        .from('guests')
        .insert([{ event_id: event.id, guest_id: 'guest-unique-id' }]); // Replace with actual guest ID logic

      if (guestError) {
        console.error('Error adding guest:', guestError.message);
        return;
      }

      // Redirect to the event page
      router.push(`/events/${event.id}`);
    };

    joinEvent();
  }, [code, router, supabase]);

  return <div>Joining event...</div>;
}