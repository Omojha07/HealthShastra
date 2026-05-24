import { NextRequest, NextResponse } from 'next/server';
import { mockInventory } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = mockInventory.find((i) => i.id === id);

    if (!item) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
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

    const itemIndex = mockInventory.findIndex((i) => i.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    mockInventory[itemIndex] = {
      ...mockInventory[itemIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(mockInventory[itemIndex]);
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
    const itemIndex = mockInventory.findIndex((i) => i.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 });
    }

    const deleted = mockInventory.splice(itemIndex, 1)[0];
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
