# Clean Architecture - Clinic Management Dashboard Backend

## Overview

This backend follows **Clean Architecture** principles to ensure the codebase is:

- ✅ Independent of frameworks
- ✅ Testable
- ✅ Independent of UI
- ✅ Independent of databases
- ✅ Independent of external agencies

---

## Architecture Layers

```
┌─────────────────────────────────────────┐
│         Interface Layer (Web)            │  ← Controllers, Routes, Middleware
├─────────────────────────────────────────┤
│      Application Layer (Use Cases)       │  ← Services, DTOs
├─────────────────────────────────────────┤
│       Domain Layer (Business Logic)      │  ← Entities, Interfaces
├─────────────────────────────────────────┤
│     Infrastructure Layer (Data Access)   │  ← Repositories, Database
├─────────────────────────────────────────┤
│      Shared/Utilities Layer (Cross-cut)  │  ← Logger, Error Handling
└─────────────────────────────────────────┘
```

### Dependency Flow

```
Interface → Application → Domain ← Infrastructure
                           ↑
                         Shared
```

**Key Rule:** Inner layers (Domain) never depend on outer layers (Infrastructure)

---

## Directory Structure

```
src/
├── domain/                          # 🎯 Business Logic Layer
│   ├── entities/
│   │   └── User.ts                 # Core business entity
│   ├── repositories/
│   │   ├── IUserRepository.ts      # User repository interface (contract)
│   │   └── IAuthRepository.ts      # Auth repository interface (contract)
│   ├── services/
│   │   └── IUserAuthService.ts     # Business logic interface
│   └── errors/
│       ├── AppError.ts             # Base error class
│       ├── AuthError.ts            # Auth-specific errors
│       ├── DatabaseError.ts        # Database-specific errors
│       ├── ValidationError.ts      # Validation errors
│       └── ErrorTypes.ts           # Error type constants
│
├── application/                     # 🔧 Use Cases & DTOs Layer
│   ├── services/
│   │   └── UserAuthService.ts      # Business logic implementation
│   └── dto/
│       ├── requests/
│       │   ├── LoginDto.ts         # Login request DTO
│       │   ├── CreateUserDto.ts    # Create user request DTO
│       │   └── RefreshTokenDto.ts  # Refresh token request DTO
│       └── responses/
│           ├── ApiResponse.ts      # Standard API response interface
│           ├── LoginResponseDto.ts # Login response DTO
│           └── RefreshTokenResponseDto.ts # Refresh token response DTO
│
├── infrastructure/                  # 💾 Data Access Layer
│   ├── database/
│   │   ├── supabase.ts            # Supabase client initialization
│   │   ├── migrations/            # Database migrations
│   │   │   ├── 001_database_v1.sql
│   │   │   ├── 002_adding_rls.sql
│   │   │   └── 003_convert_users_id_to_uuid.sql
│   │   └── rls_rules.md           # RLS policy documentation
│   └── repositories/
│       ├── UserRepository.ts       # User data access (implements IUserRepository)
│       └── AuthRepository.ts       # Auth data access (implements IAuthRepository)
│
├── interface/                       # 🌐 Web/Presentation Layer
│   ├── controllers/
│   │   └── authController.ts      # HTTP request handlers
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # Authentication middleware
│   │   ├── errorHanlder.ts        # Global error handler
│   │   ├── requireAuth.ts         # Authorization middleware
│   │   └── Validate.ts            # Request validation middleware
│   └── routes/
│       └── auth.route.ts          # Route definitions
│
├── shared/                          # 🔧 Cross-Cutting Concerns
│   ├── scripts/
│   │   └── init.ts                # Database initialization script
│   └── utils/
│       ├── logger.ts              # Logging utility
│       └── asyncWrapper.ts        # Async route wrapper
│
└── index.ts                         # Application entry point
```

---

## Layer Responsibilities

### 1. **Domain Layer** (Business Logic)

**Location:** `src/domain/`

**Responsibility:**

- Define core business entities (User, Role, etc.)
- Define business rules and constraints
- Create interfaces that other layers depend on
- Contain no external dependencies

