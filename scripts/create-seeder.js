const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const seederName = args[0];

if (!seederName) {
  console.error('❌ Seeder name required. Usage: npm run create:seeder -- seeder_name');
  process.exit(1);
}

const seederDir = path.join(__dirname, '../prisma/seeders');
const seederFile = path.join(seederDir, `${seederName}.seeder.ts`);

const template = `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed${seederName.charAt(0).toUpperCase() + seederName.slice(1)}() {
  try {
    console.log('📝 Seeding ${seederName}...');
    
    // TODO: Add your seeding logic here
    
    console.log('✅ ${seederName} seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding ${seederName}:', error);
    throw error;
  }
}
`;

if (!fs.existsSync(seederDir)) {
  fs.mkdirSync(seederDir, { recursive: true });
}

fs.writeFileSync(seederFile, template);

console.log(`✅ Created seeder file: prisma/seeders/${seederName}.seeder.ts`);
console.log(`📝 Next step: Edit file & add your seeding logic`);