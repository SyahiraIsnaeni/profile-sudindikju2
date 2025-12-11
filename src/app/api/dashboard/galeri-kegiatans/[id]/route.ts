import { NextRequest, NextResponse } from 'next/server';
import { GaleriKegiatanController } from '@/modules/controllers/GaleriKegiatanController';
import { UpdateGaleriKegiatanDTO } from '@/modules/dtos/galeri-kegiatan';
import { saveMultipleGaleriKegiatanPhotos, validateGaleriKegiatanImage } from '@/shared/fileUploadHandler';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id) || id <= 0) {
            console.error('[API] Invalid galeri kegiatan ID:', resolvedParams.id);
            return NextResponse.json(
                { error: 'ID tidak valid' },
                { status: 400 },
            );
        }

        const result = await GaleriKegiatanController.getById(id);

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API] GET /api/dashboard/galeri-kegiatans/[id]:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal mengambil data galeri kegiatan' },
            { status: 500 },
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id) || id <= 0) {
            console.error('[API] Invalid galeri kegiatan ID:', resolvedParams.id);
            return NextResponse.json(
                { error: 'ID tidak valid' },
                { status: 400 },
            );
        }

        const formData = await request.formData();
        const judul = formData.get('judul') as string;
        const status = formData.get('status') ? parseInt(formData.get('status') as string) : undefined;
        const fileInputs = formData.getAll('foto') as File[];
        const existingFilesStr = formData.get('existingFiles') as string;

        // Validate
        if (judul && judul.trim() === '') {
            return NextResponse.json(
                { error: 'Judul tidak boleh kosong' },
                { status: 400 },
            );
        }

        // Get existing data
        const existing = await GaleriKegiatanController.getById(id);

        // Parse existing files
        const existingFiles = existingFilesStr && existingFilesStr !== 'null'
            ? existingFilesStr.split(',').map(f => f.trim()).filter(f => f)
            : [];

        // Handle new file uploads
        let fotoPaths = [...existingFiles];

        if (fileInputs && fileInputs.length > 0) {
            const validFiles: File[] = [];

            for (const file of fileInputs) {
                if (file.size > 0) {
                    const validation = validateGaleriKegiatanImage(file);
                    if (!validation.valid) {
                        return NextResponse.json(
                            { error: validation.error },
                            { status: 400 }
                        );
                    }
                    validFiles.push(file);
                }
            }

            if (validFiles.length > 0) {
                const newPhotos = await saveMultipleGaleriKegiatanPhotos(validFiles);
                fotoPaths.push(...newPhotos.split(','));
            }
        }

        // Create DTO
        const fotoString = fotoPaths.length > 0 ? fotoPaths.join(',') : null;
        const dto = new UpdateGaleriKegiatanDTO(id, judul, status, fotoString);

        // Update galeri kegiatan
        const result = await GaleriKegiatanController.update(id, dto);

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API] PUT /api/dashboard/galeri-kegiatans/[id]:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal memperbarui galeri kegiatan' },
            { status: 500 },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if (isNaN(id) || id <= 0) {
            console.error('[API] Invalid galeri kegiatan ID:', resolvedParams.id);
            return NextResponse.json(
                { error: 'ID tidak valid' },
                { status: 400 },
            );
        }

        const result = await GaleriKegiatanController.delete(id);

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API] DELETE /api/dashboard/galeri-kegiatans/[id]:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal menghapus galeri kegiatan' },
            { status: 500 },
        );
    }
}
