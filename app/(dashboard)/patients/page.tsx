'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Patient } from '@/types/database';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { ErrorDisplay } from '@/components/error-display';
import { LoadingSkeleton } from '@/components/loading-skeleton';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL('/api/patients', window.location.origin);
      if (search) url.searchParams.append('search', search);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load patients';
      setError(errorMessage);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;

    try {
      const response = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      setPatients(patients.filter((p) => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete patient';
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-2">Manage patient information and records</p>
        </div>
        <Link href="/patients/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Error Display */}
      {error && <ErrorDisplay message={error} onRetry={fetchPatients} />}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      {loading ? (
        <LoadingSkeleton count={3} variant="table" />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Patient List ({patients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No patients found</p>
                <Link href="/patients/new">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add first patient
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">DOB</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">Phone</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden lg:table-cell">Blood Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm">
                          <Link href={`/patients/${patient.id}`} className="text-blue-600 hover:underline font-medium">
                            {patient.full_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm hidden md:table-cell text-gray-600">{patient.date_of_birth}</td>
                        <td className="px-4 py-3 text-sm hidden sm:table-cell text-gray-600">{patient.phone}</td>
                        <td className="px-4 py-3 text-sm hidden lg:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {patient.blood_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Link href={`/patients/${patient.id}`}>
                              <Button variant="outline" size="sm" title="Edit patient">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(patient.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete patient"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
