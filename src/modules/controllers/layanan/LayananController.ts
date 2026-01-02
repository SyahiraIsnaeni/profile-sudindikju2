import { CreateLayananDTO, UpdateLayananDTO, LayananQueryDTO } from '../../dtos/layanan';
import { LayananResponse } from '../../entities/layanan/Layanan';
import { LayananRepository } from '../../repositories/layanan/LayananRepository';

const layananRepository = new LayananRepository();

export class LayananController {
    static async getAll(query: LayananQueryDTO) {
        try {
            const result = await layananRepository.getAll(query);

            const layanansResponse: LayananResponse[] = result.layanans.map((layanan: any) => ({
                id: layanan.id,
                nama: layanan.nama,
                deskripsi: layanan.deskripsi,
                file: layanan.file,
                icon: layanan.icon,
                urutan: layanan.urutan,
                status: layanan.status,
                created_at: layanan.created_at,
                updated_at: layanan.updated_at,
            }));

            return {
                success: true,
                data: layanansResponse,
                meta: {
                    total: result.total,
                    page: result.page,
                    pageSize: result.pageSize,
                    totalPages: result.totalPages,
                },
            };
        } catch (error) {
            console.error('[LayananController] Error in getAll:', error);
            throw error;
        }
    }

    static async getById(layananId: number) {
        try {
            const layanan = await layananRepository.getById(layananId);

            const response: LayananResponse = {
                id: layanan.id,
                nama: layanan.nama,
                deskripsi: layanan.deskripsi,
                file: layanan.file,
                icon: layanan.icon,
                urutan: layanan.urutan,
                status: layanan.status,
                created_at: layanan.created_at,
                updated_at: layanan.updated_at,
            };

            return { success: true, data: response };
        } catch (error) {
            console.error('[LayananController] Error in getById:', error);
            throw error;
        }
    }

    static async create(dto: CreateLayananDTO) {
        try {
            const layanan = await layananRepository.create(dto);

            const response: LayananResponse = {
                id: layanan.id,
                nama: layanan.nama,
                deskripsi: layanan.deskripsi,
                file: layanan.file,
                icon: layanan.icon,
                urutan: layanan.urutan,
                status: layanan.status,
                created_at: layanan.created_at,
                updated_at: layanan.updated_at,
            };

            return {
                success: true,
                data: response,
                message: 'Layanan publik berhasil dibuat',
            };
        } catch (error) {
            console.error('[LayananController] Error in create:', error);
            throw error;
        }
    }

    static async update(layananId: number, dto: UpdateLayananDTO) {
        try {
            const updatedLayanan = await layananRepository.update(layananId, dto);

            const response: LayananResponse = {
                id: updatedLayanan.id,
                nama: updatedLayanan.nama,
                deskripsi: updatedLayanan.deskripsi,
                file: updatedLayanan.file,
                icon: updatedLayanan.icon,
                urutan: updatedLayanan.urutan,
                status: updatedLayanan.status,
                created_at: updatedLayanan.created_at,
                updated_at: updatedLayanan.updated_at,
            };

            return {
                success: true,
                data: response,
                message: 'Layanan publik berhasil diupdate',
            };
        } catch (error) {
            console.error('[LayananController] Error in update:', error);
            throw error;
        }
    }

    static async delete(layananId: number) {
        try {
            await layananRepository.delete(layananId);

            return { success: true, message: 'Layanan publik berhasil dihapus' };
        } catch (error) {
            console.error('[LayananController] Error in delete:', error);
            throw error;
        }
    }
}
