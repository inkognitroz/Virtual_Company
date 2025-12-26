# API Documentation

Complete REST API documentation for Virtual Company backend.

**Base URL**: `http://localhost:5000/api` (Development)  
**Production URL**: Update based on your deployment

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth Endpoints](#auth-endpoints)
  - [Role Endpoints](#role-endpoints)
  - [Message Endpoints](#message-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

Most endpoints require authentication via JWT (JSON Web Token).

### How to Authenticate

1. **Register or Login** to get a token
2. **Include token** in subsequent requests:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration

- Default: 7 days
- Configurable via `JWT_EXPIRE` environment variable

---

## Endpoints

### Health Check

#### `GET /api/health`

Check if API is running.

**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Auth Endpoints

### Register User

#### `POST /api/auth/register`

Create a new user account.

**Authentication**: Not required

**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Validation Rules**:
- `email`: Valid email format, unique
- `username`: 3-30 characters, unique
- `password`: Minimum 6 characters
- `name`: Required

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

---

### Login User

#### `POST /api/auth/login`

Authenticate user and get token.

**Authentication**: Not required

**Request Body**:
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Note**: `username` field accepts either username or email.

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get Current User

#### `GET /api/auth/me`

Get currently authenticated user's information.

**Authentication**: Required

**Headers**:
```
Authorization: Bearer <your-jwt-token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe"
    }
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

---

## Role Endpoints

### Get All Roles

#### `GET /api/roles`

Get all roles for the authenticated user.

**Authentication**: Required

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "name": "Product Manager",
      "avatar": "👨‍💼",
      "description": "Leads product strategy",
      "aiInstructions": "You are a strategic product manager...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "name": "Developer",
      "avatar": "👨‍💻",
      "description": "Software developer",
      "aiInstructions": "You are an experienced developer...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Single Role

#### `GET /api/roles/:id`

Get a specific role by ID.

**Authentication**: Required

**URL Parameters**:
- `id`: Role MongoDB ObjectId

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Product Manager",
    "avatar": "👨‍💼",
    "description": "Leads product strategy",
    "aiInstructions": "You are a strategic product manager...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Role not found"
}
```

**Error Response** (403 Forbidden):
```json
{
  "success": false,
  "message": "Not authorized to access this role"
}
```

---

### Create Role

#### `POST /api/roles`

Create a new role.

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Product Manager",
  "avatar": "👨‍💼",
  "description": "Leads product strategy and roadmap",
  "aiInstructions": "You are a strategic product manager. Focus on user needs and market fit."
}
```

**Validation Rules**:
- `name`: Required
- `avatar`: Required
- `description`: Optional
- `aiInstructions`: Optional

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Product Manager",
    "avatar": "👨‍💼",
    "description": "Leads product strategy and roadmap",
    "aiInstructions": "You are a strategic product manager...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Role

#### `PUT /api/roles/:id`

Update an existing role.

**Authentication**: Required

**URL Parameters**:
- `id`: Role MongoDB ObjectId

**Request Body** (all fields optional):
```json
{
  "name": "Senior Product Manager",
  "avatar": "👨‍💼",
  "description": "Updated description",
  "aiInstructions": "Updated AI instructions"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "Senior Product Manager",
    "avatar": "👨‍💼",
    "description": "Updated description",
    "aiInstructions": "Updated AI instructions",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### Delete Role

#### `DELETE /api/roles/:id`

Delete a role.

**Authentication**: Required

**URL Parameters**:
- `id`: Role MongoDB ObjectId

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Role deleted successfully",
  "data": {}
}
```

---

## Message Endpoints

### Get All Messages

#### `GET /api/messages`

Get all messages for the authenticated user.

**Authentication**: Required

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "userId": "507f1f77bcf86cd799439011",
      "sender": "John Doe",
      "senderType": "user",
      "roleId": null,
      "content": "Hello team!",
      "timestamp": "2024-01-01T10:00:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439015",
      "userId": "507f1f77bcf86cd799439011",
      "sender": "Product Manager",
      "senderType": "role",
      "roleId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Product Manager",
        "avatar": "👨‍💼"
      },
      "content": "Let's discuss the roadmap",
      "timestamp": "2024-01-01T10:05:00.000Z",
      "createdAt": "2024-01-01T10:05:00.000Z",
      "updatedAt": "2024-01-01T10:05:00.000Z"
    }
  ]
}
```

---

### Create Message

#### `POST /api/messages`

Create a new message.

**Authentication**: Required

**Request Body**:
```json
{
  "sender": "John Doe",
  "senderType": "user",
  "roleId": null,
  "content": "This is my message"
}
```

**Or with role**:
```json
{
  "sender": "Product Manager",
  "senderType": "role",
  "roleId": "507f1f77bcf86cd799439012",
  "content": "Message from role"
}
```

**Validation Rules**:
- `sender`: Required
- `senderType`: "user" or "role"
- `roleId`: Optional (MongoDB ObjectId if senderType is "role")
- `content`: Required

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Message created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "sender": "John Doe",
    "senderType": "user",
    "roleId": null,
    "content": "This is my message",
    "timestamp": "2024-01-01T10:00:00.000Z",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

---

### Delete Message

#### `DELETE /api/messages/:id`

Delete a specific message.

**Authentication**: Required

**URL Parameters**:
- `id`: Message MongoDB ObjectId

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Message deleted successfully",
  "data": {}
}
```

---

### Delete All Messages

#### `DELETE /api/messages`

Delete all messages for the authenticated user.

**Authentication**: Required

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "All messages deleted successfully",
  "data": {}
}
```

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### HTTP Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created)
- `400` - Bad Request (Validation error)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Not authorized)
- `404` - Not Found (Resource not found)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

**Default Limits**:
- Window: 15 minutes
- Max requests: 100 per window

**Response when limit exceeded** (429):
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704110400
```

---

## Example Usage

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123","name":"Test User"}'

# Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  | jq -r '.data.token')

# Get roles
curl http://localhost:5000/api/roles \
  -H "Authorization: Bearer $TOKEN"

# Create role
curl -X POST http://localhost:5000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Manager","avatar":"👨‍💼","description":"Team manager"}'
```

### Using JavaScript (Fetch API)

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    password: 'password123'
  })
});

const { data } = await response.json();
const token = data.token;

// Get roles
const rolesResponse = await fetch('http://localhost:5000/api/roles', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const roles = await rolesResponse.json();
console.log(roles);
```

---

## Postman Collection

Import this URL to Postman for a ready-made API collection:

```
https://www.getpostman.com/collections/[collection-id]
```

Or manually create requests using the examples above.

---

For more information, see:
- [Backend Setup Guide](BACKEND_SETUP.md)
- [Main README](README.md)
