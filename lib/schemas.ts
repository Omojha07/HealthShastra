import { z } from 'zod';

export const patientSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().min(10, 'Valid phone number required'),
  address: z.string().min(5, 'Address is required'),
  blood_type: z.string().min(1, 'Blood type is required'),
  allergies: z.string(),
  medical_conditions: z.string(),
  emergency_contact_name: z.string().min(2, 'Emergency contact name required'),
  emergency_contact_phone: z.string().min(10, 'Valid emergency contact phone required'),
});

export const appointmentSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  appointment_date: z.string().min(1, 'Date is required'),
  appointment_time: z.string().min(1, 'Time is required'),
  reason_for_visit: z.string().min(5, 'Reason for visit is required'),
  notes: z.string(),
});

export const prescriptionSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  doctor_id: z.string().min(1, 'Doctor is required'),
  medication_name: z.string().min(2, 'Medication name required'),
  dosage: z.string().min(1, 'Dosage required'),
  frequency: z.string().min(1, 'Frequency required'),
  duration_days: z.coerce.number().min(1, 'Duration must be at least 1 day'),
  notes: z.string(),
});

export const billingSchema = z.object({
  patient_id: z.string().min(1, 'Patient is required'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  service_description: z.string().min(5, 'Service description required'),
  invoice_date: z.string().min(1, 'Invoice date required'),
  due_date: z.string().min(1, 'Due date required'),
  status: z.enum(['pending', 'paid', 'overdue']),
});

export const inventorySchema = z.object({
  item_name: z.string().min(2, 'Item name required'),
  item_type: z.enum(['medical_supply', 'equipment']),
  quantity: z.coerce.number().min(0, 'Quantity must be non-negative'),
  unit: z.string().min(1, 'Unit required'),
  reorder_level: z.coerce.number().min(0, 'Reorder level must be non-negative'),
  supplier_name: z.string().min(2, 'Supplier name required'),
  cost_per_unit: z.coerce.number().min(0.01, 'Cost must be greater than 0'),
});

export const doctorSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization required'),
  phone: z.string().min(10, 'Valid phone number required'),
  office_hours: z.string().min(5, 'Office hours required'),
  license_number: z.string().min(5, 'License number required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

export type PatientFormData = z.infer<typeof patientSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
export type BillingFormData = z.infer<typeof billingSchema>;
export type InventoryFormData = z.infer<typeof inventorySchema>;
export type DoctorFormData = z.infer<typeof doctorSchema>;
