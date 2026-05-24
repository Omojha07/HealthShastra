import { NextRequest, NextResponse } from 'next/server';
import { mockPatients } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patient = mockPatients.find((p) => p.id === id);

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
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

    const patientIndex = mockPatients.findIndex((p) => p.id === id);

    if (patientIndex === -1) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    mockPatients[patientIndex] = {
      ...mockPatients[patientIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(mockPatients[patientIndex]);
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
    const patientIndex = mockPatients.findIndex((p) => p.id === id);

    if (patientIndex === -1) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const deleted = mockPatients.splice(patientIndex, 1)[0];
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
