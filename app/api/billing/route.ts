import { NextRequest, NextResponse } from 'next/server';
import { mockBilling } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patient_id');
    const status = searchParams.get('status');

    let records = mockBilling;

    if (patientId) {
      records = records.filter((b) => b.patient_id === patientId);
    }

    if (status) {
      records = records.filter((b) => b.status === status);
    }

    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newBilling = {
      id: `bill-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockBilling.push(newBilling);

    return NextResponse.json(newBilling, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
