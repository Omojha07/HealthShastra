'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types/database';
import { Plus, Calendar, Clock, User, Stethoscope, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments');
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAppointments(appointments.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-2">Manage patient appointments and schedules</p>
        </div>
        <Link href="/appointments/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Appointments Grid */}
      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            Loading...
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No appointments scheduled
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      Patient Details
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  {appointment.doctor && (
                    <div className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-lg">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctor.full_name}</p>
                        <p className="text-xs text-gray-600">{appointment.doctor.specialization}</p>
                      </div>
                    </div>
                  )}

                  {/* Reason */}
                  {appointment.reason_for_visit && (
                    <div className="text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Reason:</span> {appointment.reason_for_visit}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/appointments/${appointment.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(appointment.id)}
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
