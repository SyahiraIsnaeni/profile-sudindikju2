import { NextRequest, NextResponse } from 'next/server';
import { CommitmentController } from '@/modules/controllers/commitments/CommitmentController';
import { saveMultipleCommitmentFiles, validateUploadFile, deleteMultipleCommitmentFiles } from '@/shared/fileUploadHandler';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const commitmentId = parseInt(resolvedParams.id);

        if (isNaN(commitmentId) || commitmentId <= 0) {
            console.error('[API] Invalid commitment ID:', resolvedParams.id);
            return NextResponse.json(
                { error: 'ID komitmen tidak valid' },
                { status: 400 }
            );
        }

        const result = await CommitmentController.getById(commitmentId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Gagal mengambil data komitmen pelayanan' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const commitmentId = parseInt(resolvedParams.id);

        if (isNaN(commitmentId) || commitmentId <= 0) {
            console.error('[API] Invalid commitment ID:', resolvedParams.id);
            return NextResponse.json(
                { error: 'ID komitmen tidak valid' },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        const name = formData.get('name') as string | undefined;
        const description = formData.get('description') as string | undefined;
        const icon = formData.get('icon') as string | undefined;
        const sortOrder = formData.get('sort_order') as string | undefined;
        const statusStr = formData.get('status') as string | null | undefined;
        const status = statusStr !== null && statusStr !== undefined && statusStr !== '' ? parseInt(statusStr) : undefined;
        const fileInputs = formData.getAll('file') as File[];
        const existingFiles = formData.get('existingFiles') as string | null;

        let filePath: string | null | undefined;

        // Handle file uploads if new files provided
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

                // Delete old files if exists
                if (existingFiles && existingFiles !== 'null') {
                    await deleteMultipleCommitmentFiles(existingFiles);
                }
            }
        } else if (existingFiles === 'null' || existingFiles === '') {
            // User removed all files
            filePath = null;
            if (existingFiles && existingFiles !== 'null') {
                await deleteMultipleCommitmentFiles(existingFiles);
            }
        }
        // If no new file and not removing, keep existing files

        const result = await CommitmentController.update(commitmentId, {
            name,
            description,
            file: filePath !== undefined ? filePath : undefined,
            icon,
            sort_order: sortOrder ? parseInt(sortOrder) : undefined,
            status,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('[API] Update commitment error:', error);
        return NextResponse.json(
            { error: error.message || 'Gagal memperbarui komitmen pelayanan' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const commitmentId = parseInt(resolvedParams.id);

        if (isNaN(commitmentId) || commitmentId <= 0) {
            console.error('[API] Invalid commitment ID:', resolvedParams.id);
            return NextResponse.json(
                { error: 'ID komitmen tidak valid' },
                { status: 400 }
            );
        }

        const result = await CommitmentController.delete(commitmentId);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Gagal menghapus komitmen pelayanan' },
            { status: 500 }
        );
    }
}
