-- Drop guest-related tables and their dependencies
DO $$ 
BEGIN
    -- Drop foreign key constraints first
    ALTER TABLE IF EXISTS public.poll_responses DROP CONSTRAINT IF EXISTS poll_responses_guest_id_fkey;
    ALTER TABLE IF EXISTS public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
    ALTER TABLE IF EXISTS public.sub_events DROP CONSTRAINT IF EXISTS sub_events_guest_id_fkey;

    -- Drop guest-related tables
    DROP TABLE IF EXISTS public.guests_backup;
    DROP TABLE IF EXISTS public.guests;
    DROP TABLE IF EXISTS public.guest_messages;
    DROP TABLE IF EXISTS public.guest_polls;
    DROP TABLE IF EXISTS public.guest_poll_responses;

    -- Drop guest-related functions
    DROP FUNCTION IF EXISTS public.get_guest_by_id_email(text, text);
    DROP FUNCTION IF EXISTS public.clean_guest_id(text);

    -- Drop guest-related policies
    DROP POLICY IF EXISTS guests_select_policy ON public.guests;
    DROP POLICY IF EXISTS guests_insert_policy ON public.guests;
    DROP POLICY IF EXISTS guests_update_policy ON public.guests;
    DROP POLICY IF EXISTS guests_delete_policy ON public.guests;

    -- Drop guest-related indexes
    DROP INDEX IF EXISTS public.guests_event_id_idx;
    DROP INDEX IF EXISTS public.guests_email_idx;
    DROP INDEX IF EXISTS public.guest_messages_guest_id_idx;
    DROP INDEX IF EXISTS public.guest_polls_event_id_idx;
    DROP INDEX IF EXISTS public.guest_poll_responses_guest_id_idx;
    DROP INDEX IF EXISTS public.guest_poll_responses_poll_id_idx;

    -- Drop guest-related triggers
    DROP TRIGGER IF EXISTS set_guests_updated_at ON public.guests;
    DROP TRIGGER IF EXISTS set_guest_messages_updated_at ON public.guest_messages;
    DROP TRIGGER IF EXISTS set_guest_polls_updated_at ON public.guest_polls;
    DROP TRIGGER IF EXISTS set_guest_poll_responses_updated_at ON public.guest_poll_responses;

    RAISE NOTICE 'All guest-related tables and dependencies have been removed.';
END $$; 