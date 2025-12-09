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

        // Build file path
        const filePath = join(process.cwd(), 'public', 'storage', pathname);
        const storagePath = join(process.cwd(), 'public', 'storage');

        // Verify file is within storage directory
        if (!filePath.startsWith(storagePath)) {
            return NextResponse.json(
                { success: false, message: 'Access denied' },
                { status: 403 }
            );
        }

        // Check if file exists
        if (!existsSync(filePath)) {
            return NextResponse.json(
                { success: false, message: 'File not found' },
                { status: 404 }
            );
        }

        // Read file
        const fileBuffer = await readFile(filePath);

        // Determine content type
        let contentType = 'application/octet-stream';
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
        } else if (filePath.endsWith('.png')) {
            contentType = 'image/png';
        } else if (filePath.endsWith('.gif')) {
            contentType = 'image/gif';
        } else if (filePath.endsWith('.webp')) {
            contentType = 'image/webp';
        } else if (filePath.endsWith('.pdf')) {
            contentType = 'application/pdf';
        }

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
