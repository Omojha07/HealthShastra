import { NextRequest, NextResponse } from 'next/server';
import { mockPatients } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search')?.toLowerCase() || '';

    let patients = mockPatients;

    if (search) {
      patients = patients.filter(
        (p) =>
          p.full_name.toLowerCase().includes(search) ||
          p.phone.includes(search) ||
          p.email?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newPatient = {
      id: `patient-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockPatients.push(newPatient);

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
