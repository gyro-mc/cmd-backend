# Clinic Management Dashboard - Backend Architecture

## 📋 Project Overview

A **clean architecture-based** backend for a clinic management system built with **Node.js/Express**, **TypeScript**, and **Supabase** (PostgreSQL + Auth).

---

## 🏗️ Architecture Layers

### **1. Domain Layer** (`domain/`)
Core business logic and entities - **no framework dependencies**

```
domain/
├── entities/
│   └── User.ts                 # Core user entity
├── errors/
│   ├── AppError.ts             # Base error class
│   ├── AuthError.ts            # Authentication-specific errors
│   └── ErrorTypes.ts           # Error type constants
├── repositories/               # Repository interfaces (contracts)
└── services/
    └── TokenService.ts         # JWT token business logic
```

**Purpose:** Defines what the app does, independent of frameworks.

---

### **2. Application Layer** (`application/`)
Use cases and business orchestration - **depends only on domain**

```
application/
├── dto/                        # Data Transfer Objects
│   ├── CreateUserDto.ts
│   ├── LoginDto.ts
│   └── UserResponseDto.ts
├── services/                   # Application services (use cases)
│   ├── AuthService.ts          # Authentication orchestration
│   ├── UserAuthService.ts      # User auth workflows
│   └── UserManagementService.ts
└── use-cases/                  # Specific use case handlers (optional)
    ├── LoginUseCase.ts
    ├── RegisterUseCase.ts
    └── LogoutUseCase.ts
```

**Purpose:** Orchestrates domain entities and repositories to fulfill business requirements.

---

### **3. Infrastructure Layer** (`infrastructure/`)
Framework-specific implementations - **depends on domain interfaces**

```
infrastructure/
├── database/
│   ├── supabase.ts             # Supabase client initialization
│   ├── rls_rules.md            # Row-level security documentation
│   └── migrations/
│       ├── 001_database_v1.sql # Initial schema
│       └── 002_adding_rls.sql  # RLS policies
└── repositories/
    └── UserRepository.ts       # Implements IUserRepository interface
```

**Purpose:** Implements domain interfaces using specific technologies (Supabase, PostgreSQL).

---

### **4. Interface Layer** (`interface/`)
HTTP handling and external API - **depends on application layer**

```
interface/
├── controllers/
│   └── authController.ts       # Auth HTTP handlers (static methods)
├── routes/
│   └── auth.route.ts           # Route definitions
├── middlewares/
│   ├── authMiddleware.ts       # JWT verification & role-based access
│   ├── errorHandler.ts         # Global error handler
│   └── requireAuth.ts          # Authentication requirement
└── validators/                 # (Optional) Request validation
```

**Purpose:** Handles HTTP requests/responses and routes.

---

### **5. Shared Layer** (`shared/`)
Cross-cutting utilities used across all layers

```
shared/
└── utils/
    ├── asyncWrapper.ts         # Async error handler wrapper
    └── logger.ts               # Logging utility
```

**Purpose:** Reusable utilities, logging, helpers.

---

### **6. Configuration** (`config/`)
Dependency injection and app setup

```
config/
└── container.ts                # IoC container for dependency injection
```

**Purpose:** Centralizes dependency management and configuration.

---

## 🔐 Authentication & Authorization Flow

