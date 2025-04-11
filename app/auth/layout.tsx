'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = getSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If user is an organizer, redirect to dashboard
        if (session.user.user_metadata.role === 'organizer') {
          router.push('/dashboard');
        }
        // If user is a guest, redirect to their event
        else if (session.user.user_metadata.role === 'guest') {
          const eventId = session.user.user_metadata.event_id;
          const guestId = session.user.user_metadata.guest_id;
          router.push(`/events/${eventId}?guest=${guestId}`);
        }
      }
    };

    checkSession();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Specyf</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
} 