**Files:**

- `entities/User.ts` - Core User entity with business logic
- `repositories/IUserRepository.ts` - Contract that repositories must follow
- `services/IUserAuthService.ts` - Contract for authentication service
- `errors/` - Custom error types

**Example - User Entity:**

```typescript
export class User {
  private id: string;
  private email: string;
  private role: "admin" | "doctor" | "receptionist";

  constructor(id, email, firstName, lastName, role) {
    // Business rule: validate role
    if (!["admin", "doctor", "receptionist"].includes(role)) {
      throw new Error("Invalid role");
    }
    this.role = role;
  }

  getRole(): string {
    return this.role;
  }
}
```

---

### 2. **Application Layer** (Use Cases)

**Location:** `src/application/`

**Responsibility:**

- Implement business use cases
- Coordinate between domain and infrastructure
- Handle DTOs (Data Transfer Objects) for API requests/responses
- Orchestrate data flow

**Files:**

- `services/UserAuthService.ts` - Implements IUserAuthService
- `dto/requests/` - Input validation schemas
- `dto/responses/` - Output data structures

**Example - Use Case Flow:**

```typescript
async createUser(user: User, password: string): Promise<User> {
    // 1. Validate business rules (Domain)
    if (!password || password.length < 6) {
        throw new Error("Invalid password");
    }

    // 2. Call repository to persist (Infrastructure)
    const result = await this.userRepository.createUser(user, password);

    // 3. Return to controller
    return result;
}
```

---

### 3. **Domain Entities**

**Location:** `src/domain/`

**Responsibility:**

- Represent core business objects
- Encapsulate business logic
- Validate business rules

**Example:**

```typescript
// User is a domain entity with pure business logic
const user = new User(id, email, firstName, lastName, "doctor");
user.getRole(); // Business-safe operation
```

---

### 4. **Infrastructure Layer** (Data Access)

**Location:** `src/infrastructure/`

**Responsibility:**

- Implement repository interfaces
- Handle database operations
- Manage external service calls (Supabase, APIs, etc.)
- Convert database models to domain entities

**Files:**

- `repositories/UserRepository.ts` - Implements IUserRepository
- `repositories/AuthRepository.ts` - Implements IAuthRepository
- `database/supabase.ts` - Database client setup

**Example - Repository Implementation:**

```typescript
export class UserRepository implements IUserRepository {
    async createUser(user: User, password: string): Promise<User> {
        // Database-specific logic (Supabase)
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: user.getEmail(),
            password: password
        });

        // Convert to domain entity and return
        return new User(data.user.id, ...);
    }
}
```

---

### 5. **Interface/Presentation Layer** (Web)

**Location:** `src/interface/`

**Responsibility:**

- Handle HTTP requests/responses
- Route incoming requests
- Apply middleware (auth, validation, error handling)
- Return HTTP responses

**Files:**

- `controllers/authController.ts` - Request handlers
- `routes/auth.route.ts` - Route definitions
- `middlewares/` - Cross-cutting concerns

**Example - Controller:**

```typescript
async createUser(req: Request, res: Response) {
    const { email, password, firstName, lastName, role } = req.body;

    // 1. Create domain entity
    const user = new User('', email, firstName, lastName, role);

    // 2. Call use case
    const result = await this.userAuthService.createUser(user, password);

    // 3. Return response (ApiResponse<T> format)
    res.json({
        success: true,
        status: 201,
        data: result.toJSON(),
        error: null
    });
}
```

---

### 6. **Shared Layer** (Cross-Cutting Concerns)

**Location:** `src/shared/`

**Responsibility:**

- Provide utilities used across all layers
- Logging
- Error handling
- Helper functions

**Files:**

- `utils/logger.ts` - Centralized logging
- `utils/asyncWrapper.ts` - Async error wrapper
- `scripts/init.ts` - Database initialization

---

## Data Flow Examples

### Example 1: User Login

