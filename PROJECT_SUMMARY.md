# Project Summary - Sudin Pendidikan Jakarta Utara Wilayah II Landing Page

## 📋 Overview
Ini adalah **landing page web** untuk **Suku Dinas Pendidikan Wilayah II Jakarta Utara**. Dibangun menggunakan **Next.js 16** dengan **TypeScript**, **Tailwind CSS**, dan **PostgreSQL** sebagai database.

**Repository**: https://github.com/SyahiraIsnaeni/profile-sudindikju2

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Architecture**: Clean Architecture dengan separation of concerns

### Backend/Database
- **Database**: PostgreSQL 16 (Alpine)
- **ORM**: Prisma 6.19.0
- **Password Hashing**: bcryptjs

### Development Tools
- **Linting**: ESLint 9
- **Task Runner**: npm scripts
- **Container**: Docker & Docker Compose
- **Node.js**: v20+

---

## 📁 Directory Structure

```
src/
├── app/                              # Next.js App Router
│   ├── page.tsx                      # Homepage (routes ke LandingPage)
│   ├── layout.tsx                    # Root layout dengan metadata
│   ├── globals.css                   # Global styles
│   └── favicon.ico
│
├── presentation/                     # UI Layer (Clean Architecture)
│   ├── pages/
│   │   └── LandingPage.tsx          # Main landing page component
│   │
│   ├── components/
│   │   ├── landing/                 # Landing page sections
│   │   │   ├── Navbar.tsx           # Navigation bar (responsive)
│   │   │   ├── Hero.tsx             # Hero section dengan background image
│   │   │   ├── About.tsx            # About section (Tentang Kami)
│   │   │   ├── Programs.tsx         # Program Unggulan
│   │   │   ├── Services.tsx         # Layanan/Services
│   │   │   ├── News.tsx             # Berita (News)
│   │   │   ├── Contact.tsx          # Kontak/Contact
│   │   │   ├── Footer.tsx           # Footer
│   │   │   └── ChatBot.tsx          # Chatbot component
│   │   │
│   │   └── shared/                  # Reusable components
│   │       ├── Button.tsx           # Common button
│   │       ├── Input.tsx            # Common input
│   │       ├── Card.tsx             # Card component
│   │       ├── Modal.tsx            # Modal dialog
│   │       └── Table.tsx            # Table component
│   │
│   ├── composables/                 # Custom React Hooks
│   │   ├── useNavbar.ts             # Navbar state (scroll, mobile menu)
│   │   ├── useModal.ts              # Modal state management
│   │   └── useChatBot.ts            # ChatBot state
│   │
│   └── assets/                      # Static assets
│
├── modules/                         # Business Logic Layer (Feature-based)
│   └── users/
│       ├── controllers/             # API controllers
│       ├── services/                # Business logic (empty)
│       ├── repositories/            # Data access layer (empty)
│       ├── dtos/                    # Data Transfer Objects
│       ├── entities/                # Domain models
│       └── presentation/            # User-related UI
│
├── infrastructure/                  # Infrastructure Layer
│   └── (database, API clients, etc)
│
├── config/                          # Configuration files
│   └── (environment, constants, etc)
│
└── shared/                          # Shared utilities
    └── (helpers, types, constants)

prisma/
├── schema.prisma                    # Database schema definition
├── seed.ts                          # Entry point untuk seeder
├── migrations/                      # Database migrations
└── seeders/
    ├── index.ts                     # Seeder orchestrator
    └── user.seeder.ts               # User seeding script

docker/
└── postgres/
    └── init.sql                     # PostgreSQL initialization script

public/
└── images/
    └── education-bg.png             # Hero background image

.env                                 # Environment variables (git ignored)
docker-compose.yml                   # Docker service orchestration
Dockerfile                           # Next.js app container config
package.json                         # Dependencies & scripts
tsconfig.json                        # TypeScript configuration
next.config.ts                       # Next.js configuration
postcss.config.mjs                   # PostCSS configuration
README.md                            # Setup & run documentation
```

---

## 🎯 Key Features

### 1. **Responsive Landing Page**
   - **Navbar**: Sticky navigation dengan mobile menu toggle
   - **Hero Section**: Full-screen intro dengan background image, animations
   - **About Section**: 4 feature cards (Peningkatan Akses, Pembinaan Sekolah, Transformasi Digital, Peningkatan GTK)
   - **Programs**: Program Unggulan
   - **Services**: Layanan yang disediakan
   - **News**: Berita/Blog section
   - **Contact**: Formulir kontak
   - **Footer**: Footer dengan links
   - **ChatBot**: Chatbot widget

### 2. **Authentication & User Management**
   - Database user table dengan Email, Password (hashed), Name
   - Seed users: `admin@gmail.com` (admin123456), `user@gmail.com` (user123456)
   - bcryptjs untuk password hashing

### 3. **Database & Migrations**
   - PostgreSQL dengan Prisma ORM
   - Migration workflow dengan automatic timestamp generation
   - Database seeding untuk initial data

### 4. **Containerization**
   - Docker Compose untuk orchestration
   - PostgreSQL service (healthcheck enabled)
   - Next.js app service dengan volume mounting
   - Environment variable injection

### 5. **Clean Architecture**
   - Separation of concerns (presentation, business, infrastructure layers)
   - Custom hooks (composables) untuk reusable logic
   - Feature-based module structure (users/)
   - Shared utilities dan components

---

## 🎨 Design & Styling

