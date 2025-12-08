import { PrismaClient } from '@prisma/client';
import { seedUser } from './user.seeder';
import { seedRole } from './role.seeder';
import { seedPermission } from './permission.seeder';
import { seedRolePermissions } from './role_permissions.seeder';

const prisma = new PrismaClient();

export async function runAllSeeders() {
  try {
    await seedRole(prisma);
    await seedPermission(prisma);
    await seedRolePermissions(prisma);
    await seedUser(prisma);
  } finally {
    await prisma.$disconnect();
  }
}