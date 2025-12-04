# 📚 Sudin Pendidikan Jakarta Utara Wilayah 2 - Landing Page

Dokumentasi lengkap untuk setup dan menjalankan project ini.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Lokal](#setup-lokal)
- [Docker Setup](#docker-setup)
- [Database & Migration](#database--migration)
- [Seeding Database](#seeding-database)
- [Running Application](#running-application)
- [Useful Commands](#useful-commands)
- [Troubleshooting](#troubleshooting)

---

## 📦 Prerequisites

Pastikan sudah install:

- **Node.js** v20+ ([download](https://nodejs.org/))
- **npm** atau **yarn**
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop))
- **PostgreSQL** (akan auto-run di Docker)

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

## 🚀 Setup Lokal

### 1. Clone & Install Dependencies

```bash
# Clone project (jika belum)
git clone <repository-url>
cd profile-sudindikju2

# Install dependencies
npm install

# Install tambahan untuk seeder & Docker
npm install bcryptjs
npm install --save-dev ts-node
```

### 2. Setup Environment Variables

Buat file `.env` di root folder:

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=sudin_pendidikan_db
DB_USER=sudin_admin
DB_PASSWORD=sudin_secure_password_2025
DATABASE_URL=postgresql://sudin_admin:sudin_secure_password_2025@postgres:5432/sudin_pendidikan_db

# Next.js
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** Jangan push `.env` ke Git! Sudah ada di `.gitignore`.

---

## 🐳 Docker Setup

### 1. Start Docker Containers

```bash
# Build images & start containers (background)
docker-compose up -d

# Check status
docker-compose ps

# Expected: postgres dan app services "Up"
```

### 2. Verify PostgreSQL Connection

```bash
# Test connection ke PostgreSQL
docker-compose exec postgres psql -U sudin_admin -d sudin_pendidikan_db -c "SELECT 1"

# Expected: (1 row) dengan nilai 1
```

### 3. View Logs

```bash
# Real-time logs
docker-compose logs -f

# Logs hanya app service
docker-compose logs -f app

# Logs hanya postgres
docker-compose logs -f postgres
```

---

## 🗄️ Database & Migration

### 1. Generate Prisma Client

```bash
# Inside container
docker-compose exec app npx prisma generate

# Expected: ✔ Generated Prisma Client
```

### 2. Create & Deploy Migration

**Option A: Create New Migration**
```bash
docker-compose exec app npx prisma migrate dev --name create_users_table

# Expected:
# ✔ Created prisma/migrations/[timestamp]_create_users_table/migration.sql
# ✔ Successfully applied migration(s)
```

**Option B: Deploy Existing Migration**
```bash
docker-compose exec app npx prisma migrate deploy

# Expected: ✔ Ran 1 migration(s)
```

### 3. Check Migration Status

```bash
docker-compose exec app npx prisma migrate status

# Expected: Shows applied & pending migrations
```

---

## 🌱 Seeding Database

### 1. Run Seeder

```bash
# Run all seeders
docker-compose exec app npm run db:seed

# Expected:
# 🌱 Starting database seeding...
# 📝 Seeding users table...
#   ✓ Created user: admin@gmail.com
#   ✓ Created user: user@gmail.com
# ✅ Seeding completed successfully!
```

### 2. Reset Database & Re-seed

```bash
# Drops database, create baru, run migrations, seed
docker-compose exec app npx prisma migrate reset

# Expected: Same output as above
```

### 3. Verify Data

```bash
# Query users table
docker-compose exec postgres psql -U sudin_admin -d sudin_pendidikan_db -c "SELECT email, name FROM users;"

# Expected:
#        email       |     name
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
docker-compose exec postgres psql -U sudin_admin -d sudin_pendidikan_db

# Query in psql
# \dt                          - list tables
# SELECT * FROM users;         - view users
# \q                           - exit psql
```

### npm Scripts

```bash
npm run dev                  # Development server
npm run build                # Build production
npm start                    # Start production
npm run lint                 # ESLint check
npm run db:seed              # Run seeder
npm run db:migrate           # Deploy migrations
npm run docker:up            # Start docker
npm run docker:down          # Stop docker
npm run docker:logs          # View logs
npm run generate:seeder      # Generate seeder template
```

---

## 🆘 Troubleshooting

### 1. Docker Container Tidak Running

```bash
# Check status
docker-compose ps

# Jika ada error, cek logs
docker-compose logs app
docker-compose logs postgres

# Rebuild & restart
docker-compose down
docker-compose up -d --build
```

### 2. DATABASE_URL tidak ter-load

```bash
# Verify .env file ada
ls .env

# Verify DATABASE_URL di container
docker-compose exec app env | Select-String DATABASE_URL

# Jika kosong, restart docker
docker-compose down
docker-compose up -d
```

### 3. Migration Failed

```bash
# Check migration status
docker-compose exec app npx prisma migrate status

# Reset & redo
docker-compose exec app npx prisma migrate reset
```

### 4. PrismaClient Error

```bash
# Regenerate Prisma Client
docker-compose exec app npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

### 5. Seeder Error

```bash
# Run seeder with verbose
docker-compose exec app npm run db:seed

# Check seed.ts file
cat prisma/seed.ts

# Check seeder files
cat prisma/seeders/user.seeder.ts
```

### 6. Port Already in Use

Jika port 3000 atau 5432 sudah dipakai:

```bash
# Change port di docker-compose.yml
# ports:
#   - "3001:3000"    (3000 → 3001)
#   - "5433:5432"    (5432 → 5433)
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
