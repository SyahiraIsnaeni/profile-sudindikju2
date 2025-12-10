import { NextRequest, NextResponse } from 'next/server';
import { CommitmentController } from '@/modules/controllers/commitments/CommitmentController';
import { saveCommitmentFile, validateUploadFile } from '@/shared/fileUploadHandler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const icon = formData.get('icon') as string | null;
    const sortOrder = formData.get('sort_order') as string | null;
    const status = parseInt(formData.get('status') as string) || 1;
    const fileInput = formData.get('file') as File | null;

    let filePath: string | null = null;

    // Handle file upload if provided
    if (fileInput && fileInput.size > 0) {
      const validation = validateUploadFile(fileInput);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
      filePath = await saveCommitmentFile(fileInput);
    }

    const result = await CommitmentController.create({
      name,
      description: description || null,
      file: filePath || null,
      icon: icon || null,
      sort_order: sortOrder ? parseInt(sortOrder) : null,
      status,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('[API] Create commitment error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menambahkan komitmen pelayanan' },
      { status: 500 }
    );
  }
}
