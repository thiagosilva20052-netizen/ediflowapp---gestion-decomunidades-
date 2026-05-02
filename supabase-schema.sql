-- Supabase Schema for Seguify MVP (High-Performance Multi-Tenancy)

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Tablas Maestras (Aislamiento Lógico Estricto)
-- ==========================================

-- Tabla de Comunidades (Tenants)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE, -- Para URLs personalizadas (ej: torre-costanera-1)
    name VARCHAR(255) NOT NULL,
    address TEXT,
    rut_edificio VARCHAR(20),
    config JSONB DEFAULT '{}'::jsonb, -- Colores, logo, reglas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla de Identidad (Profiles - Extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) CHECK (role IN ('admin', 'concierge', 'resident')) NOT NULL,
    apartment VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb, -- Preferencias (modo oscuro, notificaciones)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Unidades físicas (Departamentos)
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    unit_number VARCHAR(50) NOT NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    proration_factor DECIMAL(5,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Transacciones Financieras y Operativas
-- ==========================================

-- Estructura de Gastos (Egresos)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    provider_name VARCHAR(255) NOT NULL,
    provider_rut VARCHAR(20),
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Aprobado',
    receipt_url TEXT, -- Factura/Boleta en Storage
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Integración Mercado Pago (Transacciones / Pagos)
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Resident
    received_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Admin/Concierge for manual payments
    amount DECIMAL(12,2) NOT NULL,
    billing_month VARCHAR(20),
    method VARCHAR(50) DEFAULT 'mercadopago',
    status VARCHAR(50) CHECK (status IN ('pending', 'success', 'failure')) DEFAULT 'pending',
    external_reference VARCHAR(100),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Áreas Comunes y Reservas
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    icon VARCHAR(50) DEFAULT 'event',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE NOT NULL,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    guests_count INT NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_reservation_slot UNIQUE (amenity_id, reservation_date, start_time)
);

-- Paquetería y Encomiendas (Parcels)
CREATE TABLE IF NOT EXISTS public.parcels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    department_number VARCHAR(50) NOT NULL,
    recipient_name VARCHAR(255),
    tracking_provider VARCHAR(100),
    status VARCHAR(50) CHECK (status IN ('received', 'notified', 'delivered')) DEFAULT 'received',
    photo_url TEXT,
    received_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Conserje que lo recibe
    delivered_at TIMESTAMP WITH TIME ZONE,
    delivered_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Residente que lo retira
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Visitas / Control de Accesos (QR)
CREATE TABLE IF NOT EXISTS public.visitor_passes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL, -- The resident creating the pass
    visitor_name VARCHAR(255) NOT NULL,
    pass_type VARCHAR(50) CHECK (pass_type IN ('visita', 'delivery', 'servicio')) NOT NULL,
    qr_code_data TEXT UNIQUE NOT NULL, -- UUID for the QR payload
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Expire time (e.g. 4 hours)
    status VARCHAR(50) CHECK (status IN ('active', 'used', 'expired', 'revoked')) DEFAULT 'active',
    scanned_at TIMESTAMP WITH TIME ZONE,
    scanned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- The concierge who scanned
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Muro de Comunidad (Anuncios)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('urgent', 'informative', 'event')) NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.announcement_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_announcement_user_read UNIQUE (announcement_id, user_id)
);

-- Bitácora Digital y Encomiendas
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) CHECK (type IN ('visita', 'encomienda', 'incidente', 'mantenimiento', 'turno')) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mantenimiento Preventivo (Hitos y Certificaciones)
CREATE TABLE IF NOT EXISTS public.maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    equipment_name VARCHAR(255) NOT NULL, -- e.g. Caldera, Ascensor B, Red Seca
    provider VARCHAR(255),
    scheduled_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'overdue')) DEFAULT 'pending',
    attachment_url TEXT, -- Factura o Informe PDF
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Multas y Morosidades
CREATE TABLE IF NOT EXISTS public.fines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    evidence_url TEXT,
    status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected', 'paid')) DEFAULT 'pending',
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. Seguridad de Grado Bancario (RLS)
-- ==========================================

