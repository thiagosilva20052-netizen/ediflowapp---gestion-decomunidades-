-- Final Production Migration for EdiFlow
-- Includes push_subscriptions, onboarding_drafts, and additional constraints

-- 1. Push Subscriptions Table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    subscription JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster notification lookups
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_unit ON public.push_subscriptions(unit_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_tenant ON public.push_subscriptions(tenant_id);

-- 2. Onboarding Drafts Table
CREATE TABLE IF NOT EXISTS public.onboarding_drafts (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    step INTEGER DEFAULT 1,
    building_name TEXT,
    building_rut TEXT,
    building_address TEXT,
    bank_name TEXT,
    account_number TEXT,
    account_type TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS Policies
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_drafts ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'push_subs_owner_all') THEN
        CREATE POLICY "push_subs_owner_all" ON public.push_subscriptions
            FOR ALL USING (user_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'onboarding_drafts_owner_all') THEN
        CREATE POLICY "onboarding_drafts_owner_all" ON public.onboarding_drafts
            FOR ALL USING (user_id = auth.uid());
    END IF;
END $$;

-- 4. Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_drafts TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
GRANT ALL ON public.onboarding_drafts TO service_role;
