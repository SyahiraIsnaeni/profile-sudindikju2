import { PrismaClient } from '@prisma/client';

export async function seedPermission(prisma: PrismaClient) {
  try {
    console.log('📝 Seeding permissions...');

    const permissions = [
      // Master Data menu
      { name: 'Master Data', detail: 'view_master_data' },
      { name: 'Master Data', detail: 'create_master_data' },
      { name: 'Master Data', detail: 'edit_master_data' },
      { name: 'Master Data', detail: 'delete_master_data' },

      // Profile menu
      { name: 'Profile', detail: 'view_profile' },
      { name: 'Profile', detail: 'edit_profile' },
      { name: 'Profile', detail: 'create_profile' },
      { name: 'Profile', detail: 'delete_profile' },

      // Dashboard menu
      { name: 'Dashboard', detail: 'view_dashboard' },
    ];

    // Delete existing permissions and related role_permissions
    await prisma.rolePermission.deleteMany({});
    await prisma.permission.deleteMany({});

    // Create permissions
    for (const perm of permissions) {
      await prisma.permission.create({
        data: perm,
      });
    }

    console.log('✅ Permissions seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    throw error;
  }
}