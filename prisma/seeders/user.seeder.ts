import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedUser() {
  try {
    console.log('📝 Seeding users table...');

    const users = [
      {
        email: 'admin@gmail.com',
        password: 'admin123456',
        name: 'Admin Sudin',
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

// Main function - untuk direct execution
async function main() {
  try {
    await seedUser();
  } finally {
    await prisma.$disconnect();
  }
}

// Run jika file dijalankan langsung
main().catch((e) => {
  console.error(e);
  process.exit(1);
});