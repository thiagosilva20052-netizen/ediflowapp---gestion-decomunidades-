export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      common_areas: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          id: string
          name: string
          price: number | null
          tenant_id: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: number | null
          tenant_id: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          tenant_id?: string
        }
      }
      logbook: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          entry_time: string
          id: string
          tenant_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          entry_time?: string
          id?: string
          tenant_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          entry_time?: string
          id?: string
          tenant_id?: string
          title?: string
        }
      }
      payments: {
        Row: {
          amount: number
          billing_month: string | null
          created_at: string
          id: string
          method: string | null
          notes: string | null
          payment_date: string | null
          received_by: string | null
          status: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          amount: number
          billing_month?: string | null
          created_at?: string
          id?: string
          method?: string | null
          notes?: string | null
          payment_date?: string | null
          received_by?: string | null
          status?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_month?: string | null
          created_at?: string
          id?: string
          method?: string | null
          notes?: string | null
          payment_date?: string | null
          received_by?: string | null
          status?: string | null
          tenant_id?: string
          user_id?: string
        }
      }
      reservations: {
        Row: {
          area_id: string
          created_at: string
          end_time: string
          guests_count: number | null
          id: string
          reservation_date: string
          start_time: string
          status: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          area_id: string
          created_at?: string
          end_time: string
          guests_count?: number | null
          id?: string
          reservation_date: string
          start_time: string
          status?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          area_id?: string
          created_at?: string
          end_time?: string
          guests_count?: number | null
          id?: string
          reservation_date?: string
          start_time?: string
          status?: string | null
          tenant_id?: string
          user_id?: string
        }
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          end_date: string | null
          external_reference: string | null
          id: string
          payment_id: string | null
          plan_name: string
          start_date: string | null
          status: string | null
          tenant_id: string
          units_count: number
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          end_date?: string | null
          external_reference?: string | null
          id?: string
          payment_id?: string | null
          plan_name: string
          start_date?: string | null
          status?: string | null
          tenant_id: string
          units_count?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          end_date?: string | null
          external_reference?: string | null
          id?: string
          payment_id?: string | null
          plan_name?: string
          start_date?: string | null
          status?: string | null
          tenant_id?: string
          units_count?: number
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          address: string | null
          admin_pin: string | null
          created_at: string
          id: string
          name: string
          proration_percentage: number | null
          rut_edificio: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_pin?: string | null
          created_at?: string
          id?: string
          name: string
          proration_percentage?: number | null
          rut_edificio?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_pin?: string | null
          created_at?: string
          id?: string
          name?: string
          proration_percentage?: number | null
          rut_edificio?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          apartment: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string
          rut: string | null
          tenant_id: string | null
        }
        Insert: {
          apartment?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role: string
          rut?: string | null
          tenant_id?: string | null
        }
        Update: {
          apartment?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string
          rut?: string | null
          tenant_id?: string | null
        }
      }
      visitor_passes: {
        Row: {
          created_at: string
          id: string
          name: string
          pass_type: string
          scheduled_date: string
          status: string | null
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          pass_type: string
          scheduled_date: string
          status?: string | null
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          pass_type?: string
          scheduled_date?: string
          status?: string | null
          tenant_id?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
