import { NextRequest, NextResponse } from 'next/server';
import { RoleController } from '@/modules/controllers/roles/RoleController';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roleId = parseInt(id);
    const result = await RoleController.getById(roleId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data role' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roleId = parseInt(id);
    const dto = await request.json();
    const result = await RoleController.update(roleId, dto);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal mengupdate role' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roleId = parseInt(id);
    const result = await RoleController.delete(roleId);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal menghapus role' },
      { status: 500 }
    );
  }
}
