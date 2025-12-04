import { PrismaClient } from '@prisma/client';
import { UserMasterDTO, RoleMasterDTO, PermissionMasterDTO } from '../dtos/MasterDataDTO';

export class MasterDataRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllUsers(): Promise<UserMasterDTO[]> {
    const users = await this.prisma.user.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return users;
  }

  async getAllRoles(): Promise<RoleMasterDTO[]> {
    const roles = await this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
    return roles;
  }

  async getAllPermissions(): Promise<PermissionMasterDTO[]> {
    const permissions = await this.prisma.permission.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    });
    return permissions;
  }

  async getUserById(id: number): Promise<UserMasterDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });
    return user;
  }
}