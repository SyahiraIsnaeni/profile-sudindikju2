import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, normalize } from 'path';
import { existsSync } from 'fs';

interface Params {
  path: string[];
}

/**
 * GET /api/storage/[...path]
 * Serve files dari public/storage directory
 * 
 * Usage: GET /api/storage/profil-instansi/struktur-organisasi/1234-foto.jpg
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params;
    const pathname = resolvedParams.path?.join('/') || '';

    console.log('[Storage API] Params:', resolvedParams);
    console.log('[Storage API] Pathname:', pathname);

    if (!pathname) {
      return NextResponse.json(
        { success: false, message: 'Path tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Security: ensure path doesn't try to escape storage directory
    if (pathname.includes('..') || pathname.startsWith('/')) {
      console.warn('[Storage API] Invalid path detected:', pathname);
      return NextResponse.json(
        { success: false, message: 'Invalid path' },
        { status: 400 }
      );
    }

    // Build file path with proper normalization
    const baseDir = process.cwd();
    const storagePath = normalize(join(baseDir, 'public', 'storage'));
    const filePath = normalize(join(storagePath, pathname));

    console.log('[Storage API] Base dir:', baseDir);
    console.log('[Storage API] Storage path:', storagePath);
    console.log('[Storage API] Full file path:', filePath);

    // Verify file is within storage directory (normalize paths for comparison)
    const normalizedFilePath = filePath.replace(/\\/g, '/').toLowerCase();
    const normalizedStoragePath = storagePath.replace(/\\/g, '/').toLowerCase();

    if (!normalizedFilePath.startsWith(normalizedStoragePath)) {
      console.warn('[Storage API] Security check failed - path escaping attempt');
      console.warn('[Storage API] Normalized file path:', normalizedFilePath);
      console.warn('[Storage API] Normalized storage path:', normalizedStoragePath);
      return NextResponse.json(
        { success: false, message: 'Access denied' },
        { status: 403 }
      );
    }

    // Check if file exists
    console.log('[Storage API] Checking file exists...');
    if (!existsSync(filePath)) {
      console.error('[Storage API] File not found at:', filePath);
      return NextResponse.json(
        { success: false, message: 'File not found' },
        { status: 404 }
      );
    }

    console.log('[Storage API] File found, reading...');

    // Read file
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
    console.error('[Storage API] GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error reading file',
      },
      { status: 500 }
    );
  }
}
