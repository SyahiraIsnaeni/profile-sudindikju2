const fs = require('fs');
const path = require('path');

// Get seeder name from CLI argument
const seederName = process.argv[2];

if (!seederName) {
  console.error('❌ Error: Seeder name is required');
  console.log('Usage: npm run generate:seeder -- userSeeder');
  process.exit(1);
}

// Validate name format (camelCase)
if (!/^[a-z][a-zA-Z]*Seeder$/.test(seederName)) {
  console.error('❌ Error: Seeder name should be in camelCase format (e.g., userSeeder, roleSeeder)');
  process.exit(1);
}

const tableName = seederName.replace('Seeder', '').toLowerCase();
const timestamp = new Date().toISOString().replace(/[:\-.]/g, '').slice(0, 14);
const migrationName = `${timestamp}_create_${tableName}s_table`;

// Paths
const migrationsDir = path.join(__dirname, '../prisma/migrations', migrationName);
const seederFile = path.join(__dirname, `../prisma/seeders/${seederName}.ts`);
const seedersIndexFile = path.join(__dirname, '../prisma/seeders/index.ts');

// 1. Create migration directory
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
  console.log(`📁 Created migration directory: ${migrationsDir}`);
}

// 2. Create migration.sql template
const migrationSQL = `-- CreateTable
CREATE TABLE "${tableName}s" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);
`;

const migrationSQLFile = path.join(migrationsDir, 'migration.sql');
fs.writeFileSync(migrationSQLFile, migrationSQL);
console.log(`✅ Created migration file: ${migrationSQLFile}`);

// 3. Create seeder template
const seederTemplate = `import { PrismaClient } from '@prisma/client';

export async function ${seederName}(prisma: PrismaClient) {
  console.log('📝 Seeding ${tableName}s table...');

  // Clear existing data (optional)
  // await prisma.${tableName}.deleteMany();

  const ${tableName}s = [
    // TODO: Add your data here
    // {
    //   name: 'Sample ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}',
    // },
  ];

  for (const ${tableName} of ${tableName}s) {
    const created = await prisma.${tableName}.create({
      data: ${tableName},
    });

    console.log(\`  ✓ Created ${tableName}: \${created.id}\`);
  }

  console.log(\`📊 Total ${tableName}s seeded: \${${tableName}s.length}\`);
}
`;

fs.writeFileSync(seederFile, seederTemplate);
console.log(`✅ Created seeder file: ${seederFile}`);

// 4. Update seeders/index.ts
let indexContent = fs.readFileSync(seedersIndexFile, 'utf-8');

// Check if seeder already exported
if (!indexContent.includes(`export { ${seederName} }`)) {
  // Add new export
  const newExport = `export { ${seederName} } from './${seederName}';\n`;
  indexContent += newExport;
  fs.writeFileSync(seedersIndexFile, indexContent);
  console.log(`✅ Updated seeders/index.ts`);
}

// 5. Update seed.ts to include new seeder
const seedFile = path.join(__dirname, '../prisma/seed.ts');
let seedContent = fs.readFileSync(seedFile, 'utf-8');

// Add import
if (!seedContent.includes(`import { ${seederName} }`)) {
  const importLine = `import { ${seederName} } from './seeders/index';\n`;
  seedContent = seedContent.replace('import { userSeeder }', `${importLine}import { userSeeder }`);
  
  // Add seeder call
  const seederCall = `  try {\n    // Run user seeder\n    await userSeeder(prisma);\n\n    // TODO: Uncomment when ready\n    // await ${seederName}(prisma);\n`;
  seedContent = seedContent.replace('  try {', seederCall);
  
  fs.writeFileSync(seedFile, seedContent);
  console.log(`⚠️  Added TODO comment in seed.ts - uncomment when seeder is ready`);
}

console.log(`\n✨ Done! Generated seeder: ${seederName}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Edit migration file: prisma/migrations/${migrationName}/migration.sql`);
console.log(`   2. Edit seeder file: prisma/seeders/${seederName}.ts`);
console.log(`   3. Uncomment seeder call in prisma/seed.ts`);
console.log(`   4. Run: npm run db:migrate && npm run db:seed`);