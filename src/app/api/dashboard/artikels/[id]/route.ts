import { NextRequest, NextResponse } from 'next/server';
import { ArtikelController } from '@/modules/controllers/artikel/ArtikelController';
import { saveMultipleArtikelFiles, validateArtikelFile } from '@/shared/artikelFileUploadHandler';
import { saveImageFile, validateImageFile } from '@/shared/imageUploadHandler';

// GET by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const artikelId = parseInt(resolvedParams.id);

        if (isNaN(artikelId) || artikelId <= 0) {
            return NextResponse.json(
                { error: 'ID artikel tidak valid' },
                { status: 400 }
            );
        }

        const result = await ArtikelController.getById(artikelId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Gagal mengambil data artikel' },
            { status: 500 }
        );
    }
}

// PUT (Update)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const artikelId = parseInt(resolvedParams.id);

        if (isNaN(artikelId) || artikelId <= 0) {
            return NextResponse.json(
                { error: 'ID artikel tidak valid' },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        const judul = formData.get('judul') as string | undefined;
        const deskripsi = formData.get('deskripsi') as string | null | undefined;
        const kategori = formData.get('kategori') as string | null | undefined;
        const penulis = formData.get('penulis') as string | null | undefined;
        const tanggalStr = formData.get('tanggal') as string | undefined;
        const statusStr = formData.get('status') as string | null | undefined;
        const status = statusStr !== null && statusStr !== undefined && statusStr !== '' ? parseInt(statusStr) : undefined;
        const gambarFile = formData.get('gambar') as File | null;
        const existingGambar = formData.get('existingGambar') as string | null;
        const fileInputs = formData.getAll('file') as File[];
        const existingFiles = formData.get('existingFiles') as string | null;

        console.log('[API PUT] Artikel update START:', {
            artikelId,
            existingFilesFromClient: existingFiles,
            newFilesCount: fileInputs.length,
            hasNewGambar: gambarFile ? true : false,
            existingGambar,
        });

        let gambarPath: string | null | undefined = undefined;
        let filePath: string | null | undefined = undefined;

        // Handle gambar
        if (gambarFile && gambarFile.size > 0) {
            const imageValidation = validateImageFile(gambarFile);
            if (!imageValidation.valid) {
                return NextResponse.json(
                    { error: imageValidation.error },
                    { status: 400 }
                );
            }
            gambarPath = await saveImageFile(gambarFile);
        } else if (existingGambar && existingGambar !== 'null') {
            gambarPath = existingGambar;
        }

        // Handle remaining existing files
        if (existingFiles && existingFiles !== 'null' && existingFiles.trim() !== '') {
            const existingFilesList = existingFiles
                .split(',')
                .map(f => f.trim())
                .filter(f => f && f !== 'null');

            if (existingFilesList.length > 0) {
                filePath = existingFilesList.join(',');
                console.log('[API PUT] Keeping existing files:', existingFilesList);
            }
        }

        // Handle new file uploads
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
                const newFilePath = await saveMultipleArtikelFiles(validFiles);
                filePath = filePath ? `${filePath},${newFilePath}` : newFilePath;
                console.log('[API PUT] Added new files, total files now:', filePath);
            }
        }

        const updateData: any = {};

        if (judul !== undefined) updateData.judul = judul;
        if (deskripsi !== undefined) updateData.deskripsi = deskripsi;
        if (kategori !== undefined) updateData.kategori = kategori;
        if (penulis !== undefined) updateData.penulis = penulis;
        if (tanggalStr !== undefined) updateData.tanggal = new Date(tanggalStr);
        if (status !== undefined) updateData.status = status;
        if (gambarPath !== undefined) updateData.gambar = gambarPath;
        if (filePath !== undefined) updateData.file = filePath;

        console.log('[API PUT] Calling controller with:', updateData);

        const result = await ArtikelController.update(artikelId, updateData);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API PUT] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal mengupdate artikel' },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const artikelId = parseInt(resolvedParams.id);

        if (isNaN(artikelId) || artikelId <= 0) {
            return NextResponse.json(
                { error: 'ID artikel tidak valid' },
                { status: 400 }
            );
        }

        const result = await ArtikelController.delete(artikelId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Gagal menghapus artikel' },
            { status: 500 }
        );
    }
}