### Color Scheme
- **Primary**: Blue (#3B82F6) - CTA buttons, accents
- **Text**: Gray shades (#1F2937, #374151, #6B7280)
- **Background**: White, Light Gray (#F9FAFB)
- **Overlay**: Black with transparency

### Components Styling
- **Tailwind CSS 4** untuk utility-first approach
- Responsive design dengan mobile-first strategy
- Hover effects, transitions, animations (Tailwind + inline CSS)
- Icons dari Lucide React
- Shadow & border utilities untuk depth

### Animations
- `fadeInUp` animation untuk content reveal
- `bounce` animation untuk scroll indicator
- `pulse` animation untuk loading states
- Transition delays untuk staggered animations

---

## 🚀 Running the Project

### Prerequisites
- Node.js v20+
- Docker Desktop
- PostgreSQL (runs in Docker)

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Setup .env file (see README for structure)
# Create .env with DATABASE_URL and other config

# 3. Start Docker containers
docker-compose up -d

# 4. Run migrations
npm run db:migrate

# 5. Seed database
npm run db:seed

# 6. Start dev server
npm run dev
# Open http://localhost:3000
```

### Key npm Scripts
```bash
npm run dev                    # Development server
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # ESLint check
npm run docker:up              # Start Docker containers
npm run docker:down            # Stop Docker containers
npm run db:migrate             # Apply database migrations
npm run db:seed                # Seed database with initial data
npm run create:migration -- <name>  # Create new migration
```

---

## 🗄️ Database Schema

### Current Models
**User Table**
```
- id (Int, PK, auto-increment)
- email (String, unique)
- password (String, hashed)
- name (String, nullable)
- createdAt (DateTime, default: now)
- updatedAt (DateTime, auto-update)
```

### Planned Models (Mentioned in README but not yet implemented)
- Article (untuk News section)
- Program (untuk Programs section)
- Service (untuk Services section)
- Contact (untuk Contact form submissions)

---

## 📝 Component Details

### useNavbar Hook
- Manages navbar state:
  - `isOpen`: Mobile menu toggle state
  - `scrolled`: Scroll position (changes style at >20px)
  - `navLinks`: Array of navigation links

### LandingPage Component
- Composite component orchestrating all page sections
- Client-side rendering (no SSR needed)
- Sections: Navbar > Hero > About > Programs > Services > News > Contact > Footer > ChatBot

### About Section Features
```
1. Peningkatan Akses
   Icon: BookOpen
   Description: Memastikan setiap anak mendapatkan hak pendidikan

2. Pembinaan Sekolah
   Icon: Users
   Description: Pendampingan intensif untuk sekolah

3. Transformasi Digital
   Icon: Monitor
   Description: Digitalisasi pembelajaran & administrasi

4. Peningkatan Mutu GTK
   Icon: Award
   Description: Pengembangan kompetensi guru & tenaga kependidikan
```

---

## 🐳 Docker Configuration

### Services
1. **postgres**: PostgreSQL 16-Alpine
   - Container: `sudin_postgres`
   - Port: 5432
   - Health check: enabled
   - Volume: `postgres_data` (persistent storage)

2. **app**: Next.js Application
   - Container: `sudin_app`
   - Port: 3000
   - Depends on: postgres (with health check)
   - Volumes: app source + node_modules + .next

### Network
- Bridge network: `sudin_network`
- Both services communicate internally

---

## 🔄 Development Workflow

1. **Feature Development**
   - Create new component in `presentation/components/`
   - Add custom hook in `presentation/composables/` if needed
   - Import & use in page/component

2. **Database Changes**
   - Run `npm run create:migration -- migration_name`
   - Edit migration SQL file
   - Run `npm run db:migrate`
   - Update `schema.prisma`
   - Run `docker-compose exec app npx prisma generate`

3. **Add New Seeder**
   - Create file in `prisma/seeders/feature.seeder.ts`
   - Import & execute in `prisma/seeders/index.ts`
   - Run `npm run db:seed`

4. **Testing Changes**
   - Run dev server: `npm run dev`
   - Visit http://localhost:3000
   - Check browser console for errors
   - Verify database changes: `docker-compose exec postgres psql -U root -d aska_sudin -c "\dt"`

---

## ⚠️ Important Notes

1. **Environment Variables**
   - `.env` file is git-ignored (security)
   - Must be created locally before running Docker
   - See README for required variables

2. **Default Login Credentials** (after seeding)
   - admin@gmail.com / admin123456
   - user@gmail.com / user123456

3. **Security Before Production**
   - Change default passwords
   - Enable HTTPS
   - Implement CSRF protection
   - Validate/sanitize all inputs
   - Add rate limiting to APIs
   - Keep dependencies updated

4. **Architecture Notes**
   - Clean Architecture pattern for scalability
   - Feature-based module structure (users/)
   - Ready for expansion with more features
   - Separation of concerns (presentation/business/infrastructure)

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Entry point (routes to LandingPage) |
| `src/app/layout.tsx` | Root layout & metadata |
| `src/presentation/pages/LandingPage.tsx` | Main page composition |
| `src/presentation/composables/useNavbar.tsx` | Navbar logic |
| `src/presentation/components/landing/*.tsx` | Page sections |
| `prisma/schema.prisma` | DB schema definition |
| `prisma/seed.ts` | Seeder entry |
| `docker-compose.yml` | Service orchestration |
| `package.json` | Dependencies & scripts |
| `.env` | Environment variables (local only) |

---

## 🎓 Learning Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [Docker Docs](https://docs.docker.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 👥 Project Info
- **Organization**: Suku Dinas Pendidikan Wilayah II Jakarta Utara
- **Contact**: sudin.jp2@jakarta.go.id
- **Created**: 2025
- **Repository**: https://github.com/SyahiraIsnaeni/profile-sudindikju2
