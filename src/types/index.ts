export type UserRole = 'admin' | 'concierge' | 'resident';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string; // Edificio/Condominio ID
  apartment?: string; // Solo para residentes
}

export interface Tenant {
  id: string;
  name: string;
  address: string;
  rut_edificio?: string;
  proration_percentage?: number;
  admin_pin?: string;
}

export interface LogEntry {
  id: string;
  icon: string;
  color: string;
  title: string;
  time: string;
  desc: string;
  tenantId: string;
}

export type PassType = 'visita' | 'delivery' | 'servicio';

export interface VisitorPass {
  id: string;
  name: string;
  type: PassType;
  date: string;
  status: 'active' | 'used' | 'expired';
  tenantId: string;
  userId: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'transfer' | 'cash' | 'check';
  status: 'pending' | 'processing' | 'success';
  tenantId: string;
  userId: string;
  month: string;
  receivedBy?: string; // Concierge ID or Name
  checkNumber?: string;
  notes?: string;
}
