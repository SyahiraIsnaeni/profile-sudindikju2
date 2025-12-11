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
    const status = formData.get('status') ? parseInt(formData.get('status') as string) : undefined;
    const fileInputs = formData.getAll('file') as File[];
    const existingFiles = formData.get('existingFiles') as string | null;

    let filePath: string | null | undefined = undefined;

    // Handle existing files
    if (existingFiles && existingFiles !== 'null') {
      filePath = existingFiles;
    }

    // Handle new file uploads if provided
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
        const newFilePath = await saveMultipleCommitmentFiles(validFiles);
        // Combine existing and new files
        if (filePath && filePath !== 'null') {
          filePath = `${filePath},${newFilePath}`;
        } else {
          filePath = newFilePath;
        }
      }
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
