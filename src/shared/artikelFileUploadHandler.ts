import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ARTIKEL_UPLOAD_DIR = join(process.cwd(), 'public', 'storage', 'artikel');

/**
 * Save single artikel file
 * Returns relative path from public folder
 */
export async function saveArtikelFile(file: File): Promise<string> {
  try {
    // Create directory if it doesn't exist
    if (!existsSync(ARTIKEL_UPLOAD_DIR)) {
      await mkdir(ARTIKEL_UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(ARTIKEL_UPLOAD_DIR, filename);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return relative path from public folder
    return `/storage/artikel/${filename}`;
  } catch (error) {
    console.error('[ArtikelFileUploadHandler] Error saving file:', error);
    throw new Error(`Gagal menyimpan file artikel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Save multiple artikel files and return comma-separated paths
 */
export async function saveMultipleArtikelFiles(files: File[]): Promise<string> {
  try {
    // Create directory if it doesn't exist
    if (!existsSync(ARTIKEL_UPLOAD_DIR)) {
      await mkdir(ARTIKEL_UPLOAD_DIR, { recursive: true });
    }

    const savedFiles: string[] = [];

    for (const file of files) {
      // Generate unique filename with random number to avoid collisions
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 10000);
      const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
      const filename = `${timestamp}-${randomNum}-${originalName}`;
      const filepath = join(ARTIKEL_UPLOAD_DIR, filename);

      // Convert File to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Add to saved files array
      savedFiles.push(`/storage/artikel/${filename}`);
    }

    // Return comma-separated paths
    return savedFiles.join(',');
  } catch (error) {
    console.error('[ArtikelFileUploadHandler] Error saving multiple files:', error);
    throw new Error(`Gagal menyimpan file artikel: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete single artikel file from storage
 */
export async function deleteArtikelFile(filePath: string): Promise<void> {
  try {
    if (!filePath || !filePath.startsWith('/storage/artikel/')) {
      return;
    }

    const { unlink } = await import('fs/promises');
    const fullPath = join(process.cwd(), 'public', filePath);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch (error) {
    console.error('[ArtikelFileUploadHandler] Error deleting file:', error);
    // Don't throw error on delete failure
  }
}

/**
 * Delete multiple artikel files from storage (comma-separated paths)
 */
export async function deleteMultipleArtikelFiles(filesPaths: string): Promise<void> {
  try {
    if (!filesPaths) {
      return;
    }

    const { unlink } = await import('fs/promises');
    const paths = filesPaths.split(',').map(p => p.trim()).filter(p => p);

    for (const filePath of paths) {
      if (filePath.startsWith('/storage/artikel/')) {
        const fullPath = join(process.cwd(), 'public', filePath);
        if (existsSync(fullPath)) {
          await unlink(fullPath);
        }
      }
    }
  } catch (error) {
    console.error('[ArtikelFileUploadHandler] Error deleting multiple files:', error);
    // Don't throw error on delete failure
  }
}

/**
 * Validate artikel file before upload
 */
export function validateArtikelFile(file: File, isImageOnly: boolean = false): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = isImageOnly ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for images, 10MB for files
  const ALLOWED_TYPES = isImageOnly
    ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    : [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'text/csv',
      ];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: isImageOnly ? 'Ukuran gambar maksimal 5MB' : 'Ukuran file maksimal 10MB',
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: isImageOnly
        ? 'Tipe gambar tidak didukung. Gunakan: JPEG, PNG, GIF, WEBP'
        : 'Tipe file tidak didukung. Gunakan: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP, CSV',
    };
  }

  return { valid: true };
}