### **Authentication Process**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Client sends login request with email & password          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. AuthController.login() → AuthService.login()             │
│    - Calls Supabase Auth signInWithPassword()                │
│    - Receives JWT token & user UUID                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Server returns JWT token to client                        │
└────────────────┬────────────────────────────────────────────┘
                 │
        (Client stores token)
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Client includes token: Authorization: Bearer <token>      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. authMiddleware verifies token                             │
│    - Validates Bearer format                                 │
│    - Calls supabase.auth.getUser(token)                      │
│    - Looks up user in database (auth_uuid → user.id)         │
│    - Fetches role from users.role_id → roles table           │
│    - Attaches user object to request                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. (Optional) requireRole() checks authorization             │
│    - Verifies user.role is in allowed roles list             │
│    - Allows or denies request based on role                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Controller processes authenticated request                │
└─────────────────────────────────────────────────────────────┘
```

### **Request Object Enrichment**

```typescript
// After authMiddleware, req.user contains:
{
    id: string;           // UUID from Supabase Auth
    email: string;        // User email
    role: string;         // Role name (admin, doctor, receptionist, patient)
    userId: number;       // Local database user ID (used for RLS)
}
```

---

## 🔒 Security Architecture

### **Row-Level Security (RLS) Policies**

Database enforces access control at the SQL level:

| Table | Admin | Doctor | Receptionist | Patient |
|-------|-------|--------|--------------|---------|
| **users** | CRUD | — | — | — |
| **doctors** | CRUD | — | — | — |
| **patients** | CRUD | CRUD own | — | — |
| **appointments** | CRUD | INSERT + SELECT own + DELETE own | CRUD | — |
| **rooms** | CRUD | — | CRUD | — |
| **patient_medical_files** | CRUD | SELECT own | — | — |
| **appointment_results** | CRUD | SELECT own | — | — |

### **Auth Flow Security**

1. **Supabase manages authentication** - passwords never stored locally
2. **JWT tokens** - stateless, time-limited
3. **Database verification** - every request validates user exists
4. **RLS enforcement** - database blocks unauthorized access
5. **Authenticated client** - queries respect user's permissions

---

## 📊 Data Models

### **Core Tables**

```sql
users
├── id (INT, PRIMARY KEY)
├── email (VARCHAR, UNIQUE)
├── auth_uuid (UUID, references Supabase Auth)
├── role_id (INT, FK → roles)
├── first_name (TEXT)
├── last_name (TEXT)
└── timestamps (created_at, updated_at)

roles
├── id (INT, PRIMARY KEY)
├── name (VARCHAR, UNIQUE) - admin, doctor, receptionist, patient
└── description (TEXT)

doctors
├── id (INT, PRIMARY KEY, FK → users)
├── salary (DECIMAL)
├── is_medical_director (BOOLEAN)
└── timestamps

patients
├── id (INT, PRIMARY KEY, FK → users)
├── doctor_id (INT, FK → doctors)
├── address (TEXT)
├── phone_number (VARCHAR)
├── birth_date (DATE)
├── profession (TEXT)
├── children_number (INT)
├── family_situation (TEXT)
└── timestamps

appointments
├── id (INT, PRIMARY KEY)
├── patient_id (INT, FK → patients)
├── doctor_id (INT, FK → doctors)
├── room_id (INT, FK → rooms)
├── appointment_date (TIMESTAMP)
├── status (VARCHAR)
└── timestamps

rooms
├── id (INT, PRIMARY KEY)
├── name (VARCHAR)
├── capacity (INT)
└── timestamps

patient_medical_files
├── id (INT, PRIMARY KEY)
├── patient_id (INT, FK → patients)
├── doctor_id (INT, FK → doctors)
├── file_url (TEXT)
└── timestamps

appointment_results
├── id (INT, PRIMARY KEY)
├── appointment_id (INT, FK → appointments)
├── diagnosis (TEXT)
├── treatment (TEXT)
├── notes (TEXT)
└── timestamps
```

---

## 🔄 Request/Response Flow Example

### **Login Request**

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "doctor@clinic.com",
  "password": "securePassword123"
}
```

### **Processing Steps**

1. **Route** (`auth.route.ts`)
   - Matches POST /api/auth/login
   - Calls `AuthController.login()`

2. **Controller** (`authController.ts`)
   - Extracts email & password from request body
   - Calls `AuthService.login(email, password)`

3. **Application Service** (`AuthService.ts`)
   - Calls `supabaseAdmin.auth.signInWithPassword()`
   - Gets JWT token & user UUID
   - Queries database for user details
   - Returns `{ token, user }`

4. **Controller Response**
   ```json
   {
     "success": true,
     "token": "eyJhbGciOiJIUzI1NiIs...",
     "user": {
       "id": "550e8400-e29b-41d4-a716-446655440000",
       "email": "doctor@clinic.com",
       "role": "doctor"
     }
   }
   ```

---

### **Protected Request with Authentication**

