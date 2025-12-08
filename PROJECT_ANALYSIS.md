# Project Analysis - Sudin Pendidikan Jakarta Utara Wilayah II

**Created**: December 5, 2025

---

## 📊 Executive Summary

Ini adalah aplikasi **web portal profile** untuk **Suku Dinas Pendidikan Wilayah II Jakarta Utara** yang dibangun dengan **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4** di frontend, dan **PostgreSQL 16** + **Prisma ORM** di backend.

**Repository**: https://github.com/SyahiraIsnaeni/profile-sudindikju2

---

## 🏗️ Architecture Overview

### **Design Pattern**
- **Clean Architecture**: Pemisahan yang jelas antara presentation, business logic, dan infrastructure layers
- **Feature-based Structure**: Modul diorganisir berdasarkan fitur (users, roles, etc.)
- **Component-driven**: UI components yang reusable dan modular

### **Tech Stack**

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Node.js, Next.js API Routes |
| **Database** | PostgreSQL 16 (Alpine) |
| **ORM** | Prisma 6.19.0 |
| **Authentication** | JWT (token-based) |
| **Password** | bcryptjs (hashing) |
| **UI Icons** | Lucide React |
| **Containerization** | Docker & Docker Compose |
| **Linting** | ESLint 9 |

---

## 📁 Directory Structure

```
profile-sudindikju2/
│
├── src/
│   ├── app/                              # Next.js App Router (routes & API)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/               # POST: Login endpoint
│   │   │   │   ├── logout/              # POST: Logout endpoint
│   │   │   │   └── set-token/           # POST: Set JWT token
│   │   │   └── master-data/
│   │   │       ├── users/
│   │   │       │   ├── route.ts         # GET: List users (paginated)
│   │   │       │   ├── create/          # POST: Create user
│   │   │       │   └── [id]/            # GET/PUT/DELETE: Single user ops
│   │   │       └── roles/
│   │   │           ├── route.ts         # GET: List roles
│   │   │           ├── create/          # POST: Create role
│   │   │           └── [id]/            # GET/PUT/DELETE: Single role ops
│   │   │
│   │   ├── dashboard/                   # Dashboard page
│   │   │   ├── page.tsx                 # Main dashboard
│   │   │   └── master-data/             # Master data management
│   │   │       └── page.tsx
│   │   │
│   │   ├── login/                       # Login page
│   │   │   └── page.tsx
│   │   │
│   │   ├── page.tsx                     # Landing page (root /)
│   │   ├── layout.tsx                   # Root layout dengan metadata
│   │   └── globals.css                  # Global styling
│   │
│   ├── presentation/                    # UI Layer (Clean Architecture)
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx          # Landing page component
│   │   │   ├── LoginPage.tsx            # Login form
│   │   │   ├── DashboardPage.tsx        # Dashboard dengan stats
│   │   │   └── MasterDataPage.tsx       # Master data tabs
│   │   │
│   │   ├── components/
│   │   │   ├── landing/                 # Landing page sections
│   │   │   │   ├── Navbar.tsx           # Navigation (responsive + sticky)
│   │   │   │   ├── Hero.tsx             # Hero section (image background)
│   │   │   │   ├── About.tsx            # About section (4 feature cards)
│   │   │   │   ├── Programs.tsx         # Programs section
│   │   │   │   ├── Services.tsx         # Services/Layanan section
│   │   │   │   ├── News.tsx             # Berita/News section
│   │   │   │   ├── Contact.tsx          # Contact form
│   │   │   │   ├── Footer.tsx           # Footer
│   │   │   │   └── ChatBot.tsx          # ChatBot widget
│   │   │   │
│   │   │   ├── masterdata/              # Master data components
│   │   │   │   ├── UsersTab.tsx         # Users table with pagination
│   │   │   │   ├── UserFormModal.tsx    # User create/edit form
│   │   │   │   ├── RolesTab.tsx         # Roles table
│   │   │   │   └── RoleFormModal.tsx    # Role create/edit form
│   │   │   │
│   │   │   ├── dashboard/               # Dashboard components
│   │   │   │   ├── DashboardLayout.tsx  # Main layout wrapper
│   │   │   │   ├── Sidebar.tsx          # Side navigation
│   │   │   │   └── TopBar.tsx           # Top navigation bar
│   │   │   │
│   │   │   └── shared/                  # Reusable components
│   │   │       ├── Button.tsx           # Common button component
│   │   │       ├── Input.tsx            # Common input component
│   │   │       ├── Card.tsx             # Card container
│   │   │       ├── Modal.tsx            # Modal dialog
│   │   │       ├── Alert.tsx            # Alert/Toast component
│   │   │       ├── Pagination.tsx       # Pagination controls
│   │   │       └── ProtectedRoute.tsx   # Auth guard wrapper
│   │   │
│   │   └── composables/                 # Custom React Hooks (state management)
│   │       ├── useNavbar.tsx            # Navbar state (scroll, mobile menu)
│   │       ├── useModal.tsx             # Modal open/close state
│   │       ├── useLogin.ts              # User auth & session
│   │       ├── useMasterData.tsx        # Master data fetch & pagination
│   │       └── useChatBot.tsx           # ChatBot state
│   │
│   ├── modules/                         # Business Logic Layer
│   │   ├── controllers/
│   │   │   ├── users/
│   │   │   │   └── UserController.ts    # User CRUD operations
│   │   │   └── roles/
│   │   │       └── RoleController.ts    # Role CRUD operations
│   │   │
│   │   ├── dtos/                        # Data Transfer Objects
│   │   │   ├── users/
│   │   │   │   ├── CreateUserDTO.ts
│   │   │   │   ├── UpdateUserDTO.ts
│   │   │   │   ├── UserQueryDTO.ts
│   │   │   │   └── index.ts
│   │   │   └── roles/
│   │   │       ├── CreateRoleDTO.ts
│   │   │       ├── UpdateRoleDTO.ts
│   │   │       ├── RoleQueryDTO.ts
│   │   │       └── index.ts
│   │   │
│   │   └── entities/                    # Domain Models
│   │       ├── users/
│   │       │   └── User.ts
│   │       └── roles/
│   │           └── Role.ts
│   │
│   ├── infrastructure/                  # Infrastructure Layer
│   │   └── (database, API clients, etc)
│   │
│   ├── config/                          # Configuration
│   │   └── (environment, constants)
│   │
│   ├── shared/                          # Shared utilities
│   │   └── (helpers, types, constants)
│   │
│   └── middleware.ts                    # Next.js middleware
│
├── prisma/
│   ├── schema.prisma                    # Database schema (5 models)
│   ├── seed.ts                          # Seeding entry point
│   ├── migrations/                      # Database migrations folder
│   └── seeders/
│       ├── index.ts                     # Seeder orchestrator
│       └── [feature].seeder.ts          # Feature-specific seeders
│
├── docker/
│   └── postgres/
│       └── init.sql                     # PostgreSQL initialization
│
├── public/
│   └── images/                          # Static assets
│       ├── logo_sudindikju2-removebg.png
│       └── education-bg.png
│
├── tests/                               # Test files
│
├── .env                                 # Environment variables (git ignored)
├── docker-compose.yml                   # Docker service orchestration
├── Dockerfile                           # Next.js app container
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript config (path aliases: @/*)
├── next.config.ts                       # Next.js config
├── postcss.config.mjs                   # PostCSS + Tailwind config
├── eslint.config.mjs                    # ESLint config
├── README.md                            # Setup & deployment guide
└── PROJECT_SUMMARY.md                   # Project overview
```

