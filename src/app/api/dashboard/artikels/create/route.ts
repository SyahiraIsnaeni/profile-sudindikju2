import { NextRequest, NextResponse } from 'next/server';
import { ArtikelController } from '@/modules/controllers/artikel/ArtikelController';
import { saveMultipleArtikelFiles, validateArtikelFile } from '@/shared/fileUploadHandler';
import { saveImageFile, validateImageFile } from '@/shared/imageUploadHandler';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const judul = formData.get('judul') as string;
        const deskripsi = formData.get('deskripsi') as string | null;
        const kategori = formData.get('kategori') as string | null;
        const penulis = formData.get('penulis') as string | null;
        const tanggalStr = formData.get('tanggal') as string;
        const statusStr = formData.get('status') as string;
        const status = statusStr !== null && statusStr !== '' ? parseInt(statusStr) : 1;
        const gambarFile = formData.get('gambar') as File | null;
        const fileInputs = formData.getAll('file') as File[];

        let gambarPath: string | null = null;
        let filePath: string | null = null;

        // Handle gambar upload
        if (gambarFile && gambarFile.size > 0) {
            const imageValidation = validateImageFile(gambarFile);
            if (!imageValidation.valid) {
                return NextResponse.json(
                    { error: imageValidation.error },
                    { status: 400 }
                );
            }
            gambarPath = await saveImageFile(gambarFile);
        }

        // Handle file uploads if provided
        if (fileInputs && fileInputs.length > 0) {
            const validFiles: File[] = [];

            for (const file of fileInputs) {
                if (file.size > 0) {
                    const validation = validateArtikelFile(file);
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
                filePath = await saveMultipleArtikelFiles(validFiles);
            }
        }

        const result = await ArtikelController.create({
            judul,
            deskripsi: deskripsi || null,
            kategori: kategori || null,
            gambar: gambarPath || null,
            file: filePath || null,
            penulis: penulis || null,
            tanggal: new Date(tanggalStr),
            status,
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error('[API] Create artikel error:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal menambahkan artikel' },
            { status: 500 }
        );
    }
}
