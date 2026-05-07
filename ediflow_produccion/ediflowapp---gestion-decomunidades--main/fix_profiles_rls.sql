-- Fix for infinite recursion in profiles RLS policy
-- This policy uses current_setting('request.jwt.claims') to extract the role instead of querying the profiles table

DROP POLICY IF EXISTS "Admins/Concierges view all, Residents view only themselves" ON public.profiles;

CREATE POLICY "Admins/Concierges view all, Residents view only themselves" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        (current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role') IN ('admin', 'concierge')
    );