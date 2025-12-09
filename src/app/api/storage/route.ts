import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * GET /api/storage/[...path]
 * Serve files dari public/storage directory
 * 
 * Usage: GET /api/storage/profil-instansi/struktur-organisasi/1234-foto.jpg
 */
export async function GET(request: NextRequest) {
    try {
        // Extract path dari URL
        const pathname = request.nextUrl.pathname.replace('/api/storage/', '');

        if (!pathname) {
            return NextResponse.json(
                { success: false, message: 'Path tidak boleh kosong' },
                { status: 400 }
            );
        }

        // Security: ensure path is within storage directory
        if (pathname.includes('..') || pathname.startsWith('/')) {
            return NextResponse.json(
                { success: false, message: 'Invalid path' },
                { status: 400 }
            );
        }

        // Build file path with proper path separator
        const baseDir = process.cwd();
        const filePath = join(baseDir, 'public', 'storage', pathname);
        const storagePath = join(baseDir, 'public', 'storage');

        console.log('[Storage API] Request pathname:', pathname);
        console.log('[Storage API] Base dir:', baseDir);
        console.log('[Storage API] Full file path:', filePath);
        console.log('[Storage API] Storage path:', storagePath);

        // Verify file is within storage directory (normalize paths for comparison)
        const normalizedFilePath = filePath.replace(/\\/g, '/').toLowerCase();
        const normalizedStoragePath = storagePath.replace(/\\/g, '/').toLowerCase();
        
        if (!normalizedFilePath.startsWith(normalizedStoragePath)) {
            console.warn('[Storage API] Security check failed');
            console.warn('[Storage API] Normalized file path:', normalizedFilePath);
            console.warn('[Storage API] Normalized storage path:', normalizedStoragePath);
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        // Check if file exists
        console.log('[Storage API] Checking file exists:', existsSync(filePath));
        if (!existsSync(filePath)) {
            console.error('[Storage API] File not found at:', filePath);
            return NextResponse.json(
                { success: false, message: 'File not found' },
                { status: 404 }
            );
        }
        
        console.log('[Storage API] File found, reading...');

        // Read file
        console.log('[Storage API] Reading file buffer...');
        const fileBuffer = await readFile(filePath);
        console.log('[Storage API] File buffer size:', fileBuffer.length);

        // Determine content type
        let contentType = 'application/octet-stream';
        const lowerPath = filePath.toLowerCase();
        if (lowerPath.endsWith('.jpg') || lowerPath.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
        } else if (lowerPath.endsWith('.png')) {
            contentType = 'image/png';
        } else if (lowerPath.endsWith('.gif')) {
            contentType = 'image/gif';
        } else if (lowerPath.endsWith('.webp')) {
            contentType = 'image/webp';
        } else if (lowerPath.endsWith('.pdf')) {
            contentType = 'application/pdf';
        }

        console.log('[Storage API] Content-Type:', contentType);
        console.log('[Storage API] Returning file successfully');

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('GET /api/storage error:', error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Error reading file',
            },
            { status: 500 }
        );
    }
}
