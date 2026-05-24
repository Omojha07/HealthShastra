import { NextRequest, NextResponse } from 'next/server';
import { mockAppointments } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointment = mockAppointments.find((a) => a.id === id);

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const appointmentIndex = mockAppointments.findIndex((a) => a.id === id);

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    mockAppointments[appointmentIndex] = {
      ...mockAppointments[appointmentIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(mockAppointments[appointmentIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointmentIndex = mockAppointments.findIndex((a) => a.id === id);

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const deleted = mockAppointments.splice(appointmentIndex, 1)[0];
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
