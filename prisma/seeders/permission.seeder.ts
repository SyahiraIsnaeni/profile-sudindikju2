import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPermission() {
  try {
    console.log('📝 Seeding permissions table...');

    const permissions = [
      { name: 'create_user' },
      { name: 'edit_user' },
      { name: 'delete_user' },
      { name: 'view_user' },
      { name: 'create_role' },
      { name: 'edit_role' },
      { name: 'delete_role' },
      { name: 'view_role' },
    ];

    for (const permission of permissions) {
      const created = await prisma.permission.upsert({
        where: { name: permission.name },
        update: {},
        create: {
          name: permission.name,
        },
      });

      console.log(`  ✓ Created permission: ${created.name}`);
    }

    console.log(`📊 Total permissions seeded: ${permissions.length}`);
  } catch (error) {
    console.error('❌ Error seeding permissions:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}