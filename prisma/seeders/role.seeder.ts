import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRole() {
  try {
    console.log('📝 Seeding roles table...');

    const roles = [
      { name: 'admin', status: 1 },
      { name: 'kasudin', status: 1 },
      { name: 'kasubbag', status: 1 },
      { name: 'kasi', status: 1 },
      { name: 'staf', status: 1 },
    ];

    for (const role of roles) {
      const created = await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: {
          name: role.name,
          status: role.status,
        },
      });

      console.log(`  ✓ Created role: ${created.name}`);
    }

    console.log(`📊 Total roles seeded: ${roles.length}`);
  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}