import { PrismaClient } from '@prisma/client';
import { CreateCommitmentDTO, UpdateCommitmentDTO, CommitmentQueryDTO } from '../../dtos/commitments';
import { CommitmentResponse } from '../../entities/commitments/Commitment';

const prisma = new PrismaClient();

export class CommitmentController {
  static async getAll(query: CommitmentQueryDTO) {
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

      const commitmentsResponse: CommitmentResponse[] = commitments.map((commitment) => ({
        id: commitment.id,
        name: commitment.name,
        description: commitment.description,
        file: commitment.file,
        icon: commitment.icon,
        sort_order: commitment.sort_order,
        status: commitment.status,
        created_at: commitment.created_at,
        updated_at: commitment.updated_at,
      }));

      return {
        success: true,
        data: commitmentsResponse,
        meta: {
          total,
          page: query.page,
          pageSize: query.pageSize,
          totalPages: Math.ceil(total / query.pageSize),
        },
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getById(commitmentId: number) {
    try {
      const commitment = await prisma.commitment.findUnique({
        where: { id: commitmentId },
      });

      if (!commitment) {
        throw new Error('Komitmen pelayanan tidak ditemukan');
      }

      if (commitment.deleted_at) {
        throw new Error('Komitmen pelayanan sudah dihapus');
      }

      const response: CommitmentResponse = {
        id: commitment.id,
        name: commitment.name,
        description: commitment.description,
        file: commitment.file,
        icon: commitment.icon,
        sort_order: commitment.sort_order,
        status: commitment.status,
        created_at: commitment.created_at,
        updated_at: commitment.updated_at,
      };

      return { success: true, data: response };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async create(dto: CreateCommitmentDTO) {
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

      const response: CommitmentResponse = {
        id: commitment.id,
        name: commitment.name,
        description: commitment.description,
        file: commitment.file,
        icon: commitment.icon,
        sort_order: commitment.sort_order,
        status: commitment.status,
        created_at: commitment.created_at,
        updated_at: commitment.updated_at,
      };

      return {
        success: true,
        data: response,
        message: 'Komitmen pelayanan berhasil dibuat',
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async update(commitmentId: number, dto: UpdateCommitmentDTO) {
    try {
      const commitment = await prisma.commitment.findUnique({
        where: { id: commitmentId },
      });

      if (!commitment) {
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

      const response: CommitmentResponse = {
        id: updatedCommitment.id,
        name: updatedCommitment.name,
        description: updatedCommitment.description,
        file: updatedCommitment.file,
        icon: updatedCommitment.icon,
        sort_order: updatedCommitment.sort_order,
        status: updatedCommitment.status,
        created_at: updatedCommitment.created_at,
        updated_at: updatedCommitment.updated_at,
      };

      return {
        success: true,
        data: response,
        message: 'Komitmen pelayanan berhasil diupdate',
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async delete(commitmentId: number) {
    try {
      const commitment = await prisma.commitment.findUnique({
        where: { id: commitmentId },
      });

      if (!commitment) {
        throw new Error('Komitmen pelayanan tidak ditemukan');
      }

      await prisma.commitment.update({
        where: { id: commitmentId },
        data: { deleted_at: new Date() },
      });

      return { success: true, message: 'Komitmen pelayanan berhasil dihapus' };
    } finally {
      await prisma.$disconnect();
    }
  }
}
