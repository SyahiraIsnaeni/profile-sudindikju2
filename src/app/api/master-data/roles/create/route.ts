import { NextRequest, NextResponse } from 'next/server';
import { RoleController } from '@/modules/controllers/roles/RoleController';

export async function POST(request: NextRequest) {
  try {
    const dto = await request.json();
    const result = await RoleController.create(dto);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal membuat role' },
      { status: 500 }
    );
  }
}
