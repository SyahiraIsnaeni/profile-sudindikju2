import { PrismaClient } from '@prisma/client';
import { userSeeder } from './seeders/index';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await userSeeder(prisma);
    console.log('\n✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();