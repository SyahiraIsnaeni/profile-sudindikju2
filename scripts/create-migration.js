const fs = require('fs');
const path = require('path');

// Get migration name dari CLI argument
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Error: Migration name is required');
  console.log('Usage: npm run create:migration -- create_articles_table');
  process.exit(1);
}

// Generate timestamp otomatis
const timestamp = new Date().toISOString().replace(/[:\-.]/g, '').slice(0, 14);
const folderName = `${timestamp}_${migrationName}`;
const migrationPath = path.join(__dirname, `../prisma/migrations/${folderName}`);
const sqlFile = path.join(migrationPath, 'migration.sql');

// Create folder
if (!fs.existsSync(migrationPath)) {
  fs.mkdirSync(migrationPath, { recursive: true });
  console.log(`✅ Created migration folder: prisma/migrations/${folderName}`);
} else {
  console.error(`❌ Migration folder already exists: ${folderName}`);
  process.exit(1);
}

// Create migration.sql template
const sqlTemplate = `-- ${migrationName}
-- TODO: Write your SQL here

-- Example:
-- CREATE TABLE "articles" (
--     "id" SERIAL NOT NULL PRIMARY KEY,
--     "title" VARCHAR(255) NOT NULL,
--     "content" TEXT,
--     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updatedAt" TIMESTAMP(3) NOT NULL
-- );
`;

fs.writeFileSync(sqlFile, sqlTemplate);
console.log(`✅ Created migration file: ${sqlFile}`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Edit file: prisma/migrations/${folderName}/migration.sql`);
console.log(`   2. Write your SQL code`);
console.log(`   3. Run: docker-compose exec app npx prisma migrate deploy`);
console.log(`   4. Verify: docker-compose exec postgres psql -U sudin_admin -d sudin_pendidikan_db -c "\\dt"`);