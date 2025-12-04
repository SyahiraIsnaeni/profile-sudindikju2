import { seedUser } from './user.seeder';
import { seedRole } from './role.seeder';

export async function runAllSeeders() {
  await seedRole();
  await seedUser();
}