import { NextRequest, NextResponse } from 'next/server';
import { PermissionController } from '@/modules/controllers/permissions/PermissionController';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format'); // 'grouped' atau 'flat'

    let result;
    if (format === 'flat') {
      result = await PermissionController.getAllFlat();
    } else {
      result = await PermissionController.getAll();
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data permissions' },
      { status: 500 }
    );
  }
}