---

## 🗄️ Database Schema

### **5 Main Models:**

#### 1. **User**
```sql
- id (Int, PK, auto-increment)
- name (String)
- email (String, unique)
- password (String, hashed with bcryptjs)
- token_oauth (String, nullable)
- role_id (Int, FK to Role, nullable, onDelete: SetNull)
- status (Int, default: 1) - 1=active, 0=inactive
- created_at (DateTime, default: now())
- updated_at (DateTime, auto-update)
- deleted_at (DateTime, nullable) - soft delete
- role: Role (relation)
```

#### 2. **Role**
```sql
- id (Int, PK, auto-increment)
- name (String, unique)
- status (Int, default: 1) - 1=active, 0=inactive
- created_at (DateTime)
- updated_at (DateTime)
- users: User[] (relation)
- rolePermissions: RolePermission[] (relation)
```

#### 3. **Permission**
```sql
- id (Int, PK, auto-increment)
- name (String, max 255)
- detail (String, max 255)
- created_at (DateTime)
- updated_at (DateTime)
- rolePermissions: RolePermission[] (relation)
- @@unique([name, detail])
```

#### 4. **RolePermission** (Junction Table)
```sql
- role_id (Int, FK, onDelete: Cascade)
- permission_id (Int, FK, onDelete: Cascade)
- created_at (DateTime)
- @@id([role_id, permission_id])
```

