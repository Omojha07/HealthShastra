'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Patient, Doctor } from '@/types/database';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SelectOption {
  id: string;
  label: string;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<SelectOption[]>([]);
  const [doctors, setDoctors] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason_for_visit: '',
    notes: '',
  });

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch('/api/patients'),
          fetch('/api/doctors'),
        ]);

        if (!patientsRes.ok || !doctorsRes.ok) {
          throw new Error('Unable to load patient or doctor data');
        }

        const patientData: Patient[] = await patientsRes.json();
        const doctorData: Doctor[] = await doctorsRes.json();

        setPatients(patientData.map((patient) => ({ id: patient.id, label: patient.full_name })));
        setDoctors(doctorData.map((doctor) => ({ id: doctor.id, label: doctor.full_name })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load options');
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.patient_id || !form.doctor_id || !form.appointment_date || !form.appointment_time) {
      setError('Please select a patient, doctor, date, and time.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status: 'scheduled',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Failed to book appointment');
      }

      router.push('/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save appointment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book New Appointment</h1>
          <p className="text-gray-600 mt-2">Create a patient appointment with a doctor.</p>
        </div>
        <Link href="/appointments" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" />
          Back to appointments
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Patient</label>
                <select
                  value={form.patient_id}
                  onChange={(event) => handleChange('patient_id', event.target.value)}
                  className="border-input h-11 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50"
                  disabled={loading}
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>{patient.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  value={form.doctor_id}
                  onChange={(event) => handleChange('doctor_id', event.target.value)}
                  className="border-input h-11 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50"
                  disabled={loading}
                >
                  <option value="">Select doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>{doctor.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Date</label>
                <Input
                  type="date"
                  value={form.appointment_date}
                  onChange={(event) => handleChange('appointment_date', event.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Time</label>
                <Input
                  type="time"
                  value={form.appointment_time}
                  onChange={(event) => handleChange('appointment_time', event.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Reason for visit</label>
                <Input
                  type="text"
                  placeholder="Reason for appointment"
                  value={form.reason_for_visit}
                  onChange={(event) => handleChange('reason_for_visit', event.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                <Textarea
                  placeholder="Optional notes for the doctor"
                  value={form.notes}
                  onChange={(event) => handleChange('notes', event.target.value)}
                  rows={4}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving || loading}>
                {saving ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
