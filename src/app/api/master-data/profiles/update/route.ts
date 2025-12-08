import { NextRequest, NextResponse } from 'next/server';
import { ProfileController } from '@/modules/controllers/profiles/ProfileController';

const controller = new ProfileController();

/**
 * PUT /api/master-data/profiles/update
 * Update profile (visi misi, struktur org, maklumat, tugas fungsi)
 */
export async function PUT(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';
        const id = 1; // Default profile ID

        // Handle JSON request (untuk deskripsi motto, visi misi, tugas fungsi)
        if (contentType.includes('application/json')) {
            const body = await request.json();
            const { type, description, vision, mission, motto, task_org, function_org } = body;

            if (!type) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Type tidak boleh kosong (deskripsi-motto, visi-misi, tugas-fungsi)',
                        data: null,
                    },
                    { status: 400 }
                );
            }

            let result;

            if (type === 'deskripsi-motto') {
                result = await controller.updateDeskripsiMotto(id, { description, motto });
            } else if (type === 'visi-misi') {
                result = await controller.updateVisiMisi(id, { vision, mission });
            } else if (type === 'tugas-fungsi') {
                result = await controller.updateTugasFungsi(id, { task_org, function_org });
            } else {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Type tidak valid',
                        data: null,
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    message: 'Profile berhasil diupdate',
                    data: result,
                },
                { status: 200 }
            );
        }

        // Handle FormData request (untuk upload file: struktur org, maklumat)
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const type = formData.get('type') as string;
            const file = formData.get('file') as File;

            if (!type) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Type tidak boleh kosong (struktur-org, maklumat)',
                        data: null,
                    },
                    { status: 400 }
                );
            }

            if (!file) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'File tidak ditemukan',
                        data: null,
                    },
                    { status: 400 }
                );
            }

            // Validate file type (image only)
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'File harus berupa gambar (JPG, PNG, GIF, dll)',
                        data: null,
                    },
                    { status: 400 }
                );
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Ukuran file maksimal 5MB',
                        data: null,
                    },
                    { status: 400 }
                );
            }

            // Convert file to base64 (untuk simpan di database)
            const buffer = await file.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            const fileData = `data:${file.type};base64,${base64}`;

            let result;

            if (type === 'struktur-org') {
                result = await controller.updateStrukturOrganisasi(id, fileData);
            } else if (type === 'maklumat') {
                result = await controller.updateMaklumatOrganisasi(id, fileData);
            } else {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Type tidak valid',
                        data: null,
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    message: 'Profile berhasil diupdate',
                    data: result,
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Content-Type tidak didukung',
                data: null,
            },
            { status: 400 }
        );
    } catch (error) {
        console.error('PUT /api/master-data/profiles/update error:', error);
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
