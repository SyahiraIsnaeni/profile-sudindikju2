import { NextRequest, NextResponse } from 'next/server';
import { LayananController } from '@/modules/controllers/layanan/LayananController';
import { saveMultipleCommitmentFiles, validateUploadFile } from '@/shared/fileUploadHandler';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const nama = formData.get('nama') as string;
        const deskripsi = formData.get('deskripsi') as string | null;
        const icon = formData.get('icon') as string | null;
        const urutan = formData.get('urutan') as string | null;
        const statusStr = formData.get('status') as string;
        const status = statusStr !== null && statusStr !== '' ? parseInt(statusStr) : 1;
        const fileInputs = formData.getAll('file') as File[];

        let filePath: string | null = null;

        // Handle file uploads if provided
        if (fileInputs && fileInputs.length > 0) {
            const validFiles: File[] = [];

            for (const file of fileInputs) {
                if (file.size > 0) {
                    const validation = validateUploadFile(file);
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
                filePath = await saveMultipleCommitmentFiles(validFiles);
            }
        }

        const result = await LayananController.create({
            nama,
            deskripsi: deskripsi || null,
            file: filePath || null,
            icon: icon || null,
            urutan: urutan ? parseInt(urutan) : null,
            status,
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('[API] Create layanan error:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal menambahkan layanan publik' },
            { status: 500 }
        );
    }
}