```
1. HTTP Request
   POST /auth/login
   { email: "user@example.com", password: "pass123" }
         ↓
2. Interface Layer (Controller)
   authController.login(req, res)
   ├─ Extract email & password from request
   ├─ Call userAuthService.loginUser(email, password)
         ↓
3. Application Layer (Service)
   UserAuthService.loginUser(email, password)
   ├─ Validate input (DTO validation)
   ├─ Call authRepository.login(email, password)
         ↓
4. Infrastructure Layer (Repository)
   AuthRepository.login(email, password)
   ├─ Call Supabase Auth API
   ├─ Create User domain entity from response
   ├─ Return User to service
         ↓
5. Application Layer
   ├─ Format response with tokens
   ├─ Return LoginResponseDto
         ↓
6. Interface Layer
   ├─ Convert to JSON
   ├─ Return HTTP 200 response
         ↓
7. HTTP Response
   {
     "success": true,
     "status": 200,
     "data": {
       "accessToken": "...",
       "refreshToken": "...",
       "expiresIn": 3600,
       "tokenType": "Bearer",
       "user": { "id": "...", "email": "...", "role": "..." }
     },
     "error": null
   }
```

### Example 2: Create User (Admin Only)

```
1. HTTP Request
   POST /auth/create-user
   Headers: { Authorization: "Bearer <token>" }
   Body: { email, password, firstName, lastName, role }
         ↓
2. Middleware Chain
   ├─ authMiddleware → Verify token & load user
   ├─ requireRole(['admin']) → Check authorization
   ├─ validate(CreateUserDtoSchema) → Validate request body
         ↓
3. Interface Layer (Controller)
   authController.createUser(req, res)
   ├─ Extract data from validated request
   ├─ Create User domain entity
   ├─ Call userAuthService.createUser(user, password)
         ↓
4. Application Layer (Service)
   UserAuthService.createUser(user, password)
   ├─ Validate business rules
   ├─ Call userRepository.createUser(user, password)
         ↓
5. Infrastructure Layer (Repository)
   UserRepository.createUser(user, password)
   ├─ Create user in Supabase Auth
   ├─ Create profile in Supabase Database
   ├─ Return User entity
         ↓
6. Application Layer
   ├─ Return User entity
         ↓
7. Interface Layer
   ├─ Convert to JSON response
   ├─ Return HTTP 201 response
         ↓
8. HTTP Response
   {
     "success": true,
     "status": 201,
     "data": { ... },
     "error": null
   }
```

---

## Design Patterns Used

### 1. **Repository Pattern**

Abstracts data access logic behind interfaces.

```typescript
// Domain defines the contract
export interface IUserRepository {
  createUser(user: User, password: string): Promise<User>;
  findByAuthUUID(authUUID: string): Promise<User | null>;
}

// Infrastructure implements it
export class UserRepository implements IUserRepository {
  // Implementation details
}
```

### 2. **Dependency Injection**

Dependencies are injected rather than created.

```typescript
export class UserAuthService {
  constructor(
    private userRepository: IUserRepository,
    private authRepository: IAuthRepository
  ) {}
  // Service uses injected dependencies
}
```

### 3. **DTO (Data Transfer Object)**

Separates API contracts from domain entities.

**ApiResponse Interface:**
All API responses follow a standard format:

```typescript
export interface ApiResponse<T> {
  success: boolean; // Indicates if request was successful
  status: number; // HTTP status code (200, 201, 400, 401, etc.)
  data: T | null; // Response data (null on error)
  error: any | null; // Error details (null on success)
}
```

**Request DTO:**

```typescript
// Request DTO
export const CreateUserDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["admin", "doctor", "receptionist"]),
});
```

**Response DTO:**

```typescript
// Response DTOs implement toJSON() to return ApiResponse format
export class LoginResponseDto {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public user: User
  ) {}

  toJSON(): ApiResponse<any> {
    return {
      success: true,
      status: 200,
      data: {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        user: this.user.toJSON(),
      },
      error: null,
    };
  }
}
```

### 4. **Service Layer Pattern**

Business logic encapsulated in services.

