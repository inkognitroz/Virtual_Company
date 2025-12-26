# Virtual Company Backend API

Backend server for the Virtual Company application, providing RESTful API endpoints for user authentication, role management, chat functionality, and AI configuration.

## Features

- User authentication with JWT tokens
- Role management (CRUD operations)
- Chat message storage and retrieval
- AI configuration management
- SQLite database for data persistence
- Secure password hashing with bcrypt

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and set your configuration:

```env
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
DB_PATH=./data/virtual-company.db
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

### 3. Initialize Database

The database will be automatically initialized when you start the server. The schema includes:
- `users` - User accounts
- `roles` - Virtual company roles
- `messages` - Chat messages
- `ai_config` - AI configuration per user

### 4. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### 5. Verify Installation

Check if the server is running:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","message":"Virtual Company API is running"}
```

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "name": "John Doe"
}

Response: { token, user }
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword"
}

Response: { token, user }
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: { message }
```

### Roles

All role endpoints require authentication (Bearer token).

#### Get All Roles
```
GET /api/roles
Authorization: Bearer <token>

Response: [{ id, name, avatar, description, ai_instructions }]
```

#### Create Role
```
POST /api/roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "role-123",
  "name": "Project Manager",
  "avatar": "👨‍💼",
  "description": "Manages projects",
  "aiInstructions": "You are a PM..."
}

Response: { message, role }
```

#### Update Role
```
PUT /api/roles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Senior PM",
  "avatar": "👨‍💼",
  "description": "Senior project manager",
  "aiInstructions": "Updated instructions"
}

Response: { message }
```

#### Delete Role
```
DELETE /api/roles/:id
Authorization: Bearer <token>

Response: { message }
```

### Messages

All message endpoints require authentication (Bearer token).

#### Get All Messages
```
GET /api/messages
Authorization: Bearer <token>

Response: [{ id, sender, sender_name, avatar, content, time }]
```

#### Send Message
```
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "sender": "user",
  "senderName": "John Doe",
  "avatar": "👤",
  "content": "Hello team!",
  "time": "10:30 AM",
  "roleInstructions": null,
  "isAI": false
}

Response: { message, id }
```

#### Clear All Messages
```
DELETE /api/messages
Authorization: Bearer <token>

Response: { message }
```

### AI Configuration

All AI config endpoints require authentication (Bearer token).

#### Get AI Config
```
GET /api/ai-config
Authorization: Bearer <token>

Response: { provider, apiKey, endpoint, voiceEnabled }
```

#### Update AI Config
```
PUT /api/ai-config
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "openai",
  "apiKey": "sk-...",
  "endpoint": null,
  "voiceEnabled": true
}

Response: { message }
```

## Database Schema

### users
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### roles
```sql
CREATE TABLE roles (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    description TEXT,
    ai_instructions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### messages
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    sender TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    content TEXT NOT NULL,
    time TEXT NOT NULL,
    role_instructions TEXT,
    is_ai BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### ai_config
```sql
CREATE TABLE ai_config (
    user_id INTEGER PRIMARY KEY,
    provider TEXT,
    api_key TEXT,
    endpoint TEXT,
    voice_enabled BOOLEAN DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- CORS is configured to allow cross-origin requests
- All authenticated endpoints require valid JWT token
- SQL injection protection through parameterized queries
- Foreign key constraints ensure data integrity

## Production Deployment

For production deployment:

1. Set strong `JWT_SECRET` in environment variables
2. Configure proper CORS origin restrictions
3. Use HTTPS for all communications
4. Set `NODE_ENV=production`
5. Consider using a more robust database (PostgreSQL, MySQL)
6. Implement rate limiting
7. Add logging and monitoring
8. Set up backup strategy for database

## Development

To run in development mode with auto-reload:

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

## Troubleshooting

### Database locked error
- Close any other connections to the database
- Ensure only one instance of the server is running

### Port already in use
- Change the PORT in `.env` file
- Or stop the process using the port: `lsof -ti:3000 | xargs kill`

### Module not found
- Run `npm install` to install all dependencies
- Ensure you're in the `backend` directory

## License

MIT
