import { NextRequest, NextResponse } from 'next/server';
import { ProfileController } from '@/modules/controllers/profiles/ProfileController';
import { saveFileToStorage, deleteFileFromStorage } from '@/shared/utils/fileStorage';

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

            // Tentukan subfolder berdasarkan tipe
            let subfolder = '';
            if (type === 'struktur-org') {
                subfolder = 'profil-instansi/struktur-organisasi';
            } else if (type === 'maklumat') {
                subfolder = 'profil-instansi/maklumat';
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

            // Simpan file ke storage dan dapatkan path
            console.log('\n=== [API] Starting file upload ===');
            console.log('[API] Type:', type);
            console.log('[API] File name:', file.name);
            console.log('[API] File size:', file.size);
            console.log('[API] Content-type:', file.type);
            console.log('[API] Subfolder:', subfolder);
            
            let filePath: string;
            try {
                console.log('[API] Calling saveFileToStorage...');
                filePath = await saveFileToStorage(file, subfolder);
                console.log('[API] File saved successfully. Path:', filePath);
            } catch (saveError) {
                console.error('\n[API] ERROR in saveFileToStorage:', saveError);
                if (saveError instanceof Error) {
                    console.error('[API] Error message:', saveError.message);
                    console.error('[API] Error stack:', saveError.stack);
                }
                console.error('[API] End error log\n');
                
                return NextResponse.json(
                    {
                        success: false,
                        message: saveError instanceof Error 
                            ? saveError.message 
                            : 'Gagal menyimpan file ke storage',
                        data: null,
                    },
                    { status: 500 }
                );
            }

            let result;

            if (type === 'struktur-org') {
                result = await controller.updateStrukturOrganisasi(id, filePath);
            } else if (type === 'maklumat') {
                result = await controller.updateMaklumatOrganisasi(id, filePath);
            }

            console.log('=== File upload completed successfully ===');
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
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
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
