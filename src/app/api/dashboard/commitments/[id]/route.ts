import { NextRequest, NextResponse } from 'next/server';
import { CommitmentController } from '@/modules/controllers/commitments/CommitmentController';
import { saveCommitmentFile, validateUploadFile, deleteCommitmentFile } from '@/shared/fileUploadHandler';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Handle params yang mungkin masih promise
    const resolvedParams = await Promise.resolve(params);
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
  { params }: { params: { id: string } }
) {
  try {
    // Handle params yang mungkin masih promise
    const resolvedParams = await Promise.resolve(params);
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
    const status = formData.get('status') ? parseInt(formData.get('status') as string) : undefined;
    const fileInput = formData.get('file') as File | null;
    const existingFile = formData.get('existingFile') as string | null;

    let filePath: string | undefined;

    // Handle file upload if new file provided
    if (fileInput && fileInput.size > 0) {
      const validation = validateUploadFile(fileInput);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
      filePath = await saveCommitmentFile(fileInput);
      
      // Delete old file if exists
      if (existingFile) {
        await deleteCommitmentFile(existingFile);
      }
    } else if (existingFile === 'null' || existingFile === '') {
      // User removed the file
      filePath = null;
      if (existingFile !== 'null') {
        await deleteCommitmentFile(existingFile);
      }
    }
    // If no new file and not removing, keep existing file

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
  { params }: { params: { id: string } }
) {
  try {
    // Handle params yang mungkin masih promise
    const resolvedParams = await Promise.resolve(params);
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
