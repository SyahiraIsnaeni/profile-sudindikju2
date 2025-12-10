import { PrismaClient } from '@prisma/client';
import { GaleriKegiatan } from '@/modules/entities/GaleriKegiatan';
import {
    CreateGaleriKegiatanDTO,
    UpdateGaleriKegiatanDTO,
    GaleriKegiatanQueryDTO,
} from '@/modules/dtos/galeri-kegiatan';

const prisma = new PrismaClient();

export class GaleriKegiatanRepository {
    /**
     * Get all galeri kegiatan with pagination
     */
    static async getAll(query: GaleriKegiatanQueryDTO) {
        const skip = (query.page - 1) * query.pageSize;
        const take = query.pageSize;

        const where: any = {
            deleted_at: null,
        };

        if (query.search) {
            where.judul = {
                contains: query.search,
                mode: 'insensitive',
            };
        }

        if (query.status !== undefined) {
            where.status = query.status;
        }

        const [data, total] = await Promise.all([
            prisma.galeriKegiatan.findMany({
                where,
                skip,
                take,
                orderBy: {
                    created_at: 'desc',
                },
            }),
            prisma.galeriKegiatan.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page: query.page,
                pageSize: query.pageSize,
                totalPages: Math.ceil(total / query.pageSize),
            },
        };
    }

    /**
     * Get single galeri kegiatan by ID
     */
    static async getById(id: number) {
        return prisma.galeriKegiatan.findUnique({
            where: { id },
        });
    }

    /**
     * Create new galeri kegiatan
     */
    static async create(dto: CreateGaleriKegiatanDTO) {
        return prisma.galeriKegiatan.create({
            data: {
                judul: dto.judul,
                foto: dto.foto || null,
                status: dto.status,
            },
        });
    }

    /**
     * Update galeri kegiatan
     */
    static async update(id: number, dto: UpdateGaleriKegiatanDTO) {
        return prisma.galeriKegiatan.update({
            where: { id },
            data: {
                ...(dto.judul && { judul: dto.judul }),
                ...(dto.foto !== undefined && { foto: dto.foto }),
                ...(dto.status !== undefined && { status: dto.status }),
                updated_at: new Date(),
            },
        });
    }

    /**
     * Delete (soft delete) galeri kegiatan
     */
    static async delete(id: number) {
        return prisma.galeriKegiatan.update({
            where: { id },
            data: {
                deleted_at: new Date(),
            },
        });
    }

    /**
     * Permanently delete galeri kegiatan
     */
    static async hardDelete(id: number) {
        return prisma.galeriKegiatan.delete({
            where: { id },
        });
    }
}
