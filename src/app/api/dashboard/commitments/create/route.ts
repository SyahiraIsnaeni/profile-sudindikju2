import { NextRequest, NextResponse } from 'next/server';
import { CommitmentController } from '@/modules/controllers/commitments/CommitmentController';
import { saveMultipleCommitmentFiles, validateUploadFile } from '@/shared/fileUploadHandler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const icon = formData.get('icon') as string | null;
    const sortOrder = formData.get('sort_order') as string | null;
    const status = parseInt(formData.get('status') as string) || 1;
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
