'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Patient } from '@/types/database';
import { patientSchema, PatientFormData } from '@/lib/schemas';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id as string;
  const isNew = patientId === 'new';

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    if (!isNew && patientId) {
      fetchPatient();
    }
  }, [patientId, isNew]);

  const fetchPatient = async () => {
    try {
      const response = await fetch(`/api/patients/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setPatient(data);
        reset(data);
      }
    } catch (err) {
      setError('Failed to load patient');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: PatientFormData) => {
    setIsSaving(true);
    setError('');

    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/patients' : `/api/patients/${patientId}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          user_id: patient?.user_id || `user-${Date.now()}`,
        }),
      });

      if (response.ok) {
        router.push('/patients');
      } else {
        setError('Failed to save patient');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isNew ? 'New Patient' : 'Edit Patient'}</h1>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input {...register('full_name')} placeholder="John Doe" />
                {errors.full_name && <p className="text-red-600 text-sm">{errors.full_name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth *</label>
                <Input type="date" {...register('date_of_birth')} />
                {errors.date_of_birth && <p className="text-red-600 text-sm">{errors.date_of_birth.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender *</label>
                <select {...register('gender')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-600 text-sm">{errors.gender.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Blood Type *</label>
                <select {...register('blood_type')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Blood Type</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {errors.blood_type && <p className="text-red-600 text-sm">{errors.blood_type.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone *</label>
                <Input type="tel" {...register('phone')} placeholder="+1-555-0101" />
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Address *</label>
                <Input {...register('address')} placeholder="123 Main St, Springfield, IL" />
                {errors.address && <p className="text-red-600 text-sm">{errors.address.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Allergies</label>
                <Input {...register('allergies')} placeholder="e.g., Penicillin, Latex" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Medical Conditions</label>
                <Input {...register('medical_conditions')} placeholder="e.g., Hypertension, Diabetes" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Contact Name *</label>
                <Input {...register('emergency_contact_name')} placeholder="Jane Doe" />
                {errors.emergency_contact_name && <p className="text-red-600 text-sm">{errors.emergency_contact_name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Contact Phone *</label>
                <Input type="tel" {...register('emergency_contact_phone')} placeholder="+1-555-0102" />
                {errors.emergency_contact_phone && <p className="text-red-600 text-sm">{errors.emergency_contact_phone.message}</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isNew ? 'Create Patient' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/patients')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
