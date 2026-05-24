import { NextRequest, NextResponse } from 'next/server';
import { mockPrescriptions } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patient_id');

    let prescriptions = mockPrescriptions;

    if (patientId) {
      prescriptions = prescriptions.filter((p) => p.patient_id === patientId);
    }

    return NextResponse.json(prescriptions);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newPrescription = {
      id: `rx-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockPrescriptions.push(newPrescription);

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
