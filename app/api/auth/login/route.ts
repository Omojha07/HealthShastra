import { NextRequest, NextResponse } from 'next/server';

// Mock user database - In production, this would use Supabase
const mockUsers: Record<string, { id: string; email: string; password: string; user_type: string; full_name: string }> = {
  'patient@demo.com': {
    id: 'patient-1',
    email: 'patient@demo.com',
    password: 'password123',
    user_type: 'patient',
    full_name: 'John Doe',
  },
  'staff@demo.com': {
    id: 'staff-1',
    email: 'staff@demo.com',
    password: 'password123',
    user_type: 'staff',
    full_name: 'Jane Smith',
  },
  'doctor@demo.com': {
    id: 'doctor-1',
    email: 'doctor@demo.com',
    password: 'password123',
    user_type: 'doctor',
    full_name: 'Dr. Robert Johnson',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = mockUsers[email as string];

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      full_name: user.full_name,
    });

    // Set a cookie with user info (in production, use secure session tokens)
    response.cookies.set('auth_user', JSON.stringify({ id: user.id, email: user.email, user_type: user.user_type, full_name: user.full_name }), {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
