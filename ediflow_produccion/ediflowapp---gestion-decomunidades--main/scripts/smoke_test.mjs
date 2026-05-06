import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseUrl = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/,'') : null;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE URL or SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

async function waitForProfile(id, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (data) return data;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Profile did not appear in time');
}

async function run() {
  try {
    console.log('Supabase URL:', supabaseUrl);

    // 1) Create tenant (building)
    const tenantPayload = {
      name: 'TEST - Torre Prueba Smoke',
      slug: `test-torre-${Date.now()}`,
      address: 'Santiago, Chile',
      rut_edificio: '76.123.456-7',
      config: {}
    };

    const { data: tenantData, error: tenantErr } = await supabase.from('tenants').insert(tenantPayload).select().maybeSingle();
    if (tenantErr) throw tenantErr;
    console.log('Tenant created:', tenantData.id);

    // 2) Create admin user via Admin API
    const adminEmail = `smoke.admin+${Date.now()}@example.com`;
    const adminPassword = 'Sup3rSm0keP@ss!';

    const { data: createUserData, error: createUserErr } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Smoke Test Admin',
        role: 'admin',
        tenant_id: tenantData.id
      }
    });

    if (createUserErr) throw createUserErr;
    const adminId = createUserData.user?.id;
    console.log('Admin created (auth user id):', adminId);

    // 3) Wait for profile to be created by trigger
    const profile = await waitForProfile(adminId, 15000);
    console.log('Profile row confirmed:', profile.id);

    // 4) Create a unit owned by admin
    const unitPayload = {
      tenant_id: tenantData.id,
      unit_number: '101',
      owner_id: profile.id,
      proration_factor: 1.0,
      contact_email: adminEmail
    };
    const { data: unitData, error: unitErr } = await supabase.from('units').insert(unitPayload).select().maybeSingle();
    if (unitErr) throw unitErr;
    console.log('Unit created:', unitData.id);

    // 5) Insert a sample approved expense for this tenant
    const expensePayload = {
      tenant_id: tenantData.id,
      provider_name: 'Proveedor Test S.A.',
      amount: 100000,
      expense_date: new Date().toISOString().slice(0,10),
      category: 'Servicios',
      status: 'Aprobado'
    };
    const { data: expenseData, error: expenseErr } = await supabase.from('expenses').insert(expensePayload).select().maybeSingle();
    if (expenseErr) throw expenseErr;
    console.log('Expense created:', expenseData.id);

    // 6) Compute prorrateo quickly (single unit scenario)
    const sumExpenses = Number(expenseData.amount || 0);
    const reserve = sumExpenses * 0.05;
    const totalToProrate = sumExpenses + reserve;

    // sumAliquots = 1.0 in this test
    const base = totalToProrate; // since factor =1 and sum=1
    const totalAmount = Math.round((base + 0) * 100) / 100;

    const commonPayload = {
      tenant_id: tenantData.id,
      unit_id: unitData.id,
      period: new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date()),
      total_amount: totalAmount
    };

    const { data: commonData, error: commonErr } = await supabase.from('common_expenses').insert(commonPayload).select().maybeSingle();
    if (commonErr) throw commonErr;
    console.log('common_expenses inserted:', commonData.id, 'amount:', commonData.total_amount);

    // 7) Verify rows exist by querying
    const { data: tenantsCheck } = await supabase.from('tenants').select('*').eq('id', tenantData.id).maybeSingle();
    const { data: profilesCheck } = await supabase.from('profiles').select('*').eq('id', profile.id).maybeSingle();
    const { data: commonCheck } = await supabase.from('common_expenses').select('*').eq('id', commonData.id).maybeSingle();

    console.log('Verification results: tenant=', !!tenantsCheck, 'profile=', !!profilesCheck, 'common_expenses=', !!commonCheck);

    console.log('Smoke test completed successfully. Do not forget to review the records in Supabase Dashboard.');

    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    process.exit(2);
  }
}

run();
