import { NextRequest, NextResponse } from 'next/server';
import { mockDoctors } from '@/lib/mock-data';

export async function GET() {
  try {
    return NextResponse.json(mockDoctors);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newDoctor = {
      id: `doctor-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockDoctors.push(newDoctor);

    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
