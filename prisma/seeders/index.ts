import { seedUser } from './user.seeder';
import { seedRole } from './role.seeder';
import { seedPermission } from './permission.seeder';
import { seedRolePermissions } from './role_permissions.seeder';

export async function runAllSeeders() {
  await seedRole();
  await seedPermission();
  await seedRolePermissions();
  await seedUser();
}