import { NextRequest, NextResponse } from 'next/server';
import { ArtikelController } from '@/modules/controllers/artikel/ArtikelController';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status')
      ? parseInt(searchParams.get('status')!)
      : undefined;
    const kategori = searchParams.get('kategori') || undefined;

    const result = await ArtikelController.getAll({
      page,
      pageSize,
      search,
      status,
      kategori,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data artikel' },
      { status: 500 }
    );
  }
}
