# Authentication API Documentation

## Base URL

```
http://localhost:3000/api/auth
```

---

## 1. Login

**Endpoint:** `POST /login`

**Description:** Authenticate user with email and password

**Authentication:** Not required

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer",
    "user": {
      "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "doctor"
    }
  },
  "error": null
}
```

**Set-Cookie Header:**

```
Set-Cookie: refreshToken=sbr_1234567890abcdef; Path=/api/auth/refresh-token; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

> [!IMPORTANT]
> The refresh token is **NOT** returned in the response body. It is stored in a secure HTTP-only cookie that is automatically sent with subsequent requests to `/api/auth/refresh-token`.

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid login credentials"
  }
}
```

---

## 2. Create User

**Endpoint:** `POST /create-user`

**Description:** Create a new user (admin only)

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "securepass123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "doctor"
}
```

**Valid Roles:**

- `admin`
- `doctor`
- `receptionist`

**Response (201 Created):**

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "uuid-here",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "doctor"
  },
  "error": null
}
```

**Error (400):**

```json
{
  "success": false,
  "status": 400,
  "data": null,
  "error": {
    "type": "ValidationError",
    "message": "Email already exists"
  }
}
```

**Error (403):**

```json
{
  "success": false,
  "status": 403,
  "data": null,
  "error": {
    "message": "Access denied. Required roles: admin"
  }
}
```

---

## 3. Refresh Token

**Endpoint:** `POST /refresh-token`

**Description:** Get a new access token using the refresh token stored in HTTP-only cookie

**Authentication:** Not required (uses cookie)

**Request Body:** Empty (refresh token is read from cookie)

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "token_type": "Bearer"
  },
  "error": null
}
```

**Set-Cookie Header:**

```
Set-Cookie: refreshToken=sbr_new_token; Path=/api/auth/refresh-token; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

> [!IMPORTANT]
> The new refresh token is **NOT** returned in the response body. It is automatically rotated and stored in a new secure HTTP-only cookie.

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Refresh token not found"
  }
}
```

_OR_

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid or expired refresh token"
  }
}
```

---

## 4. Logout

**Endpoint:** `POST /logout`

**Description:** Logout user and invalidate session

**Authentication:** Required (Bearer token)

**Request Body:** Empty

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "message": "Logged out successfully"
  },
  "error": null
}
```

**Set-Cookie Header:**

```
Set-Cookie: refreshToken=; Path=/api/auth/refresh-token; Expires=Thu, 01 Jan 1970 00:00:00 GMT
```

> [!NOTE]
> The logout endpoint clears the refresh token cookie by setting its expiration date to the past.

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid or expired token"
  }
}
```

---

## 5. Get Current User (Me)

**Endpoint:** `POST /me`

**Description:** Retrieve the authenticated user's profile information

**Authentication:** Required (Bearer token)

**Request Body:** Empty

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "c0b837f3-5a95-44b6-bb60-7aeccc4afe9f",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "doctor"
  },
  "error": null
}
```

**Error (401):**

```json
{
  "success": false,
  "status": 401,
  "data": null,
  "error": {
    "type": "AuthenticationError",
    "message": "Invalid or expired token"
  }
}
```

---

## Authentication Header Format

All protected endpoints require:

```
Authorization: Bearer <access_token>
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

## Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request / Validation Error       |
| 401  | Unauthorized / Invalid Token         |
| 403  | Forbidden / Insufficient Permissions |
| 500  | Internal Server Error                |

---

## Common Errors

| Error                        | Cause                                   | Solution                   |
| ---------------------------- | --------------------------------------- | -------------------------- |
| Invalid login credentials    | Wrong email/password                    | Verify credentials         |
| Invalid or expired token     | Token expired                           | Use refresh token endpoint |
| Only admins can create users | Non-admin trying to create user         | Use admin account          |
| Validation failed            | Missing/invalid fields                  | Check request body format  |
| User profile not found       | User exists in auth but not in database | Contact admin              |

---

## 6. Cookie Security

### Refresh Token Storage

Refresh tokens are stored in **secure HTTP-only cookies** for enhanced security:

| Property   | Value                     | Purpose                                                    |
| ---------- | ------------------------- | ---------------------------------------------------------- |
| `httpOnly` | `true`                    | Prevents JavaScript access, protecting against XSS attacks |
| `secure`   | `true` (in production)    | Ensures cookie is only sent over HTTPS                     |
| `sameSite` | `strict`                  | Prevents CSRF attacks by restricting cross-site requests   |
| `maxAge`   | `604800000` (7 days)      | Cookie expires after 7 days                                |
| `path`     | `/api/auth/refresh-token` | Cookie is only sent to the refresh token endpoint          |

### Security Benefits

- **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript, preventing token theft via XSS attacks
- **CSRF Protection**: SameSite=Strict prevents the cookie from being sent in cross-site requests
- **Automatic Token Rotation**: Each refresh generates a new refresh token, limiting the window of vulnerability
- **Reduced Attack Surface**: Refresh tokens are never exposed in response bodies or client-side storage

### Client Implementation Notes

- No need to manually store or send refresh tokens
- Cookies are automatically included in requests to `/api/auth/refresh-token`
- Ensure your HTTP client is configured to handle cookies (e.g., `credentials: 'include'` in fetch API)

---

## 7. Doctors API

### 7.1 Create Doctor

**Endpoint:** `POST /doctors`

**Description:** Create a new doctor profile (Admin only)

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Request Body:**

```json
{
  "firstName": "Gregory",
  "lastName": "House",
  "email": "house@princeton.edu",
  "password": "password123",
  "role": "DOCTOR",
  "salary": 250000,
  "isMedicalDirector": true,
  "specialization": "Diagnostician"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "status": 201,
  "data": {
    "id": "uuid-here",
    "firstName": "Gregory",
    "lastName": "House",
    "email": "house@princeton.edu",
    "role": "DOCTOR",
    "salary": 250000,
    "isMedicalDirector": true,
    "specialization": "Diagnostician",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  },
  "error": null
}
```

### 7.2 Get All Doctors

**Endpoint:** `GET /doctors`

**Description:** Retrieve a paginated list of doctors

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "doctors": [
      {
        "id": "uuid-here",
        "firstName": "Gregory",
        "lastName": "House",
        "email": "house@princeton.edu",
        "specialization": "Diagnostician",
        "role": "DOCTOR"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "error": null
}
```

### 7.3 Get Doctor by ID

**Endpoint:** `GET /doctors/:id`

**Description:** Retrieve a specific doctor's details

**Authentication:** Required (Bearer token)

**Authorization:** Admin role required

**Response (200 OK):**

```json
{
  "success": true,
  "status": 200,
  "data": {
    "id": "uuid-here",
    "firstName": "Gregory",
    "lastName": "House",
    "email": "house@princeton.edu",
    "specialization": "Diagnostician",
    "role": "DOCTOR",
    "salary": 250000,
    "isMedicalDirector": true
  },
  "error": null
}
```

### 7.4 Update Doctor (Placeholder)

**Endpoint:** `PUT /doctors/:id`

**Description:** Update doctor details (Not yet implemented)

### 7.5 Delete Doctor (Placeholder)

**Endpoint:** `DELETE /doctors/:id`

**Description:** Delete a doctor (Not yet implemented)