```typescript
// UserAuthService orchestrates use cases
async loginUser(email: string, password: string): Promise<LoginResponseDto> {
    // Complex business logic here
    const authResult = await this.authRepository.login(email, password);
    return new LoginResponseDto(...);
}
```

---

## Benefits of This Architecture

| Benefit             | How It Helps                                          |
| ------------------- | ----------------------------------------------------- |
| **Testability**     | Can test each layer independently                     |
| **Maintainability** | Clear separation of concerns                          |
| **Scalability**     | Easy to add new features                              |
| **Flexibility**     | Can swap implementations (e.g., PostgreSQL → MongoDB) |
| **Reusability**     | Services can be reused across different controllers   |
| **Independence**    | Domain logic independent of frameworks                |

---

## How to Add a New Feature

### Example: Add "Change Password" Endpoint

1. **Domain Layer** (Business rules)

   ```typescript
   // domain/services/IUserAuthService.ts
   changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
   ```

2. **Application Layer** (Use case implementation)

   ```typescript
   // application/services/UserAuthService.ts
   async changePassword(userId: string, oldPassword: string, newPassword: string) {
       // Verify old password
       // Update password in repository
   }
   ```

3. **Infrastructure Layer** (Data access)

   ```typescript
   // infrastructure/repositories/AuthRepository.ts
   async updatePassword(userId: string, newPassword: string): Promise<void> {
       // Call Supabase API
   }
   ```

4. **Interface Layer** (HTTP endpoint)

   ```typescript
   // interface/controllers/authController.ts
   async changePassword(req: AuthRequest, res: Response) {
       const result = await this.userAuthService.changePassword(...);
       res.json(result);
   }

   // interface/routes/auth.route.ts
   router.post("/change-password", authMiddleware, asyncWrapper(...));
   ```

---

## API Response Format

All API endpoints follow a standardized response format using the `ApiResponse<T>` interface:

### ApiResponse Interface

```typescript
export interface ApiResponse<T> {
  success: boolean; // true for successful requests, false for errors
  status: number; // HTTP status code (200, 201, 400, 401, 403, 500, etc.)
  data: T | null; // Response payload (null when success is false)
  error: any | null; // Error details (null when success is true)
}
```

### Success Response Example

```json
{
  "success": true,
  "status": 200,
  "data": {
    "accessToken": "...",
    "user": { "id": "...", "email": "..." }
  },
  "error": null
}
```

### Error Response Example

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid credentials",
    "context": { ... }
  }
}
```

### Implementation

**Controllers** return responses in ApiResponse format:

```typescript
res.json({
  success: true,
  status: 200,
  data: result.toJSON(),
  error: null,
});
```

**Error handlers** catch exceptions and format them as ApiResponse:

```typescript
return res.status(401).json({
  success: false,
  status: 401,
  data: null,
  error: {
    type: ErrorTypes.AuthenticationError,
    message: err.message,
  },
});
```

**Benefits:**

- ✅ Consistent response structure across all endpoints
- ✅ Easy to parse on the client side
- ✅ Clear distinction between success and error states
- ✅ HTTP status code included in response body for reference

---

## Error Handling

All errors flow through the hierarchy:

```
Domain Errors (AppError)
    ├─ AuthError (login, token issues)
    ├─ DatabaseError (data access failures)
    └─ ValidationError (input validation)
         ↓
    Application Layer (catches & re-throws)
         ↓
    Interface Layer (errorHandler middleware)
         ↓
    HTTP Error Response
```

---

## Best Practices

✅ **DO:**

- Keep business logic in Domain entities and Services
- Use interfaces to define contracts
- Inject dependencies
- Use DTOs for API communication
- Return domain entities from repositories

❌ **DON'T:**

- Put database logic in controllers
- Import Infrastructure in Domain
- Mix concerns in layers
- Hardcode dependencies
- Expose database entities directly to clients

---

## Next Steps

1. Review the existing code structure
2. Follow this pattern when adding new features
3. Keep domain logic separate from infrastructure
4. Use dependency injection for all services
5. Write tests for each layer independently

Happy coding! 🚀
