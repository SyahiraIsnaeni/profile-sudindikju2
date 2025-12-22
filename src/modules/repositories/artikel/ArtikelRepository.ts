import { PrismaClient } from '@prisma/client';
import { CreateArtikelDTO, UpdateArtikelDTO, ArtikelQueryDTO } from '@/modules/dtos/artikel';

const prisma = new PrismaClient();

export class ArtikelRepository {
    /**
     * Get all artikel with pagination and filtering
     */
    async getAll(query: ArtikelQueryDTO) {
        try {
            const skip = (query.page - 1) * query.pageSize;

            const where: any = {
                deleted_at: null,
            };

            if (query.search) {
                where.OR = [
                    { judul: { contains: query.search, mode: 'insensitive' } },
                    { deskripsi: { contains: query.search, mode: 'insensitive' } },
                    { penulis: { contains: query.search, mode: 'insensitive' } },
                ];
            }

            if (query.status !== undefined) {
                where.status = query.status;
            }

            if (query.kategori) {
                where.kategori = query.kategori;
            }

            const [artikels, total] = await Promise.all([
                prisma.artikel.findMany({
                    where,
                    skip,
                    take: query.pageSize,
                    orderBy: { tanggal: 'desc' },
                }),
                prisma.artikel.count({ where }),
            ]);

            return {
                artikels,
                total,
                page: query.page,
                pageSize: query.pageSize,
                totalPages: Math.ceil(total / query.pageSize),
            };
        } catch (error) {
            console.error('[ArtikelRepository] Error fetching artikels:', error);
            throw error;
        }
    }

    /**
     * Get artikel by ID
     */
    async getById(artikelId: number) {
        try {
            if (!artikelId || artikelId <= 0) {
                throw new Error('ID artikel tidak valid');
            }

            const artikel = await prisma.artikel.findUnique({
                where: { id: artikelId },
            });

            if (!artikel) {
                throw new Error('Artikel tidak ditemukan');
            }

            if (artikel.deleted_at) {
                throw new Error('Artikel sudah dihapus');
            }

            return artikel;
        } catch (error) {
            console.error('[ArtikelRepository] Error fetching artikel by ID:', error);
            throw error;
        }
    }

    /**
     * Create new artikel
     */
    async create(dto: CreateArtikelDTO) {
        try {
            const artikel = await prisma.artikel.create({
                data: {
                    judul: dto.judul,
                    deskripsi: dto.deskripsi || null,
                    kategori: dto.kategori || null,
                    gambar: dto.gambar || null,
                    file: dto.file || null,
                    penulis: dto.penulis || null,
                    tanggal: dto.tanggal,
                    status: dto.status,
                },
            });

            return artikel;
        } catch (error) {
            console.error('[ArtikelRepository] Error creating artikel:', error);
            throw error;
        }
    }

    /**
     * Update artikel
     */
    async update(artikelId: number, dto: UpdateArtikelDTO) {
        try {
            if (!artikelId || artikelId <= 0) {
                throw new Error('ID artikel tidak valid');
            }

            // Check if artikel exists
            const existingArtikel = await prisma.artikel.findUnique({
                where: { id: artikelId },
            });

            if (!existingArtikel) {
                throw new Error('Artikel tidak ditemukan');
            }

            const updateData: any = {};

            if (dto.judul !== undefined) updateData.judul = dto.judul;
            if (dto.deskripsi !== undefined) updateData.deskripsi = dto.deskripsi;
            if (dto.kategori !== undefined) updateData.kategori = dto.kategori;
            if (dto.gambar !== undefined) updateData.gambar = dto.gambar;
            if (dto.file !== undefined) updateData.file = dto.file;
            if (dto.penulis !== undefined) updateData.penulis = dto.penulis;
            if (dto.tanggal !== undefined) updateData.tanggal = dto.tanggal;
            if (dto.status !== undefined) updateData.status = dto.status;

            const updatedArtikel = await prisma.artikel.update({
                where: { id: artikelId },
                data: updateData,
            });

            return updatedArtikel;
        } catch (error) {
            console.error('[ArtikelRepository] Error updating artikel:', error);
            throw error;
        }
    }

    /**
     * Delete artikel (soft delete)
     */
    async delete(artikelId: number) {
        try {
            if (!artikelId || artikelId <= 0) {
                throw new Error('ID artikel tidak valid');
            }

            // Check if artikel exists
            const existingArtikel = await prisma.artikel.findUnique({
                where: { id: artikelId },
            });

            if (!existingArtikel) {
                throw new Error('Artikel tidak ditemukan');
            }

            await prisma.artikel.update({
                where: { id: artikelId },
                data: { deleted_at: new Date() },
            });

            return { success: true };
        } catch (error) {
            console.error('[ArtikelRepository] Error deleting artikel:', error);
            throw error;
        }
    }

    /**
     * Get artikel count by status
     */
    async getCountByStatus(status: number) {
        try {
            const count = await prisma.artikel.count({
                where: {
                    status,
                    deleted_at: null,
                },
            });

            return count;
        } catch (error) {
            console.error('[ArtikelRepository] Error getting count by status:', error);
            throw error;
        }
    }

    /**
     * Get all available kategoris
     */
    async getAllKategoris() {
        try {
            const kategoris = await prisma.artikel.findMany({
                distinct: ['kategori'],
                where: {
                    deleted_at: null,
                    kategori: { not: null },
                },
                select: {
                    kategori: true,
                },
                orderBy: {
                    kategori: 'asc',
                },
            });

            return kategoris.map(k => k.kategori).filter(k => k !== null);
        } catch (error) {
            console.error('[ArtikelRepository] Error getting kategoris:', error);
            throw error;
        }
    }
}