#### 5. **Profile** (Organization Profile)
```sql
- id (Int, PK)
- description (Text, nullable)
- vision (Text, nullable)
- mission (Text, nullable)
- motto (VarChar 255, nullable)
- structure_org (VarChar 255, nullable)
- maklumat (VarChar 255, nullable)
- task_org (Text, nullable)
- function_org (Text, nullable)
- created_at (DateTime)
- updated_at (DateTime)
- deleted_at (DateTime, nullable)
```

---

## 🎯 Key Features

### **1. Public Landing Page**
- **Responsive navbar** dengan mobile menu toggle
- **Hero section** dengan background image
- **About section** - 4 feature cards (Peningkatan Akses, Pembinaan Sekolah, Transformasi Digital, Peningkatan GTK)
- **Programs section** - Program unggulan
- **Services section** - Layanan yang disediakan
- **News/Blog section** - Berita terbaru
- **Contact form** - Formulir kontak
- **ChatBot widget** - Automated support
- **Sticky footer** - Links dan info kontak

### **2. Authentication System**
- **Login page** - Email & password based
- **JWT token** - Token-based session management
- **Password hashing** - bcryptjs untuk keamanan
- **Protected routes** - ProtectedRoute wrapper untuk authenticated pages
- **Session storage** - Token disimpan di localStorage

### **3. Dashboard**
- **Welcome card** - Greeting dengan user info
- **Stats cards** - Total users, articles, programs
- **Quick actions** - Button untuk add new items
- **Recent activity** - Activity log display

### **4. Master Data Management**
- **Users Tab**
  - Paginated table dengan search/filter
  - Create user form modal
  - Edit user functionality
  - Delete user with confirmation
  - Role assignment per user
  - Status indicator (Active/Inactive)

- **Roles Tab**
  - Paginated roles table
  - Create/edit role modal
  - Delete role functionality
  - Permission mapping untuk roles

### **5. API Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/set-token` - Set JWT token

- `GET /api/master-data/users` - List users (paginated)
- `POST /api/master-data/users/create` - Create user
- `GET /api/master-data/users/[id]` - Get single user
- `PUT /api/master-data/users/[id]` - Update user
- `DELETE /api/master-data/users/[id]` - Delete user (soft delete)

- `GET /api/master-data/roles` - List roles
- `POST /api/master-data/roles/create` - Create role
- `GET /api/master-data/roles/[id]` - Get single role
- `PUT /api/master-data/roles/[id]` - Update role
- `DELETE /api/master-data/roles/[id]` - Delete role

---

## 🎨 Design & Styling

