import { NextRequest, NextResponse } from 'next/server';
import { GaleriKegiatanController } from '@/modules/controllers/GaleriKegiatanController';
import { CreateGaleriKegiatanDTO } from '@/modules/dtos/galeri-kegiatan';
import { saveMultipleGaleriKegiatanPhotos, validateGaleriKegiatanImage } from '@/shared/fileUploadHandler';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const judul = formData.get('judul') as string;
        const status = parseInt(formData.get('status') as string) || 1;
        const fileInputs = formData.getAll('foto') as File[];

        // Validate
        if (!judul || judul.trim() === '') {
            return NextResponse.json(
                { error: 'Judul wajib diisi' },
                { status: 400 },
            );
        }

        let fotoPaths: string | null = null;

        // Handle file uploads if provided
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
                fotoPaths = await saveMultipleGaleriKegiatanPhotos(validFiles);
            }
        }

        // Create DTO
        const dto = new CreateGaleriKegiatanDTO(judul, status, fotoPaths);

        // Create galeri kegiatan
        const result = await GaleriKegiatanController.create(dto);

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('[API] POST /api/dashboard/galeri-kegiatans/create:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal membuat galeri kegiatan' },
            { status: 500 },
        );
    }
}
