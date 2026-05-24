'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Doctor } from '@/types/database';
import { Stethoscope, Phone, Clock, Award } from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
        <p className="text-gray-600 mt-2">Hospital staff and medical professionals</p>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Loading...
          </CardContent>
        </Card>
      ) : doctors.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No doctors available
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Doctor Avatar & Name */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{doctor.full_name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>

                  {/* Doctor Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{doctor.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{doctor.office_hours}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-xs">{doctor.license_number}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {doctor.bio && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600 line-clamp-2">{doctor.bio}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
