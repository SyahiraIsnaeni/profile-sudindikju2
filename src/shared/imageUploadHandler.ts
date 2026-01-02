import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ARTIKEL_UPLOAD_DIR = join(process.cwd(), 'public', 'storage', 'artikel');

/**
 * Save uploaded image file to public/storage/artikel directory
 * Returns relative path from public folder
 */
export async function saveImageFile(file: File): Promise<string> {
  try {
    // Create directory if it doesn't exist
    if (!existsSync(ARTIKEL_UPLOAD_DIR)) {
      await mkdir(ARTIKEL_UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
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

    // Return relative path from public folder
    return `/storage/artikel/${filename}`;
  } catch (error) {
    console.error('[ImageUploadHandler] Error saving image:', error);
    throw new Error(`Gagal menyimpan gambar: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete image file from storage
 */
export async function deleteImageFile(filePath: string): Promise<void> {
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
    console.error('[ImageUploadHandler] Error deleting image:', error);
    // Don't throw error on delete failure
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Ukuran gambar maksimal 5MB',
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipe gambar tidak didukung. Gunakan: JPEG, PNG, GIF, WEBP',
    };
  }

  return { valid: true };
}
