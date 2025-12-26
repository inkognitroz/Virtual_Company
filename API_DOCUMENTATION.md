# Virtual Company API Documentation

Complete API reference for the Virtual Company backend.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-backend-url.com`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Obtain a token by calling the `/api/auth/login` endpoint.

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "name": "Full Name",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "name": "Full Name",
  "created_at": "2024-01-01T00:00:00"
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "username",  // or email
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "name": "Full Name",
  "created_at": "2024-01-01T00:00:00"
}
```

### Roles

#### Create Role
```http
POST /api/roles/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Product Manager",
  "avatar": "👨‍💼",
  "description": "Leads product strategy and roadmap",
  "ai_instructions": "You are a strategic Product Manager. Focus on user needs, market fit, and product vision."
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Product Manager",
  "avatar": "👨‍💼",
  "description": "Leads product strategy and roadmap",
  "ai_instructions": "You are a strategic Product Manager...",
  "created_at": "2024-01-01T00:00:00"
}
```

#### Get All Roles
```http
GET /api/roles/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Product Manager",
    "avatar": "👨‍💼",
    "description": "Leads product strategy and roadmap",
    "ai_instructions": "You are a strategic Product Manager...",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

#### Get Role by ID
```http
GET /api/roles/{role_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Product Manager",
  "avatar": "👨‍💼",
  "description": "Leads product strategy and roadmap",
  "ai_instructions": "You are a strategic Product Manager...",
  "created_at": "2024-01-01T00:00:00"
}
```

#### Delete Role
```http
DELETE /api/roles/{role_id}
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):** No content

### Rooms

#### Create Room
```http
POST /api/rooms/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "General Chat"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "General Chat",
  "created_by": 1,
  "created_at": "2024-01-01T00:00:00"
}
```

#### Get All Rooms
```http
GET /api/rooms/
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "General Chat",
    "created_by": 1,
    "created_at": "2024-01-01T00:00:00"
  }
]
```

#### Get Room Messages
```http
GET /api/rooms/{room_id}/messages?limit=100&offset=0
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 100)
- `offset` (optional): Number of messages to skip (default: 0)

**Response (200):**
```json
[
  {
    "id": 1,
    "room_id": 1,
    "user_id": 1,
    "role_id": null,
    "content": "Hello world!",
    "message_type": "text",
    "timestamp": "2024-01-01T00:00:00"
  }
]
```

### LLM

#### Get Available Models
```http
GET /api/llm/models
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "gpt-3.5-turbo",
    "name": "GPT-3.5 Turbo",
    "provider": "OpenAI",
    "description": "Fast and efficient for most tasks"
  },
  {
    "id": "gpt-4",
    "name": "GPT-4",
    "provider": "OpenAI",
    "description": "Most capable OpenAI model"
  }
]
```

### WebSocket Endpoints

#### Chat WebSocket
```
WS /ws/chat/{room_id}?token={jwt_token}
```

**Send Message:**
```json
{
  "content": "Hello, team!",
  "role_id": 1,
  "message_type": "text",
  "model": "gpt-3.5-turbo",
  "api_key": "optional-user-api-key"
}
```

**Receive Messages:**
```json
{
  "type": "message",
  "id": 123,
  "user": "username",
  "role_id": 1,
  "content": "Hello, team!",
  "message_type": "text",
  "timestamp": "2024-01-01T00:00:00"
}
```

**Join Notification:**
```json
{
  "type": "join",
  "user": "username",
  "room_id": 1
}
```

**Leave Notification:**
```json
{
  "type": "leave",
  "user": "username",
  "room_id": 1
}
```

#### WebRTC Signaling
```
WS /ws/signaling/{room_id}?token={jwt_token}
```

**Send/Receive:**
```json
{
  "type": "offer",
  "data": {
    "sdp": "...",
    "type": "offer"
  }
}
```

```json
{
  "type": "answer",
  "data": {
    "sdp": "...",
    "type": "answer"
  }
}
```

```json
{
  "type": "ice_candidate",
  "data": {
    "candidate": "...",
    "sdpMid": "...",
    "sdpMLineIndex": 0
  }
}
```

## Health Check

#### Check API Health
```http
GET /health
```

**Response (200):**
```json
{
  "status": "healthy"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message description"
}
```

Common status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `422` - Validation Error (invalid request body)
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is enforced, but it's recommended to implement it in production:
- User registration: 5 requests per hour per IP
- Login attempts: 10 requests per hour per IP
- LLM requests: 100 requests per hour per user

## Interactive Documentation

Visit `/docs` on your backend URL for interactive Swagger UI documentation where you can:
- Try out endpoints
- View detailed schemas
- Generate code examples
- Test authentication

Example: `http://localhost:8000/docs`

## Code Examples

### Python
```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={"username": "user", "password": "pass"}
)
token = response.json()["access_token"]

# Create role
response = requests.post(
    "http://localhost:8000/api/roles/",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "name": "Developer",
        "avatar": "👩‍💻",
        "description": "Software developer",
        "ai_instructions": "You are a software developer..."
    }
)
role = response.json()
```

### JavaScript
```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'user', password: 'pass' })
});
const { access_token } = await loginResponse.json();

// Create role
const roleResponse = await fetch('http://localhost:8000/api/roles/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    name: 'Developer',
    avatar: '👩‍💻',
    description: 'Software developer',
    ai_instructions: 'You are a software developer...'
  })
});
const role = await roleResponse.json();
```

### cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Create role
curl -X POST http://localhost:8000/api/roles/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Developer",
    "avatar": "👩‍💻",
    "description": "Software developer",
    "ai_instructions": "You are a software developer..."
  }'
```
