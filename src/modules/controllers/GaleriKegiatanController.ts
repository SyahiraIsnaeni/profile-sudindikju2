import { GaleriKegiatanRepository } from '@/modules/repositories/GaleriKegiatanRepository';
import {
    CreateGaleriKegiatanDTO,
    UpdateGaleriKegiatanDTO,
    GaleriKegiatanQueryDTO,
} from '@/modules/dtos/galeri-kegiatan';

export class GaleriKegiatanController {
    /**
     * Get all galeri kegiatan
     */
    static async getAll(query: GaleriKegiatanQueryDTO) {
        try {
            const result = await GaleriKegiatanRepository.getAll(query);
            return result;
        } catch (error) {
            console.error('[GaleriKegiatanController] Error getting all:', error);
            throw error;
        }
    }

    /**
     * Get single galeri kegiatan
     */
    static async getById(id: number) {
        try {
            if (id <= 0) {
                throw new Error('ID tidak valid');
            }

            const result = await GaleriKegiatanRepository.getById(id);

            if (!result) {
                throw new Error('Galeri kegiatan tidak ditemukan');
            }

            return result;
        } catch (error) {
            console.error('[GaleriKegiatanController] Error getting by id:', error);
            throw error;
        }
    }

    /**
     * Create new galeri kegiatan
     */
    static async create(dto: CreateGaleriKegiatanDTO) {
        try {
            // Validate
            if (!dto.judul || dto.judul.trim() === '') {
                throw new Error('Judul wajib diisi');
            }

            const result = await GaleriKegiatanRepository.create(dto);
            return result;
        } catch (error) {
            console.error('[GaleriKegiatanController] Error creating:', error);
            throw error;
        }
    }

    /**
     * Update galeri kegiatan
     */
    static async update(id: number, dto: UpdateGaleriKegiatanDTO) {
        try {
            if (id <= 0) {
                throw new Error('ID tidak valid');
            }

            // Check if exists
            const existing = await GaleriKegiatanRepository.getById(id);
            if (!existing) {
                throw new Error('Galeri kegiatan tidak ditemukan');
            }

            const result = await GaleriKegiatanRepository.update(id, dto);
            return result;
        } catch (error) {
            console.error('[GaleriKegiatanController] Error updating:', error);
            throw error;
        }
    }

    /**
     * Delete galeri kegiatan (soft delete)
     */
    static async delete(id: number) {
        try {
            if (id <= 0) {
                throw new Error('ID tidak valid');
            }

            // Check if exists
            const existing = await GaleriKegiatanRepository.getById(id);
            if (!existing) {
                throw new Error('Galeri kegiatan tidak ditemukan');
            }

            const result = await GaleriKegiatanRepository.delete(id);
            return result;
        } catch (error) {
            console.error('[GaleriKegiatanController] Error deleting:', error);
            throw error;
        }
    }
}
