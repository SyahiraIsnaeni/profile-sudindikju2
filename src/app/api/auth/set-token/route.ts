import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    const response = NextResponse.json(
      { success: true, message: 'Token set' },
      { status: 200 }
    );

    // Set HTTP-only cookie (lebih aman)
    response.cookies.set({
      name: 'auth-token',
      value: `user_${userId}_${Date.now()}`,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set token' },
      { status: 500 }
    );
  }
}