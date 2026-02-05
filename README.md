# 📚 Sudin Pendidikan Jakarta Utara Wilayah 2 - Landing Page

Dokumentasi lengkap untuk setup dan menjalankan project ini.

**🎯 Architecture:** Local PostgreSQL + Docker Next.js

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Database & Migration](#database--migration)
- [Running Application](#running-application)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

**See [SETUP_LOCAL_DB.md](./SETUP_LOCAL_DB.md) for detailed setup with local PostgreSQL**

```bash
# 1. Setup local PostgreSQL database (follow SETUP_LOCAL_DB.md)

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Create initial migration
npm run db:migrate:dev -- --name initial_schema

# 5. Start Docker container
npm run docker:up

# 6. Open http://localhost:3000
```

---

## 📦 Prerequisites

Pastikan sudah install:

- **Node.js** v20+ ([download](https://nodejs.org/))
- **npm** atau **yarn**
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop))
- **PostgreSQL** ([download](https://www.postgresql.org/download/)) - installed locally on your device

Verify install:
```bash
node --version      # v20+
npm --version       # 10+
docker --version    # 20+
```

---

## 📁 Project Structure

```
profile-sudindikju2/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── presentation/                 # Clean Architecture
│       ├── pages/                    # Page Components
│       │   ├── LandingPage.tsx
│       │   └── LoginPage.tsx
│       ├── components/
│       │   ├── landing/              # Landing Page Components
│       │   │   ├── Navbar.tsx
│       │   │   ├── Hero.tsx
│       │   │   ├── About.tsx
│       │   │   ├── Programs.tsx
│       │   │   ├── Services.tsx
│       │   │   ├── News.tsx
│       │   │   ├── Contact.tsx
│       │   │   ├── Footer.tsx
│       │   │   └── ChatBot.tsx
│       │   ├── auth/
│       │   │   └── LoginForm.tsx
│       │   └── shared/               # Reusable Components
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Card.tsx
│       │       ├── Modal.tsx
│       │       └── Table.tsx
│       └── composables/              # Custom Hooks
│           ├── useNavbar.ts
│           ├── useModal.ts
│           └── useChatBot.ts
├── prisma/
│   ├── schema.prisma                 # Database Schema
│   ├── seed.ts                       # Seeder Entry Point
│   ├── migrations/                   # Migration Files
│   │   └── [timestamp]_create_users_table/
│   │       └── migration.sql
│   └── seeders/                      # Seeder Scripts
│       ├── index.ts
│       └── user.seeder.ts
├── docker/
│   └── postgres/
│       └── init.sql                  # PostgreSQL Init Script
├── public/
│   └── images/                       # Static Images
├── .env                              # Environment Variables
├── docker-compose.yml                # Docker Compose Config
├── Dockerfile                        # Next.js Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Detailed Setup

### 1. Setup Local PostgreSQL

**👉 Follow [SETUP_LOCAL_DB.md](./SETUP_LOCAL_DB.md) - Complete guide for:**
- Creating PostgreSQL database & user
- Verifying connections
- Configuring environment variables

### 2. Clone & Install Dependencies

```bash
# Clone project
git clone <repository-url>
cd profile-sudindikju2

# Install dependencies
npm install
```

### 3. Configure Environment Variables

Copy example and update:

```bash
cp .env.example .env
```

Edit `.env` with your local PostgreSQL credentials:

```env
# Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aska_sudin
DB_USER=postgres
DB_PASSWORD=your_password_here

DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/aska_sudin

NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** Jangan push `.env` ke Git! Sudah ada di `.gitignore`.

### 4. Start Docker Containers

```bash
# Start app service (Next.js di Docker)
npm run docker:up

# Check status
docker-compose ps

# Expected: sudin_app service "Up"
```

### 5. View Logs

```bash
# Real-time logs
npm run docker:logs

# Stop logs viewing
# Press Ctrl + C
```

---

## 🗄️ Database & Migration

### 1. Generate Prisma Client

```bash
npm run prisma:generate

# Expected: ✔ Generated Prisma Client
```

### 2. Create Migration File

User membuat file migration dengan timestamp otomatis, tapi isi SQL sendiri:

**Step 1: Create/Update Migration Interactively**

```bash
npm run db:migrate:dev -- --name add_new_table

# Follow prompts to:
# 1. Generate migration from schema.prisma changes
# 2. Name your migration
# 3. Review and apply
```

**Step 2: Or Create Migration Manually**

Edit `prisma/schema.prisma` to add new model:

```prisma
model Article {
  id        Int     @id @default(autoincrement())
  title     String  @db.VarChar(255)
  content   String? @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("articles")
}
```

Then create migration:

```bash
npm run db:migrate:dev -- --name add_articles_table
```

### 3. Check Migration Status

```bash
npx prisma migrate status

# Expected: Shows applied & pending migrations
```

### 4. View Schema in UI

```bash
npm run prisma:studio

# Opens browser at http://localhost:5555 to view/edit data
```

---

## 🌱 Seeding Database

### 1. Run Seed Script

```bash
npm run db:seed

# Expected: Seeding completed successfully
```

### 2. Create Custom Seeder

Edit `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create users
  await prisma.user.createMany({
    data: [
      {
        name: "Admin Sudin",
        email: "admin@gmail.com",
        password: "hashed_password",
      },
      {
        name: "User Sudin",
        email: "user@gmail.com",
        password: "hashed_password",
      },
    ],
  });

  console.log("Seeding completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Then run:

```bash
npm run db:seed
```

---

### **Complete Workflow: Schema → Migration → Seed:**

```bash
# 1. Update schema.prisma with new model
# 2. Create migration (interactive or manual)
npm run db:migrate:dev -- --name descriptive_name

# 3. Review and apply migration
# 4. Regenerate Prisma Client if needed
npm run prisma:generate

# 5. Update prisma/seed.ts with new data
# 6. Run seeder
npm run db:seed

# 6. Generate Prisma Client
docker-compose exec app npx prisma generate
```

---

## 🌱 Seeding Database

### 1. Create New Seeder File

```bash
# Generate seeder template dengan timestamp otomatis
npm run create:seeder -- user_seeder

# Expected:
# ✅ Created seeder file: prisma/seeders/user.seeder.ts
# 📝 Next step: Edit file & add your seeding logic
```

File akan dibuat di: `prisma/seeders/user.seeder.ts`

### 2. Edit Seeder File

Buka `prisma/seeders/user.seeder.ts` dan tambahkan logic seeding:

```typescript
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedUser() {
  try {
    console.log('📝 Seeding users...');
    
    // Buat users
    const adminPassword = await bcryptjs.hash('admin123456', 10);
    const userPassword = await bcryptjs.hash('user123456', 10);
    
    await prisma.user.create({
      data: {
        nama: 'Admin Sudin',
        email: 'admin@gmail.com',
        password: adminPassword,
      },
    });
    
    await prisma.user.create({
      data: {
        nama: 'User Sudin',
        email: 'user@gmail.com',
        password: userPassword,
      },
    });
    
    console.log('✅ Users seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
```

### 3. Update `prisma/seeders/index.ts`

```typescript
import { seedUser } from './user.seeder';

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await seedUser();
    
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
```

### 4. Run Seeder

```bash
# Run semua seeders
npm run seed

# Atau dengan alias
npm run seed:all

# Expected:
# 🌱 Starting database seeding...
# 📝 Seeding users...
# ✅ Users seeded successfully!
# ✅ Seeding completed successfully!
```

### 5. Run Seeder Tertentu

```bash
# Run seeder file tertentu
npm run seed:run -- user.seeder.ts

# Expected: Output dari seeder tersebut saja
```

### 6. Reset Database & Re-seed

```bash
# Drops database, create baru, run migrations, seed
docker-compose exec app npx prisma migrate reset

# Expected: Same output as seeding
```

### 7. Verify Data

```bash
# Query users table
docker-compose exec postgres psql -U sudin_admin -d sudin_pendidikan_db -c "SELECT email, nama FROM users;"

# Expected:
#        email       |     nama
# ------------------+---------------
#  admin@gmail.com   | Admin Sudin
#  user@gmail.com    | User Sudin
```

---

## 🏃 Running Application

### 1. Start Development Server

```bash
# App already running via docker-compose
# Open http://localhost:3000 in browser
```

### 2. Build for Production

```bash
npm run build
npm start
```

### 3. Run Tests (jika ada)

```bash
npm test
```

---

## 🛠️ Useful Commands

### Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Stop & remove volumes (reset database)
docker-compose down -v

# Rebuild images
docker-compose up -d --build
docker-compose build --no-cache

# Restart containers
docker-compose restart

# View logs
docker-compose logs -f
docker-compose logs -f app
docker-compose logs -f postgres
```

### Prisma Commands

```bash
# Generate Prisma Client
docker-compose exec app npx prisma generate

# Create migration
docker-compose exec app npx prisma migrate dev --name <name>

# Deploy migration
docker-compose exec app npx prisma migrate deploy

# Reset database
docker-compose exec app npx prisma migrate reset

# Check status
docker-compose exec app npx prisma migrate status

# View data via Studio (UI)
docker-compose exec app npx prisma studio
```

### Database Commands

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U root -d aska_sudin

# Query in psql
# \dt                          - list tables
# SELECT * FROM users;         - view users
# \q                           - exit psql
```

### npm Scripts

**Development:**
```bash
npm run dev                  # Start Next.js development server (local)
npm run lint                 # ESLint check
```

**Docker:**
```bash
npm run docker:up            # Start Docker containers
npm run docker:down          # Stop Docker containers
npm run docker:logs          # View Docker logs
npm run docker:restart       # Restart containers
npm run docker:build         # Rebuild Docker image
```

**Database:**
```bash
npm run prisma:generate      # Generate Prisma Client
npm run prisma:studio        # Open Prisma Studio UI
npm run db:migrate:dev       # Create & apply migration (interactive)
npm run db:migrate:reset     # ⚠️ Reset database (loses data)
npm run db:seed              # Run seeder
```

**Production:**
```bash
npm run build                # Build production bundle
npm start                    # Start production server
```

---

## 🆘 Troubleshooting

### 1. PostgreSQL Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Ensure PostgreSQL is running locally
- Verify DATABASE_URL in `.env` is correct
- Check DB_HOST is `localhost` (not `postgres`)
- Verify credentials match your PostgreSQL setup

```bash
# Test local PostgreSQL connection
psql -U postgres -d aska_sudin -c "SELECT 1"
```

### 2. Docker Container Won't Start

```bash
# Check logs
npm run docker:logs

# Or specific container
docker-compose logs sudin_app

# Rebuild container
npm run docker:build
docker-compose down
npm run docker:up
```

### 3. Prisma Client Error

```bash
# Regenerate Prisma Client
npm run prisma:generate

# Clear cache and reinstall
rm -rf node_modules/.prisma
npm install
```

### 4. Migration Issues

```bash
# Check migration status
npx prisma migrate status

# View pending migrations
# Fix any SQL errors in migration files

# Reset database (⚠️ WARNING: loses all data)
npm run db:migrate:reset

# Then reapply migrations
npm run db:migrate:dev
```

### 5. Seeder Error

```bash
# Run seeder with error output
npm run db:seed

# Check seeding script
cat prisma/seed.ts

# Check data in database
npm run prisma:studio
```

### 6. Port Already in Use

If port 3000 is taken:

```bash
# Change port in docker-compose.yml
# ports:
#   - "3001:3000"

# Then access: http://localhost:3001
```

### 7. Environment Variables Not Loading

```bash
# Verify .env file exists
ls -la .env

# Check content (be careful with secrets)
# cat .env

# Restart Docker to reload variables
docker-compose down
docker-compose up -d
```

---

## 📝 Default Login Credentials

Setelah seeding, bisa login dengan:

```
Email: admin@gmail.com
Password: admin123456

Email: user@gmail.com
Password: user123456
```

---

## 🔐 Security Tips

⚠️ **BEFORE PRODUCTION:**

1. **Change default password** di `.env`
2. **Use environment-specific configs** (.env.production)
3. **Enable HTTPS** di production
4. **Validate & sanitize inputs** di backend
5. **Implement rate limiting** untuk API
6. **Use secure session storage** untuk auth
7. **Add CSRF protection** untuk forms
8. **Update dependencies** regularly: `npm audit fix`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 👥 Team

**Project:** Sudin Pendidikan Jakarta Utara Wilayah 2  
**Last Updated:** 2025-12-04

---

## 📞 Support

Untuk masalah & pertanyaan, hubungi:
- Email: sudin.jp2@jakarta.go.id
- Phone: (021) 43931056

---
