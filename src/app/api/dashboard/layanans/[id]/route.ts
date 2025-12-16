import { NextRequest, NextResponse } from 'next/server';
import { LayananController } from '@/modules/controllers/layanan/LayananController';
import { saveMultipleCommitmentFiles, validateUploadFile } from '@/shared/fileUploadHandler';

// GET by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const layananId = parseInt(resolvedParams.id);

        if (isNaN(layananId) || layananId <= 0) {
            return NextResponse.json(
                { error: 'ID layanan tidak valid' },
                { status: 400 }
            );
        }

        const result = await LayananController.getById(layananId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Gagal mengambil data layanan publik' },
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
        const layananId = parseInt(resolvedParams.id);

        if (isNaN(layananId) || layananId <= 0) {
            return NextResponse.json(
                { error: 'ID layanan tidak valid' },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        const nama = formData.get('nama') as string | undefined;
        const deskripsi = formData.get('deskripsi') as string | null | undefined;
        const icon = formData.get('icon') as string | null | undefined;
        const urutan = formData.get('urutan') as string | null | undefined;
        const statusStr = formData.get('status') as string | null | undefined;
        const status = statusStr !== null && statusStr !== undefined && statusStr !== '' ? parseInt(statusStr) : undefined;
        const fileInputs = formData.getAll('file') as File[];
        const existingFiles = formData.get('existingFiles') as string | null;

        console.log('[API PUT] File handling START:', {
            layananId,
            existingFilesFromClient: existingFiles,
            newFilesCount: fileInputs.length,
            newFilesNames: fileInputs.map(f => f.name),
        });

        let filePath: string | null | undefined = undefined;

        // Step 1: Handle remaining existing files (files yang user tidak hapus)
        if (existingFiles && existingFiles !== 'null' && existingFiles.trim() !== '') {
            // Parse comma-separated file paths and remove duplicates
            const existingFilesList = existingFiles
                .split(',')
                .map(f => f.trim())
                .filter(f => f && f !== 'null');

            if (existingFilesList.length > 0) {
                filePath = existingFilesList.join(',');
                console.log('[API PUT] Keeping existing files:', existingFilesList);
            }
        }

        // Step 2: Handle new file uploads if provided
        if (fileInputs && fileInputs.length > 0) {
            console.log('[API PUT] Processing new file uploads...');
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
                const newFilePath = await saveMultipleCommitmentFiles(validFiles);
                console.log('[API PUT] New files uploaded:', newFilePath);

                // Combine existing and new files
                if (filePath && filePath !== 'null') {
                    // Already have existing files, append new ones
                    filePath = `${filePath},${newFilePath}`;
                    console.log('[API PUT] Combined existing + new files:', filePath);
                } else {
                    // No existing files, use only new files
                    filePath = newFilePath;
                    console.log('[API PUT] Using only new files:', filePath);
                }
            }
        }

        // Step 3: Validate final file path
        console.log('[API PUT] Final filePath before save:', filePath || 'null');

        if (!filePath || filePath === 'null') {
            console.log('[API PUT] No files to save (all deleted)');
            filePath = null;
        }

        const result = await LayananController.update(layananId, {
            nama,
            deskripsi,
            file: filePath,
            icon,
            urutan: urutan ? parseInt(urutan) : undefined,
            status,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API] Update layanan error:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal memperbarui layanan publik' },
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
        const layananId = parseInt(resolvedParams.id);

        if (isNaN(layananId) || layananId <= 0) {
            return NextResponse.json(
                { error: 'ID layanan tidak valid' },
                { status: 400 }
            );
        }

        const result = await LayananController.delete(layananId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API] Delete layanan error:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal menghapus layanan publik' },
            { status: 500 }
        );
    }
}
