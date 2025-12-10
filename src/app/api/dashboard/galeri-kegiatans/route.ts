import { NextRequest, NextResponse } from 'next/server';
import { GaleriKegiatanController } from '@/modules/controllers/GaleriKegiatanController';
import { GaleriKegiatanQueryDTO } from '@/modules/dtos/galeri-kegiatan';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');
        const search = searchParams.get('search') || undefined;
        const status = searchParams.get('status') ? parseInt(searchParams.get('status')!) : undefined;

        const query = new GaleriKegiatanQueryDTO(page, pageSize, search, status);
        const result = await GaleriKegiatanController.getAll(query);

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API] GET /api/dashboard/galeri-kegiatans:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal mengambil data galeri kegiatan' },
            { status: 400 },
        );
    }
}
