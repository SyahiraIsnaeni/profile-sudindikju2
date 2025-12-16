import { PrismaClient } from '@prisma/client';
import { CreateLayananDTO, UpdateLayananDTO, LayananQueryDTO } from '@/modules/dtos/layanan';

const prisma = new PrismaClient();

export class LayananRepository {
    /**
     * Get all layanan with pagination and filtering
     */
    async getAll(query: LayananQueryDTO) {
        try {
            const skip = (query.page - 1) * query.pageSize;

            const where: any = {
                deleted_at: null,
            };

            if (query.search) {
                where.OR = [
                    { nama: { contains: query.search, mode: 'insensitive' } },
                    { deskripsi: { contains: query.search, mode: 'insensitive' } },
                ];
            }

            if (query.status !== undefined) {
                where.status = query.status;
            }

            const [layanans, total] = await Promise.all([
                prisma.layanan.findMany({
                    where,
                    skip,
                    take: query.pageSize,
                    orderBy: { urutan: 'asc' },
                }),
                prisma.layanan.count({ where }),
            ]);

            return {
                layanans,
                total,
                page: query.page,
                pageSize: query.pageSize,
                totalPages: Math.ceil(total / query.pageSize),
            };
        } catch (error) {
            console.error('[LayananRepository] Error fetching layanans:', error);
            throw error;
        }
    }

    /**
     * Get layanan by ID
     */
    async getById(layananId: number) {
        try {
            if (!layananId || layananId <= 0) {
                throw new Error('ID layanan tidak valid');
            }

            const layanan = await prisma.layanan.findUnique({
                where: { id: layananId },
            });

            if (!layanan) {
                throw new Error('Layanan publik tidak ditemukan');
            }

            if (layanan.deleted_at) {
                throw new Error('Layanan publik sudah dihapus');
            }

            return layanan;
        } catch (error) {
            console.error('[LayananRepository] Error fetching layanan by ID:', error);
            throw error;
        }
    }

    /**
     * Create new layanan
     */
    async create(dto: CreateLayananDTO) {
        try {
            const layanan = await prisma.layanan.create({
                data: {
                    nama: dto.nama,
                    deskripsi: dto.deskripsi || null,
                    file: dto.file || null,
                    icon: dto.icon || null,
                    urutan: dto.urutan || null,
                    status: dto.status,
                },
            });

            return layanan;
        } catch (error) {
            console.error('[LayananRepository] Error creating layanan:', error);
            throw error;
        }
    }

    /**
     * Update layanan
     */
    async update(layananId: number, dto: UpdateLayananDTO) {
        try {
            if (!layananId || layananId <= 0) {
                throw new Error('ID layanan tidak valid');
            }

            // Check if layanan exists
            const existingLayanan = await prisma.layanan.findUnique({
                where: { id: layananId },
            });

            if (!existingLayanan) {
                throw new Error('Layanan publik tidak ditemukan');
            }

            const updateData: any = {};

            if (dto.nama !== undefined) updateData.nama = dto.nama;
            if (dto.deskripsi !== undefined) updateData.deskripsi = dto.deskripsi;
            if (dto.file !== undefined) updateData.file = dto.file;
            if (dto.icon !== undefined) updateData.icon = dto.icon;
            if (dto.urutan !== undefined) updateData.urutan = dto.urutan;
            if (dto.status !== undefined) updateData.status = dto.status;

            const updatedLayanan = await prisma.layanan.update({
                where: { id: layananId },
                data: updateData,
            });

            return updatedLayanan;
        } catch (error) {
            console.error('[LayananRepository] Error updating layanan:', error);
            throw error;
        }
    }

    /**
     * Delete layanan (soft delete)
     */
    async delete(layananId: number) {
        try {
            if (!layananId || layananId <= 0) {
                throw new Error('ID layanan tidak valid');
            }

            // Check if layanan exists
            const existingLayanan = await prisma.layanan.findUnique({
                where: { id: layananId },
            });

            if (!existingLayanan) {
                throw new Error('Layanan publik tidak ditemukan');
            }

            await prisma.layanan.update({
                where: { id: layananId },
                data: { deleted_at: new Date() },
            });

            return { success: true };
        } catch (error) {
            console.error('[LayananRepository] Error deleting layanan:', error);
            throw error;
        }
    }

    /**
     * Get layanan count by status
     */
    async getCountByStatus(status: number) {
        try {
            const count = await prisma.layanan.count({
                where: {
                    status,
                    deleted_at: null,
                },
            });

            return count;
        } catch (error) {
            console.error('[LayananRepository] Error getting count by status:', error);
            throw error;
        }
    }

    /**
     * Get max urutan (sort order)
     */
    async getMaxUrutan() {
        try {
            const result = await prisma.layanan.aggregate({
                _max: {
                    urutan: true,
                },
                where: {
                    deleted_at: null,
                },
            });

            return result._max.urutan || 0;
        } catch (error) {
            console.error('[LayananRepository] Error getting max urutan:', error);
            throw error;
        }
    }
}