### **Color Palette**
- **Primary**: Blue (#3B82F6) - CTAs, accents, highlights
- **Text**: Gray shades (#1F2937 primary, #374151 secondary, #6B7280 tertiary)
- **Background**: White, Light Gray (#F9FAFB)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Warning**: Orange (#F59E0B)

### **UI Components**
- Built with **Tailwind CSS 4** utility-first approach
- Responsive design dengan **mobile-first strategy**
- Smooth transitions dan hover effects
- Icons dari **Lucide React** (modern, scalable SVG icons)
- Card-based layouts dengan shadow depth

### **Typography**
- Font: Geist Sans (default), Geist Mono (code)
- Responsive font sizes (mobile vs desktop)
- Clear hierarchy dengan font weights (bold, semibold, medium)

---

## 🚀 Running & Development

### **Prerequisites**
- Node.js v20+
- npm 10+
- Docker Desktop
- PostgreSQL (runs in Docker)

### **Setup Steps**
```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env  # Edit dengan config lokal

# 3. Start Docker containers
npm run docker:up
# OR
docker-compose up -d

# 4. Generate Prisma Client
docker-compose exec app npx prisma generate

# 5. Run migrations
npm run db:migrate

# 6. Seed database
npm run db:seed

# 7. Start development server
npm run dev
# Open http://localhost:3000
```

### **Key npm Scripts**
```bash
npm run dev                      # Development server
npm run build                    # Production build
npm start                        # Start production
npm run lint                     # ESLint check
npm run docker:up                # Start Docker
npm run docker:down              # Stop Docker
npm run docker:logs              # View logs
npm run create:migration -- <name>  # Create migration
npm run db:migrate               # Apply migrations
npm run db:seed                  # Run seeders
```

---

## 🐳 Docker Configuration

### **Services**
1. **postgres** (PostgreSQL 16-Alpine)
   - Container: `sudin_postgres`
   - Port: 5432
   - Health check: Enabled
   - Volume: `postgres_data` (persistent)

2. **app** (Next.js Application)
   - Container: `sudin_app`
   - Port: 3000
   - Depends on: postgres (with health check)
   - Volumes: app source, node_modules, .next
   - Network: sudin_network (bridge)

### **Networks**
- Bridge network: `sudin_network`
- Both services communicate internally

---

## 🔄 Development Workflow

### **Adding New Features**
1. Create component in `src/presentation/components/[category]/`
2. Create custom hook if needed in `src/presentation/composables/`
3. Create API endpoint in `src/app/api/[route]/`
4. Create controller in `src/modules/controllers/[feature]/`
5. Define DTOs in `src/modules/dtos/[feature]/`

### **Database Changes**
1. Create migration: `npm run create:migration -- migration_name`
2. Edit migration SQL file: `prisma/migrations/[timestamp]_[name]/migration.sql`
3. Apply migration: `npm run db:migrate`
4. Update `schema.prisma` (optional for Prisma Client generation)
5. Generate Prisma Client: `docker-compose exec app npx prisma generate`

### **Adding Seeders**
1. Create seeder file: `prisma/seeders/[feature].seeder.ts`
2. Import & call in `prisma/seeders/index.ts`
3. Run seeders: `npm run db:seed`

---

## 🔐 Security Considerations

✅ **Implemented**
- Password hashing dengan bcryptjs
- JWT token-based authentication
- Email validation
- Soft deletes untuk users
- Role-based access control (RBAC) setup

⚠️ **To Implement Before Production**
- HTTPS enforcement
- CORS configuration
- Rate limiting untuk API
- CSRF protection untuk forms
- Input validation & sanitization
- Environment-specific configs (.env.production)
- Secure session storage (HttpOnly cookies)
- Dependency updates: `npm audit fix`

---

## 📊 Current Status

### **Completed**
- ✅ Database schema dengan 5 models
- ✅ Authentication system (login/logout)
- ✅ Master data CRUD operations (users, roles)
- ✅ Pagination untuk tables
- ✅ Clean Architecture structure
- ✅ Docker containerization
- ✅ Landing page components
- ✅ Dashboard with stats
- ✅ API endpoints (basic CRUD)

### **In Progress / To-Do**
- 🔄 Edit user functionality (form modal)
- 🔄 Role permissions management (RolePermission mapping)
- 🔄 Advanced search/filter untuk tables
- 🔄 Export functionality (CSV/PDF)
- 🔄 Activity logging & audit trails

### **Future Enhancements**
- 📝 Article/News module (create, edit, publish)
- 📊 Analytics & reporting
- 🔔 Notification system
- 📧 Email notifications
- 📱 Mobile app (React Native atau Flutter)
- 🌐 Multi-language support (i18n)
- 🎨 Theme customization
- 🔗 OAuth integration (Google, LDAP)

---

## 🧭 Project Navigation

### **Main Pages**
- `/` - Landing page (public)
- `/login` - Login page (public)
- `/dashboard` - Dashboard (protected)
- `/dashboard/master-data` - Master data management (protected)

### **API Routes**
- `/api/auth/*` - Authentication endpoints
- `/api/master-data/users/*` - User management API
- `/api/master-data/roles/*` - Role management API

---

## 🔗 Important Files Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage entry point |
| `src/presentation/pages/LandingPage.tsx` | Landing page composition |
| `src/presentation/pages/DashboardPage.tsx` | Dashboard with stats |
| `src/presentation/pages/MasterDataPage.tsx` | Master data tabs |
| `prisma/schema.prisma` | Database schema definition |
| `docker-compose.yml` | Service orchestration |
| `src/middleware.ts` | Next.js middleware |
| `package.json` | Dependencies & npm scripts |

---

## 📚 Learning Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Prisma ORM Docs](https://www.prisma.io/docs/)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [React 19 Docs](https://react.dev)
- [Docker Docs](https://docs.docker.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 👥 Project Info

- **Organization**: Suku Dinas Pendidikan Wilayah II Jakarta Utara
- **Created**: December 2025
- **Repository**: https://github.com/SyahiraIsnaeni/profile-sudindikju2
- **Contact**: sudin.jp2@jakarta.go.id

---

## 📝 Default Credentials (After Seeding)

```
Admin Account:
Email: admin@gmail.com
Password: admin123456

User Account:
Email: user@gmail.com
Password: user123456
```

---

**Last Updated**: December 5, 2025
