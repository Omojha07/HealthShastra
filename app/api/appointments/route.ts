import { NextRequest, NextResponse } from 'next/server';
import { mockAppointments } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patient_id');
    const doctorId = searchParams.get('doctor_id');

    let appointments = mockAppointments;

    if (patientId) {
      appointments = appointments.filter((a) => a.patient_id === patientId);
    }

    if (doctorId) {
      appointments = appointments.filter((a) => a.doctor_id === doctorId);
    }

    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newAppointment = {
      id: `apt-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockAppointments.push(newAppointment);

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
