export type UserRole = 'admin' | 'concierge' | 'resident';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string; // Edificio/Condominio ID
  apartment?: string; // Solo para residentes
  rut?: string;
  phone?: string;
  trial_started_at?: string;
}

export interface Tenant {
  id: string;
  name: string;
  address: string;
  rut_edificio?: string;
  proration_percentage?: number;
  admin_pin?: string;
  trial_started_at?: string;
  subscription_status?: 'trial' | 'active' | 'past_due';
  mercado_pago_id?: string;
  last_payment_date?: string;
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
  status: 'active' | 'used' | 'expired' | 'Pendiente' | 'Ingresado' | 'Cancelado' | 'Expirado';
  tenantId: string;
  userId: string;
  qrPayload?: string;
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

export interface CommonArea {
  id: string;
  name: string;
  icon: string;
  capacity: number;
  price?: number;
  description: string;
}

export interface Reservation {
  id: string;
  areaId: string;
  areaName: string;
  userId: string;
  userName: string;
  apartment: string;
  date: string;
  startTime: string;
  endTime: string;
  guestsCount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
