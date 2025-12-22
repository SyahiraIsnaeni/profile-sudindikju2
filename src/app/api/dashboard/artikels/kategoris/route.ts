import { NextRequest, NextResponse } from 'next/server';
import { ArtikelController } from '@/modules/controllers/artikel/ArtikelController';

export async function GET(request: NextRequest) {
  try {
    const result = await ArtikelController.getAllKategoris();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Gagal mengambil data kategori' },
      { status: 500 }
    );
  }
}
