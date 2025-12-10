import { PrismaClient } from '@prisma/client';
import { CreateCommitmentDTO, UpdateCommitmentDTO, CommitmentQueryDTO } from '@/modules/dtos/commitments';

const prisma = new PrismaClient();

export class CommitmentRepository {
    /**
     * Get all commitments with pagination and filtering
     */
    async getAll(query: CommitmentQueryDTO) {
        try {
            const skip = (query.page - 1) * query.pageSize;

            const where: any = {
                deleted_at: null,
            };

            if (query.search) {
                where.OR = [
                    { name: { contains: query.search, mode: 'insensitive' } },
                    { description: { contains: query.search, mode: 'insensitive' } },
                ];
            }

            if (query.status !== undefined) {
                where.status = query.status;
            }

            const [commitments, total] = await Promise.all([
                prisma.commitment.findMany({
                    where,
                    skip,
                    take: query.pageSize,
                    orderBy: { sort_order: 'asc' },
                }),
                prisma.commitment.count({ where }),
            ]);

            return {
                commitments,
                total,
                page: query.page,
                pageSize: query.pageSize,
                totalPages: Math.ceil(total / query.pageSize),
            };
        } catch (error) {
            console.error('[CommitmentRepository] Error fetching commitments:', error);
            throw error;
        }
    }

    /**
     * Get commitment by ID
     */
    async getById(commitmentId: number) {
        try {
            if (!commitmentId || commitmentId <= 0) {
                throw new Error('ID komitmen tidak valid');
            }

            const commitment = await prisma.commitment.findUnique({
                where: { id: commitmentId },
            });

            if (!commitment) {
                throw new Error('Komitmen pelayanan tidak ditemukan');
            }

            if (commitment.deleted_at) {
                throw new Error('Komitmen pelayanan sudah dihapus');
            }

            return commitment;
        } catch (error) {
            console.error('[CommitmentRepository] Error fetching commitment by ID:', error);
            throw error;
        }
    }

    /**
     * Create new commitment
     */
    async create(dto: CreateCommitmentDTO) {
        try {
            const commitment = await prisma.commitment.create({
                data: {
                    name: dto.name,
                    description: dto.description || null,
                    file: dto.file || null,
                    icon: dto.icon || null,
                    sort_order: dto.sort_order || null,
                    status: dto.status,
                },
            });

            return commitment;
        } catch (error) {
            console.error('[CommitmentRepository] Error creating commitment:', error);
            throw error;
        }
    }

    /**
     * Update commitment
     */
    async update(commitmentId: number, dto: UpdateCommitmentDTO) {
        try {
            if (!commitmentId || commitmentId <= 0) {
                throw new Error('ID komitmen tidak valid');
            }

            // Check if commitment exists
            const existingCommitment = await prisma.commitment.findUnique({
                where: { id: commitmentId },
            });

            if (!existingCommitment) {
                throw new Error('Komitmen pelayanan tidak ditemukan');
            }

            const updateData: any = {};

            if (dto.name !== undefined) updateData.name = dto.name;
            if (dto.description !== undefined) updateData.description = dto.description;
            if (dto.file !== undefined) updateData.file = dto.file;
            if (dto.icon !== undefined) updateData.icon = dto.icon;
            if (dto.sort_order !== undefined) updateData.sort_order = dto.sort_order;
            if (dto.status !== undefined) updateData.status = dto.status;

            const updatedCommitment = await prisma.commitment.update({
                where: { id: commitmentId },
                data: updateData,
            });

            return updatedCommitment;
        } catch (error) {
            console.error('[CommitmentRepository] Error updating commitment:', error);
            throw error;
        }
    }

    /**
     * Delete commitment (soft delete)
     */
    async delete(commitmentId: number) {
        try {
            if (!commitmentId || commitmentId <= 0) {
                throw new Error('ID komitmen tidak valid');
            }

            // Check if commitment exists
            const existingCommitment = await prisma.commitment.findUnique({
                where: { id: commitmentId },
            });

            if (!existingCommitment) {
                throw new Error('Komitmen pelayanan tidak ditemukan');
            }

            await prisma.commitment.update({
                where: { id: commitmentId },
                data: { deleted_at: new Date() },
            });

            return { success: true };
        } catch (error) {
            console.error('[CommitmentRepository] Error deleting commitment:', error);
            throw error;
        }
    }

    /**
     * Get commitment count by status
     */
    async getCountByStatus(status: number) {
        try {
            const count = await prisma.commitment.count({
                where: {
                    status,
                    deleted_at: null,
                },
            });

            return count;
        } catch (error) {
            console.error('[CommitmentRepository] Error getting count by status:', error);
            throw error;
        }
    }

    /**
     * Get max sort order
     */
    async getMaxSortOrder() {
        try {
            const result = await prisma.commitment.aggregate({
                _max: {
                    sort_order: true,
                },
                where: {
                    deleted_at: null,
                },
            });

            return result._max.sort_order || 0;
        } catch (error) {
            console.error('[CommitmentRepository] Error getting max sort order:', error);
            throw error;
        }
    }
}
