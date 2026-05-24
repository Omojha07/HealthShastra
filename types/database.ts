// Hospital Management System Database Types

export type UserType = 'patient' | 'staff' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  address: string;
  blood_type: string;
  allergies: string;
  medical_conditions: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  specialization: string;
  phone: string;
  office_hours: string;
  license_number: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  reason_for_visit: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration_days: number;
  issued_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface BillingRecord {
  id: string;
  patient_id: string;
  appointment_id?: string;
  amount: number;
  service_description: string;
  invoice_date: string;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

export interface InventoryItem {
  id: string;
  item_name: string;
  item_type: 'medical_supply' | 'equipment';
  quantity: number;
  unit: string;
  reorder_level: number;
  supplier_name: string;
  last_restock_date: string;
  cost_per_unit: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_patients: number;
  total_appointments: number;
  total_revenue: number;
  pending_bills: number;
  low_stock_items: number;
}
