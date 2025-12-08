import { PrismaClient } from '@prisma/client';
import { PermissionDTO, GroupedPermissionsDTO } from '../../dtos/permissions';

const prisma = new PrismaClient();

export class PermissionController {
  static async getAll() {
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: [{ name: 'asc' }, { detail: 'asc' }],
      });

      const groupedPermissions: GroupedPermissionsDTO = {};

      permissions.forEach((perm) => {
        if (!groupedPermissions[perm.name]) {
          groupedPermissions[perm.name] = [];
        }
        groupedPermissions[perm.name].push({
          id: perm.id,
          name: perm.name,
          detail: perm.detail,
        });
      });

      return {
        success: true,
        data: groupedPermissions,
      };
    } catch (error) {
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  static async getAllFlat() {
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: [{ name: 'asc' }, { detail: 'asc' }],
      });

      return {
        success: true,
        data: permissions.map((perm) => ({
          id: perm.id,
          name: perm.name,
          detail: perm.detail,
        })),
      };
    } catch (error) {
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}