-- Habilitar RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fines ENABLE ROW LEVEL SECURITY;

-- Announcements
CREATE POLICY "Users can read announcements in their tenant" ON public.announcements
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );
CREATE POLICY "Admins manage announcements" ON public.announcements
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Announcement Reads
CREATE POLICY "Users insert own reads" ON public.announcement_reads
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );
CREATE POLICY "Users view own reads" ON public.announcement_reads
    FOR SELECT USING (
        user_id = auth.uid() 
        OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Tenants: Solo visibles si perteneces a ellos o eres SuperAdmin
CREATE POLICY "Tenants visibility" ON public.tenants
    FOR SELECT USING (
        id IN (SELECT tenant_id FROM public.profiles WHERE auth.uid() = id)
    );

-- Profiles: Ves a la gente de tu edificio
CREATE POLICY "Profiles visibility" ON public.profiles
    FOR SELECT USING (
        tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Expenses: Administradores pueden insertar/actualizar, todos pueden ver
CREATE POLICY "Admin manage expenses" ON public.expenses
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Residents view expenses" ON public.expenses
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

-- Transactions: Residente ve las suyas (o de su unidad), Admin ve todas
CREATE POLICY "Security_Policy_Payments_Select" ON public.transactions
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (auth.uid() = user_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
    );

CREATE POLICY "Residents create transactions (Checkout)" ON public.transactions
    FOR INSERT WITH CHECK (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND auth.uid() = user_id
    );

-- Reservas
CREATE POLICY "Amenities read access" ON public.amenities
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

-- Encomiendas (Parcels)
CREATE POLICY "Concierges manage parcels" ON public.parcels
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'concierge')
    );

CREATE POLICY "Residents view their parcels (by tenant)" ON public.parcels
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Residents manage reservations" ON public.reservations
    FOR ALL USING (
        user_id = auth.uid()
    );

CREATE POLICY "All read reservations in tenant" ON public.reservations
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Admin manage amenities" ON public.amenities
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Visitor Passes (QR): Residentes manejan las suyas, Conserje revisa y marca como usadas.
CREATE POLICY "Residents manage their visitor passes" ON public.visitor_passes
    FOR ALL USING (
        user_id = auth.uid()
    );

CREATE POLICY "Concierges read and update passes" ON public.visitor_passes
    FOR SELECT USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'concierge')
    );

CREATE POLICY "Concierges update passes (Scan QR)" ON public.visitor_passes
    FOR UPDATE USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'concierge')
    );

-- Logs: Conserjes/Admin manejan, Residentes read-only encomiendas/visitas propias si aplica.
CREATE POLICY "Concierge manage logs" ON public.logs
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'concierge')
    );

-- Maintenance Logs: Solo Admin (y tal vez conserjes si se requiere) manejan
CREATE POLICY "Admin manage maintenance" ON public.maintenance_logs
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

-- Fines
CREATE POLICY "Admin manage fines" ON public.fines
    FOR ALL USING (
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Residents view own fines" ON public.fines
    FOR SELECT USING (
        user_id = auth.uid()
    );


-- ==========================================
-- 4. Triggers (Auth Sync)
-- ==========================================

-- Trigger to auto-create transaction when fine is approved
CREATE OR REPLACE FUNCTION public.handle_fine_approval()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    INSERT INTO public.transactions (tenant_id, unit_id, user_id, amount, billing_month, method, status)
    VALUES (NEW.tenant_id, NEW.unit_id, NEW.user_id, NEW.amount, 'Multa: ' || SUBSTRING(NEW.description, 1, 20), 'mercadopago', 'pending')
    RETURNING id INTO NEW.transaction_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_fine_approved
  BEFORE UPDATE ON public.fines
  FOR EACH ROW EXECUTE FUNCTION public.handle_fine_approval();

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, tenant_id)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'resident'),
    (new.raw_user_meta_data->>'tenant_id')::uuid
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
