import { NextRequest, NextResponse } from 'next/server';
import { mockPrescriptions } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prescription = mockPrescriptions.find((p) => p.id === id);

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    return NextResponse.json(prescription);
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

    const prescriptionIndex = mockPrescriptions.findIndex((p) => p.id === id);

    if (prescriptionIndex === -1) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    mockPrescriptions[prescriptionIndex] = {
      ...mockPrescriptions[prescriptionIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(mockPrescriptions[prescriptionIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
