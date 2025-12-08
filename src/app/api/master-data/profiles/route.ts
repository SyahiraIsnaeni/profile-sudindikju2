import { NextRequest, NextResponse } from 'next/server';
import { ProfileController } from '@/modules/controllers/profiles/ProfileController';

const controller = new ProfileController();

/**
 * GET /api/master-data/profiles
 * Get profile by ID (default 1)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id') ? parseInt(searchParams.get('id')!) : 1;

    const profile = await controller.getProfile(id);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Profile tidak ditemukan',
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile berhasil diambil',
        data: profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/master-data/profiles error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Terjadi kesalahan',
        data: null,
      },
      { status: 500 }
    );
  }
}
