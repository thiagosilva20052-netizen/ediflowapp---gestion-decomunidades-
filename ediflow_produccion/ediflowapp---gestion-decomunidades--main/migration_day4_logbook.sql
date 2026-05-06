-- ============================================
-- DÍA 4: Bitácora Legal Inmutable (Ley 21.442)
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Tabla de bitácora legal
CREATE TABLE IF NOT EXISTS public.logbook (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN ('seguridad', 'mantenimiento', 'paquetes', 'visitas', 'otro')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trigger de inmutabilidad (Art. 20 Ley 21.442)
CREATE OR REPLACE FUNCTION protect_logbook() RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Los registros de la bitácora legal son inmutables (Art. 20 Ley 21.442). No se pueden modificar ni eliminar.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_protect_logbook ON public.logbook;
CREATE TRIGGER tr_protect_logbook
BEFORE UPDATE OR DELETE ON public.logbook
FOR EACH ROW EXECUTE FUNCTION protect_logbook();

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_logbook_tenant ON public.logbook(tenant_id);
CREATE INDEX IF NOT EXISTS idx_logbook_created ON public.logbook(created_at DESC);

-- 4. RLS
ALTER TABLE public.logbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RLS_Logbook_Select" ON public.logbook FOR SELECT USING (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "RLS_Logbook_Insert" ON public.logbook FOR INSERT WITH CHECK (
    tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    AND actor_id = auth.uid()
);

-- 5. Permisos
GRANT SELECT, INSERT ON public.logbook TO authenticated;
GRANT SELECT ON public.logbook TO anon;
