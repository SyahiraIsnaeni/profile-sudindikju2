import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/modules/controllers/users/UserController';

export async function POST(request: NextRequest) {
  try {
    const dto = await request.json();
    const result = await UserController.create(dto);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal membuat pengguna' },
      { status: 500 }
    );
  }
}
