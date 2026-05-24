import { NextRequest, NextResponse } from 'next/server';
import { mockBilling } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = mockBilling.find((b) => b.id === id);

    if (!record) {
      return NextResponse.json({ error: 'Billing record not found' }, { status: 404 });
    }

    return NextResponse.json(record);
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

    const billingIndex = mockBilling.findIndex((b) => b.id === id);

    if (billingIndex === -1) {
      return NextResponse.json({ error: 'Billing record not found' }, { status: 404 });
    }

    mockBilling[billingIndex] = {
      ...mockBilling[billingIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(mockBilling[billingIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
