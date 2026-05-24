import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (in production, use Supabase)
const registeredUsers: Record<string, { id: string; email: string; password: string; user_type: string; full_name: string }> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, user_type, full_name } = body;

    if (!email || !password || !user_type || !full_name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (registeredUsers[email]) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const userId = `user-${Date.now()}`;
    const newUser = {
      id: userId,
      email,
      password,
      user_type,
      full_name,
    };

    registeredUsers[email] = newUser;

    const response = NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      user_type: newUser.user_type,
      full_name: newUser.full_name,
    });

    response.cookies.set('auth_user', JSON.stringify({ id: newUser.id, email: newUser.email, user_type: newUser.user_type, full_name: newUser.full_name }), {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
