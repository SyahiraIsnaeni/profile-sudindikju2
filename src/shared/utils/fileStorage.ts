import { writeFile, mkdir } from 'fs/promises';
import { join, normalize, resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * Simpan file ke storage directory
 * @param file - File object dari FormData
 * @param subfolder - Sub folder di dalam storage (misal: profil-instansi)
 * @returns Relative path untuk disimpan ke database
 */
export async function saveFileToStorage(
    file: File,
    subfolder: string
): Promise<string> {
    try {
        console.log('\n=== [fileStorage] Starting saveFileToStorage ===');
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        console.log('File type:', file.type);
        console.log('Subfolder:', subfolder);

        // Konversi nama file ke format yang aman
        const fileName = sanitizeFileName(file.name);
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}-${fileName}`;

        // Get the correct base path
        let baseDir: string;

        if (process.env.NODE_ENV === 'production' && process.cwd() === '/') {
            // Running in Docker/production
            baseDir = '/app';
            console.log('[fileStorage] Using Docker path: /app');
        } else {
            // Running locally
            baseDir = process.cwd();
            console.log('[fileStorage] Using process.cwd():', baseDir);
        }

        // Normalize path to avoid Windows backslash issues
        const normalizedBaseDir = normalize(baseDir);
        console.log('[fileStorage] Normalized base dir:', normalizedBaseDir);

        // Build storage path step by step
        const publicDir = normalize(join(normalizedBaseDir, 'public'));
        const storageDir = normalize(join(publicDir, 'storage'));
        const storagePath = normalize(join(storageDir, subfolder));

        console.log('[fileStorage] Public dir:', publicDir);
        console.log('[fileStorage] Storage dir:', storageDir);
        console.log('[fileStorage] Storage path:', storagePath);

        // Buat folder jika belum ada (sync version untuk memastikan)
        try {
            if (!existsSync(storagePath)) {
                console.log('[fileStorage] Creating directory:', storagePath);
                mkdirSync(storagePath, { recursive: true });
                console.log('[fileStorage] Directory created successfully');
            } else {
                console.log('[fileStorage] Directory already exists:', storagePath);
            }
        } catch (mkdirError) {
            console.error('[fileStorage] Error creating directory:', mkdirError);
            throw mkdirError;
        }

        // Path lengkap file
        const filePath = normalize(join(storagePath, uniqueFileName));
        console.log('[fileStorage] File path:', filePath);

        // Double check path is valid before writing
        if (!filePath || filePath === '/' || filePath.length < 5) {
            throw new Error(`Invalid file path: ${filePath}`);
        }

        // Konversi file ke buffer dan simpan
        try {
            console.log('[fileStorage] Converting file to buffer...');
            const buffer = await file.arrayBuffer();
            console.log('[fileStorage] Buffer size:', buffer.byteLength);

            console.log('[fileStorage] Writing file to:', filePath);
            await writeFile(filePath, Buffer.from(buffer));

            console.log('[fileStorage] File written successfully');

            // Verify file exists
            if (!existsSync(filePath)) {
                throw new Error('File was written but does not exist after write');
            }
            console.log('[fileStorage] File verified to exist');
        } catch (writeError) {
            console.error('[fileStorage] Error writing file:', writeError);
            throw writeError;
        }

        // Return relative path untuk disimpan ke database
        // Normalize slashes untuk consistency
        const relativePath = `/storage/${subfolder}/${uniqueFileName}`.replace(/\\/g, '/');
        console.log('[fileStorage] Relative path:', relativePath);
        console.log('=== [fileStorage] SUCCESS ===\n');

        return relativePath;
    } catch (error) {
        console.error('\n=== [fileStorage] ERROR ===');
        console.error('Error object:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        console.error('=== [fileStorage] ERROR END ===\n');

        throw new Error(
            `Gagal menyimpan file: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

/**
 * Sanitize nama file untuk menghindari masalah path traversal
 */
function sanitizeFileName(fileName: string): string {
    return fileName
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '-')
        .replace(/--+/g, '-')
        .slice(0, 100); // Limit length
}

/**
 * Delete file dari storage
 */
export async function deleteFileFromStorage(filePath: string): Promise<void> {
    try {
        if (!filePath || !filePath.startsWith('/storage/')) {
            return;
        }

        const fullPath = join(process.cwd(), 'public', filePath);

        // Safety check: ensure path is within storage directory
        const storagePath = join(process.cwd(), 'public', 'storage');
        if (!fullPath.startsWith(storagePath)) {
            console.warn('Attempted to delete file outside storage directory:', filePath);
            return;
        }

        if (existsSync(fullPath)) {
            const { rm } = await import('fs/promises');
            await rm(fullPath);
        }
    } catch (error) {
        console.error('Error deleting file from storage:', error);
        // Don't throw, just log - optional file deletion shouldn't break the operation
    }
}
