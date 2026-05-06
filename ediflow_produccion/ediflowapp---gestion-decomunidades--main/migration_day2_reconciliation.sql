-- ============================================
-- DÍA 2: Migración de Conciliación Bancaria
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Tabla de movimientos bancarios (cartola importada)
CREATE TABLE IF NOT EXISTS public.bank_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    reference TEXT,
    amount DECIMAL(12,2) NOT NULL,
    movement_date DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'ignored')),
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    confidence VARCHAR(20) CHECK (confidence IN ('high', 'medium', 'low')),
    matching_reason TEXT,
    transaction_hash TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de gastos comunes (resultados del prorrateo por unidad/mes)
CREATE TABLE IF NOT EXISTS public.common_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    period TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, unit_id, period)
);

-- 3. RPC de conciliación (adaptada de V3: building_id -> tenant_id)
CREATE OR REPLACE FUNCTION public.run_reconciliation_matching(
  p_tenant_id UUID,
  p_period TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_high INT := 0;
  v_medium INT := 0;
  v_low INT := 0;
  v_movement RECORD;
  v_unit_id UUID;
  v_confidence TEXT;
  v_matching_reason TEXT;
  v_unit_name TEXT;
  v_expected_amount NUMERIC;
  v_ambiguous_units INT;
BEGIN
  FOR v_movement IN
    SELECT id, reference, amount
    FROM bank_movements
    WHERE tenant_id = p_tenant_id AND status = 'pending'
  LOOP
    v_unit_id := NULL;
    v_confidence := 'low';
    v_matching_reason := NULL;
    v_unit_name := NULL;
    v_expected_amount := NULL;
    v_ambiguous_units := 0;

    -- 1. Buscar unidad por reference exacta
    SELECT id, unit_number INTO v_unit_id, v_unit_name
    FROM units
    WHERE tenant_id = p_tenant_id AND unit_number = v_movement.reference
    LIMIT 1;

    IF v_unit_id IS NOT NULL THEN
      v_confidence := 'high';
      v_matching_reason := 'Coincidencia exacta: referencia "' || v_movement.reference || '" = unidad "' || v_unit_name || '"';

      IF p_period IS NOT NULL THEN
        SELECT COALESCE(SUM(total_amount), 0) INTO v_expected_amount
        FROM common_expenses
        WHERE tenant_id = p_tenant_id
          AND unit_id = v_unit_id
          AND period = p_period;

        IF v_expected_amount > 0 THEN
          IF ABS(v_movement.amount - v_expected_amount) <= 1 THEN
            v_matching_reason := v_matching_reason || ' | Monto coincide (±$1)';
          ELSE
            v_matching_reason := v_matching_reason || ' | Monto difiere $' || ABS(v_movement.amount - v_expected_amount);
            v_confidence := 'medium';
          END IF;
        END IF;
      END IF;

      IF v_confidence = 'high' THEN
        v_high := v_high + 1;
      ELSE
        v_medium := v_medium + 1;
      END IF;

    ELSE
      -- 2. Media confianza: búsqueda parcial
      SELECT id, unit_number INTO v_unit_id, v_unit_name
      FROM units
      WHERE tenant_id = p_tenant_id AND v_movement.reference LIKE '%' || unit_number || '%'
      LIMIT 1;

      IF v_unit_id IS NOT NULL THEN
        v_confidence := 'medium';
        v_matching_reason := 'Coincidencia parcial: referencia "' || v_movement.reference || '" contiene unidad "' || v_unit_name || '"';

        IF p_period IS NOT NULL THEN
          SELECT COALESCE(SUM(total_amount), 0) INTO v_expected_amount
          FROM common_expenses
          WHERE tenant_id = p_tenant_id
            AND unit_id = v_unit_id
            AND period = p_period;

          IF v_expected_amount > 0 AND ABS(v_movement.amount - v_expected_amount) <= 1 THEN
            v_confidence := 'high';
            v_matching_reason := v_matching_reason || ' | Monto coincide (±$1) - Upgrade a alta confianza';
          END IF;
        END IF;

        IF v_confidence = 'high' THEN
          v_high := v_high + 1;
        ELSE
          v_medium := v_medium + 1;
        END IF;

      ELSE
        -- 3. Baja confianza: buscar por monto (detección de ambigüedad)
        IF p_period IS NOT NULL THEN
          SELECT COUNT(*) INTO v_ambiguous_units
          FROM common_expenses
          WHERE tenant_id = p_tenant_id
            AND period = p_period
            AND ABS(total_amount - v_movement.amount) <= 1;

          IF v_ambiguous_units > 1 THEN
            v_confidence := 'medium';
            v_matching_reason := 'Ambigüedad detectada: múltiples deudas con monto $' || v_movement.amount;
            v_medium := v_medium + 1;
          ELSEIF v_ambiguous_units = 1 THEN
            SELECT unit_id INTO v_unit_id
            FROM common_expenses
            WHERE tenant_id = p_tenant_id
              AND period = p_period
              AND ABS(total_amount - v_movement.amount) <= 1
            LIMIT 1;

            SELECT unit_number INTO v_unit_name FROM units WHERE id = v_unit_id;
            v_confidence := 'medium';
            v_matching_reason := 'Coincidencia por monto: unidad "' || v_unit_name || '" debe exactamente $' || v_movement.amount;
            v_medium := v_medium + 1;
          ELSE
            v_confidence := 'low';
            v_matching_reason := 'Sin coincidencia: no se encontró unidad para referencia "' || v_movement.reference || '" ni monto $' || v_movement.amount;
            v_low := v_low + 1;
          END IF;
        ELSE
          v_confidence := 'low';
          v_matching_reason := 'Sin coincidencia: no se encontró unidad para referencia "' || v_movement.reference || '"';
          v_low := v_low + 1;
        END IF;
      END IF;
    END IF;

    UPDATE bank_movements
    SET status = 'matched',
        unit_id = v_unit_id,
        confidence = v_confidence,
        matching_reason = v_matching_reason
    WHERE id = v_movement.id;
  END LOOP;

  RETURN json_build_object(
    'high_matches', v_high,
    'medium_matches', v_medium,
    'low_matches', v_low
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS básica para bank_movements
ALTER TABLE public.bank_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bank_movements_tenant_isolation" ON public.bank_movements
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- 5. RLS básica para common_expenses
ALTER TABLE public.common_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "common_expenses_tenant_isolation" ON public.common_expenses
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- 6. Columna transaction_hash para prevenir duplicados (de V3)
ALTER TABLE public.bank_movements
ADD COLUMN IF NOT EXISTS transaction_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_bank_movements_hash ON public.bank_movements(transaction_hash);

-- 7. Permisos para anon y authenticated
GRANT SELECT, INSERT, UPDATE ON public.bank_movements TO authenticated;
GRANT SELECT, INSERT ON public.bank_movements TO anon;
GRANT SELECT, INSERT ON public.common_expenses TO authenticated;
GRANT SELECT ON public.common_expenses TO anon;
