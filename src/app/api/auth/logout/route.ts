import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );

    // Clear auth token cookie
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
