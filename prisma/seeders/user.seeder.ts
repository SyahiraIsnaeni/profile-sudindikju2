import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

export async function seedUser(prisma: PrismaClient) {
  try {
    console.log('📝 Seeding users table...');

    // Get admin role dari database
    const adminRole = await prisma.role.findUnique({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      throw new Error('Admin role not found. Please run role seeder first.');
    }

    const users = [
      {
        email: 'admin@gmail.com',
        password: 'admin123456',
        name: 'Admin Sudin',
        role_id: adminRole.id,
        status: 1,
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcryptjs.hash(user.password, 10);

      const created = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          password: hashedPassword,
          name: user.name,
          role_id: user.role_id,
          status: user.status,
        },
      });

      console.log(`  ✓ Created user: ${created.email}`);
    }

    console.log(`📊 Total users seeded: ${users.length}`);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}
