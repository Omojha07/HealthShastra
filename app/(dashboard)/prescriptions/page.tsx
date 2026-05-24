'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Prescription } from '@/types/database';
import { Plus, Pill, Trash2, Calendar } from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/prescriptions');
      if (response.ok) {
        const data = await response.json();
        setPrescriptions(data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this prescription?')) return;

    try {
      const response = await fetch(`/api/prescriptions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPrescriptions(prescriptions.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-2">Manage patient medications and prescriptions</p>
        </div>
        <Link href="/prescriptions/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </Link>
      </div>

      {/* Prescriptions */}
      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Loading...
          </CardContent>
        </Card>
      ) : prescriptions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No prescriptions found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Left - Medication */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Pill className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{prescription.medication_name}</h3>
                      <p className="text-sm text-gray-600">{prescription.dosage}</p>
                    </div>
                  </div>

                  {/* Middle - Details */}
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-600">Frequency:</span> <span className="font-medium">{prescription.frequency}</span></p>
                    <p><span className="text-gray-600">Duration:</span> <span className="font-medium">{prescription.duration_days} days</span></p>
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <Calendar className="h-3 w-3" />
                      Issued: {prescription.issued_date}
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex gap-2 justify-end md:justify-end">
                    <Link href={`/prescriptions/${prescription.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(prescription.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
