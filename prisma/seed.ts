import { exec } from 'child_process';
import { promisify } from 'util';
import { runAllSeeders } from './seeders';

const execAsync = promisify(exec);

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Generate Prisma Client dulu
    console.log('⚙️ Generating Prisma Client...');
    // await execAsync('npx prisma generate'); // Skip - already generated on npm install
    
    await runAllSeeders();
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();