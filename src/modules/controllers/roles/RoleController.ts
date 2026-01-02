import { PrismaClient } from '@prisma/client';
import { CreateRoleDTO, UpdateRoleDTO, RoleQueryDTO } from '../../dtos/roles';
import { RoleResponse } from '../../entities/roles/Role';

const prisma = new PrismaClient();

export class RoleController {
  static async getAll(query: RoleQueryDTO) {
    try {
      const skip = (query.page - 1) * query.pageSize;

      const where: any = {};

      if (query.search) {
        where.name = { contains: query.search, mode: 'insensitive' };
      }

      if (query.status !== undefined) {
        where.status = query.status;
      }

      const [roles, total] = await Promise.all([
        prisma.role.findMany({
          where,
          include: { rolePermissions: { include: { permission: true } } },
          skip,
          take: query.pageSize,
          orderBy: { created_at: 'desc' },
        }),
        prisma.role.count({ where }),
      ]);

      const rolesResponse: RoleResponse[] = roles.map((role: any) => ({
        id: role.id,
        name: role.name,
        status: role.status,
        permissions: role.rolePermissions.map((rp: any) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          detail: rp.permission.detail,
        })),
        created_at: role.created_at,
        updated_at: role.updated_at,
      }));

      return {
        success: true,
        data: rolesResponse,
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

  static async getById(roleId: number) {
    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        include: { rolePermissions: { include: { permission: true } } },
      });

      if (!role) {
        throw new Error('Role tidak ditemukan');
      }

      const response: RoleResponse = {
        id: role.id,
        name: role.name,
        status: role.status,
        permissions: role.rolePermissions.map((rp: any) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          detail: rp.permission.detail,
        })),
        created_at: role.created_at,
        updated_at: role.updated_at,
      };

      return { success: true, data: response };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async create(dto: CreateRoleDTO) {
    try {
      const existingRole = await prisma.role.findUnique({
        where: { name: dto.name },
      });

      if (existingRole) {
        throw new Error('Role sudah ada');
      }

      const role = await prisma.role.create({
        data: {
          name: dto.name,
          status: dto.status,
        },
      });

      for (const permissionId of dto.permission_ids) {
        await prisma.rolePermission.create({
          data: {
            role_id: role.id,
            permission_id: permissionId,
          },
        });
      }

      const roleWithPermissions = await prisma.role.findUnique({
        where: { id: role.id },
        include: { rolePermissions: { include: { permission: true } } },
      });

      const response: RoleResponse = {
        id: roleWithPermissions!.id,
        name: roleWithPermissions!.name,
        status: roleWithPermissions!.status,
        permissions: roleWithPermissions!.rolePermissions.map((rp: any) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          detail: rp.permission.detail,
        })),
        created_at: roleWithPermissions!.created_at,
        updated_at: roleWithPermissions!.updated_at,
      };

      return {
        success: true,
        data: response,
        message: 'Role berhasil dibuat',
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async update(roleId: number, dto: UpdateRoleDTO) {
    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        throw new Error('Role tidak ditemukan');
      }

      if (dto.name && dto.name !== role.name) {
        const existingRole = await prisma.role.findUnique({
          where: { name: dto.name },
        });

        if (existingRole) {
          throw new Error('Role sudah ada');
        }
      }

      const updateData: any = {};
      if (dto.name) updateData.name = dto.name;
      if (dto.status !== undefined) updateData.status = dto.status;

      await prisma.role.update({
        where: { id: roleId },
        data: updateData,
      });

      if (dto.permission_ids && dto.permission_ids.length > 0) {
        await prisma.rolePermission.deleteMany({
          where: { role_id: roleId },
        });

        for (const permissionId of dto.permission_ids) {
          await prisma.rolePermission.create({
            data: {
              role_id: roleId,
              permission_id: permissionId,
            },
          });
        }
      }

      const roleWithPermissions = await prisma.role.findUnique({
        where: { id: roleId },
        include: { rolePermissions: { include: { permission: true } } },
      });

      const response: RoleResponse = {
        id: roleWithPermissions!.id,
        name: roleWithPermissions!.name,
        status: roleWithPermissions!.status,
        permissions: roleWithPermissions!.rolePermissions.map((rp: any) => ({
          id: rp.permission.id,
          name: rp.permission.name,
          detail: rp.permission.detail,
        })),
        created_at: roleWithPermissions!.created_at,
        updated_at: roleWithPermissions!.updated_at,
      };

      return {
        success: true,
        data: response,
        message: 'Role berhasil diupdate',
      };
    } finally {
      await prisma.$disconnect();
    }
  }

  static async delete(roleId: number) {
    try {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        throw new Error('Role tidak ditemukan');
      }

      const usersCount = await prisma.user.count({
        where: { role_id: roleId, deleted_at: null },
      });

      if (usersCount > 0) {
        throw new Error(
          `Role sedang digunakan oleh ${usersCount} user, tidak bisa dihapus`
        );
      }

      await prisma.rolePermission.deleteMany({
        where: { role_id: roleId },
      });

      await prisma.role.delete({
        where: { id: roleId },
      });

      return { success: true, message: 'Role berhasil dihapus' };
    } finally {
      await prisma.$disconnect();
    }
  }
}
