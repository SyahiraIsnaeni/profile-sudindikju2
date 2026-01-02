import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const COMMITMENTS_UPLOAD_DIR = join(process.cwd(), 'public', 'storage', 'commitments');
const GALERI_KEGIATANS_UPLOAD_DIR = join(process.cwd(), 'public', 'storage', 'galeri-kegiatans');

/**
 * Save uploaded file to public/storage/commitments directory
 * Returns relative path from public folder
 */
export async function saveCommitmentFile(file: File): Promise<string> {
   try {
     // Create directory if it doesn't exist
     if (!existsSync(COMMITMENTS_UPLOAD_DIR)) {
       await mkdir(COMMITMENTS_UPLOAD_DIR, { recursive: true });
     }

     // Generate unique filename
     const timestamp = Date.now();
     const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
     const filename = `${timestamp}-${originalName}`;
     const filepath = join(COMMITMENTS_UPLOAD_DIR, filename);

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
 * Save multiple uploaded files and return comma-separated paths
 */
export async function saveMultipleCommitmentFiles(files: File[]): Promise<string> {
   try {
     // Create directory if it doesn't exist
     if (!existsSync(COMMITMENTS_UPLOAD_DIR)) {
       await mkdir(COMMITMENTS_UPLOAD_DIR, { recursive: true });
     }

     const savedFiles: string[] = [];

     for (const file of files) {
       // Generate unique filename
       const timestamp = Date.now();
       const randomNum = Math.floor(Math.random() * 10000);
       const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
       const filename = `${timestamp}-${randomNum}-${originalName}`;
       const filepath = join(COMMITMENTS_UPLOAD_DIR, filename);

       // Convert File to Buffer
       const bytes = await file.arrayBuffer();
       const buffer = Buffer.from(bytes);

       // Write file to disk
       await writeFile(filepath, buffer);

       // Add to saved files array
       savedFiles.push(`/storage/commitments/${filename}`);
     }

     // Return comma-separated paths
     return savedFiles.join(',');
   } catch (error) {
     console.error('[FileUploadHandler] Error saving multiple files:', error);
     throw new Error(`Gagal menyimpan file: ${error instanceof Error ? error.message : 'Unknown error'}`);
   }
}

/**
 * Delete single file from storage
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
 * Delete multiple files from storage (comma-separated paths)
 */
export async function deleteMultipleCommitmentFiles(filesPaths: string): Promise<void> {
  try {
    if (!filesPaths) {
      return;
    }

    const { unlink } = await import('fs/promises');
    const paths = filesPaths.split(',').map(p => p.trim()).filter(p => p);

    for (const filePath of paths) {
      if (filePath.startsWith('/storage/commitments/')) {
        const fullPath = join(process.cwd(), 'public', filePath);
        if (existsSync(fullPath)) {
          await unlink(fullPath);
        }
      }
    }
  } catch (error) {
    console.error('[FileUploadHandler] Error deleting multiple files:', error);
    // Don't throw error on delete failure
  }
}

/**
 * Save multiple galeri kegiatan photos
 */
export async function saveMultipleGaleriKegiatanPhotos(files: File[]): Promise<string> {
   try {
     // Create directory if it doesn't exist
     if (!existsSync(GALERI_KEGIATANS_UPLOAD_DIR)) {
       await mkdir(GALERI_KEGIATANS_UPLOAD_DIR, { recursive: true });
     }

     const savedFiles: string[] = [];

     for (const file of files) {
       // Generate unique filename
       const timestamp = Date.now();
       const randomNum = Math.floor(Math.random() * 10000);
       const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
       const filename = `${timestamp}-${randomNum}-${originalName}`;
       const filepath = join(GALERI_KEGIATANS_UPLOAD_DIR, filename);

       // Convert File to Buffer
       const bytes = await file.arrayBuffer();
       const buffer = Buffer.from(bytes);

       // Write file to disk
       await writeFile(filepath, buffer);

       // Add to saved files array
       savedFiles.push(`/storage/galeri-kegiatans/${filename}`);
     }

     // Return comma-separated paths
     return savedFiles.join(',');
   } catch (error) {
     console.error('[FileUploadHandler] Error saving galeri kegiatan photos:', error);
     throw new Error(`Gagal menyimpan foto: ${error instanceof Error ? error.message : 'Unknown error'}`);
   }
}

/**
 * Delete multiple galeri kegiatan photos (comma-separated paths)
 */
export async function deleteMultipleGaleriKegiatanPhotos(photosPaths: string): Promise<void> {
   try {
     if (!photosPaths) {
       return;
     }

     const { unlink } = await import('fs/promises');
     const paths = photosPaths.split(',').map(p => p.trim()).filter(p => p);

     for (const filePath of paths) {
       if (filePath.startsWith('/storage/galeri-kegiatans/')) {
         const fullPath = join(process.cwd(), 'public', filePath);
         if (existsSync(fullPath)) {
           await unlink(fullPath);
         }
       }
     }
   } catch (error) {
     console.error('[FileUploadHandler] Error deleting galeri kegiatan photos:', error);
     // Don't throw error on delete failure
   }
}

/**
 * Validate image file for galeri kegiatan (images only)
 */
export function validateGaleriKegiatanImage(file: File): { valid: boolean; error?: string } {
   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
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
       error: 'Ukuran foto maksimal 10MB',
     };
   }

   // Check file type
   if (!ALLOWED_TYPES.includes(file.type)) {
     return {
       valid: false,
       error: 'Tipe foto tidak didukung. Gunakan: JPG, PNG, GIF, WEBP',
     };
   }

   return { valid: true };
}

/**
 * Validate file before upload
 */
export function validateUploadFile(file: File, isImageOnly: boolean = false): { valid: boolean; error?: string } {
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
          : 'Tipe file tidak didukung. Gunakan: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, WEBP',
      };
    }

    return { valid: true };
}
