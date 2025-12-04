import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function userSeeder(prisma: PrismaClient) {
  console.log('📝 Seeding users table...');

  // Clear existing data (optional)
  await prisma.user.deleteMany();

  const users = [
    {
      email: 'admin@gmail.com',
      password: 'admin123456',
      name: 'Admin Sudin',
    },
    {
      email: 'user@gmail.com',
      password: 'user123456',
      name: 'User Sudin',
    },
  ];

  for (const user of users) {
    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

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
}