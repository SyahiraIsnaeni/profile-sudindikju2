import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { CreateUserDTO, UpdateUserDTO, UserQueryDTO } from '../../dtos/users';
import { UserResponse } from '../../entities/users/User';

const prisma = new PrismaClient();

export class UserController {
  static async getAll(query: UserQueryDTO) {
    try {
      const skip = (query.page - 1) * query.pageSize;

      const where: any = {
        deleted_at: null,
      };

      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      if (query.status !== undefined) {
        where.status = query.status;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: { role: true },
          skip,
          take: query.pageSize,
          orderBy: { created_at: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      const usersResponse: UserResponse[] = users.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role: user.role
          ? { id: user.role.id, name: user.role.name }
          : null,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));

      return {
        success: true,
        data: usersResponse,
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

  static async getById(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      if (user.deleted_at) {
        throw new Error('User sudah dihapus');
      }

      const response: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role: user.role
          ? { id: user.role.id, name: user.role.name }
          : null,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return { success: true, data: response };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async create(dto: CreateUserDTO) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new Error('Email sudah terdaftar');
      }

      const hashedPassword = await bcryptjs.hash(dto.password, 10);

      const user = await prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role_id: dto.role_id || null,
          status: dto.status,
        },
        include: { role: true },
      });

      const response: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role: user.role
          ? { id: user.role.id, name: user.role.name }
          : null,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      return {
        success: true,
        data: response,
        message: 'User berhasil dibuat',
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async update(userId: number, dto: UpdateUserDTO) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      if (dto.email && dto.email !== user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: dto.email },
        });

        if (existingUser) {
          throw new Error('Email sudah terdaftar');
        }
      }

      const updateData: any = {};

      if (dto.name) updateData.name = dto.name;
      if (dto.email) updateData.email = dto.email;
      if (dto.password) {
        updateData.password = await bcryptjs.hash(dto.password, 10);
      }
      if (dto.role_id !== undefined) updateData.role_id = dto.role_id;
      if (dto.status !== undefined) updateData.status = dto.status;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: { role: true },
      });

      const response: UserResponse = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role_id: updatedUser.role_id,
        role: updatedUser.role
          ? { id: updatedUser.role.id, name: updatedUser.role.name }
          : null,
        status: updatedUser.status,
        created_at: updatedUser.created_at,
        updated_at: updatedUser.updated_at,
      };

      return {
        success: true,
        data: response,
        message: 'User berhasil diupdate',
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async delete(userId: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      await prisma.user.update({
        where: { id: userId },
        data: { deleted_at: new Date() },
      });

      return { success: true, message: 'User berhasil dihapus' };
    } finally {
      await prisma.$disconnect();
    }
  }
}
