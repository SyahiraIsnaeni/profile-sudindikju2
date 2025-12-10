import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'public', 'storage', 'commitments');

/**
 * Save uploaded file to public/storage/commitments directory
 * Returns relative path from public folder
 */
export async function saveCommitmentFile(file: File): Promise<string> {
  try {
    // Create directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(UPLOAD_DIR, filename);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return relative path from public folder
    return `/storage/commitments/${filename}`;
  } catch (error) {
    console.error('[FileUploadHandler] Error saving file:', error);
    throw new Error(`Gagal menyimpan file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete file from storage
 */
export async function deleteCommitmentFile(filePath: string): Promise<void> {
  try {
    if (!filePath || !filePath.startsWith('/storage/commitments/')) {
      return;
    }

    const { unlink } = await import('fs/promises');
    const fullPath = join(process.cwd(), 'public', filePath);
    
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error('[FileUploadHandler] Error deleting file:', error);
    // Don't throw error on delete failure
  }
}

/**
 * Validate file before upload
 */
export function validateUploadFile(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Ukuran file maksimal 10MB',
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipe file tidak didukung. Gunakan: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP',
    };
  }

  return { valid: true };
}
