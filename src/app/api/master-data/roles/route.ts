import { NextRequest, NextResponse } from 'next/server';
import { RoleController } from '@/modules/controllers/roles/RoleController';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status')
      ? parseInt(searchParams.get('status')!)
      : undefined;

    const result = await RoleController.getAll({
      page,
      pageSize,
      search,
      status,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data role' },
      { status: 500 }
    );
  }
}