```
GET /api/appointments
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### **Processing Steps**

1. **Route** - Middleware attached
   ```typescript
   router.get('/appointments', authMiddleware, requireRole(['doctor', 'admin']), controller.getAppointments);
   ```

2. **authMiddleware**
   - Extracts token from Authorization header
   - Verifies token with Supabase
   - Looks up user in database
   - Fetches user's role
   - Attaches `req.user` object

3. **requireRole(['doctor', 'admin'])**
   - Checks if `req.user.role` is in allowed roles
   - Returns 403 if unauthorized

4. **Controller**
   - Uses `req.user.userId` for RLS queries
   - Database enforces: doctor only sees own appointments
   - Returns filtered results

---

## 🛠️ Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Language** | TypeScript | Type safety |
| **Framework** | Express.js | HTTP server |
| **Database** | PostgreSQL (Supabase) | Data persistence |
| **Auth** | Supabase Auth | User authentication |
| **Auth Protocol** | JWT | Stateless authentication |
| **ORM/Query** | Supabase Client | Database queries |
| **Security** | RLS (PostgreSQL) | Row-level access control |
| **Config** | dotenv | Environment variables |
| **Logging** | Custom Logger | Application logging |

---

## 📁 Project Structure Summary

```
backend/
├── src/
│   ├── index.ts                    # Entry point
│   ├── domain/                     # Business logic (no dependencies)
│   ├── application/                # Use cases & orchestration
│   ├── infrastructure/             # Framework implementations
│   ├── interface/                  # HTTP layer
│   ├── shared/                     # Utilities
│   └── config/                     # Configuration & DI
├── migrations/                     # Database migrations
├── package.json
├── tsconfig.json
└── .env                            # Environment variables
```

---

## 🎯 Design Patterns Used

1. **Clean Architecture** - Clear separation of concerns
2. **Dependency Injection** - Loose coupling, easy testing
3. **Repository Pattern** - Abstract data access
4. **Middleware Pattern** - Request processing pipeline
5. **Error Handling Pattern** - Custom error classes
6. **Factory Pattern** - CreateSupabaseClient()
7. **Async Wrapper Pattern** - Error handling in routes

---

## ✅ Security Features

- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Row-level security (RLS) at database level
- ✅ Password hashing (Supabase manages)
- ✅ Bearer token validation
- ✅ User identity verification before DB queries
- ✅ Error messages don't leak information
- ✅ Authenticated client respects permissions

---

## 📈 Scalability Considerations

1. **Database** - PostgreSQL with RLS scales well
2. **Stateless** - JWT tokens = horizontal scaling
3. **Caching** - Can add Redis for sessions/tokens
4. **Rate Limiting** - Ready to integrate
5. **Logging** - Centralized logging pattern in place
6. **Error Handling** - Structured error handling

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured (.env)
- [ ] Database migrations applied
- [ ] Supabase project set up
- [ ] Auth policies enabled
- [ ] RLS policies created
- [ ] API keys secured
- [ ] Error logging configured
- [ ] CORS configured
- [ ] Rate limiting added
- [ ] Request validation added

---

## 📝 Development Guidelines

### **Adding New Feature**

1. **Define Domain** (`domain/entities/`, `domain/services/`)
2. **Create Repository Interface** (`domain/repositories/`)
3. **Implement Repository** (`infrastructure/repositories/`)
4. **Create Application Service** (`application/services/`)
5. **Create DTOs** (`application/dto/`)
6. **Create Controller** (`interface/controllers/`)
7. **Define Routes** (`interface/routes/`)
8. **Add RLS Policies** (if DB table)

### **Adding New Endpoint**

```typescript
// 1. Define route
router.post('/users', authMiddleware, requireRole(['admin']), userController.create);

// 2. Add controller method
static async create(req: AuthRequest, res: Response) {
    const userId = req.user?.userId;
    // ...
}

// 3. Call application service
const result = await userService.createUser(data);
```

---

## 🔗 Key Interfaces

### **AuthRequest** (Extended Express Request)
```typescript
interface AuthRequest extends Request {
    user?: {
        id: string;           // UUID
        email: string;
        role: string;
        userId: number;       // Database ID
    };
}
```

### **IUserRepository** (Contract)
```typescript
interface IUserRepository {
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDto): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
}
```

---

## 📊 Architecture Rating: **8.5/10** ⭐

**Strengths:**
- ✅ Clean, layered architecture
- ✅ Strong separation of concerns
- ✅ Security-first design
- ✅ Scalable structure
- ✅ Type-safe (TypeScript)

**Future Improvements:**
- 🔄 Add comprehensive service layer
- 🔄 Implement caching layer
- 🔄 Add request validation
- 🔄 Add integration tests
- 🔄 Document API endpoints

---

**Last Updated:** November 19, 2025
**Version:** 1.0
