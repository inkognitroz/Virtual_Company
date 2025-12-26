# Backend Setup Guide

This guide explains how to set up and run the Virtual Company backend server.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Optional, the app will work without it using in-memory storage
- npm or yarn package manager

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure the following:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/virtual-company
   JWT_SECRET=your-secure-random-secret
   OPENAI_API_KEY=your-openai-api-key (optional)
   CLAUDE_API_KEY=your-claude-api-key (optional)
   ALLOWED_ORIGINS=http://localhost:3000
   ```

3. **Start MongoDB** (if using database)
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT you configured).

## API Endpoints

### Authentication

#### Register
- **POST** `/api/auth/register`
- Body: `{ "email": "user@example.com", "username": "username", "password": "password", "name": "Full Name" }`
- Response: `{ "message": "User registered successfully", "user": {...}, "token": "..." }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ "username": "username or email", "password": "password" }`
- Response: `{ "message": "Login successful", "user": {...}, "token": "..." }`

### Users (requires authentication)

#### Get Current User
- **GET** `/api/users/me`
- Headers: `Authorization: Bearer <token>`
- Response: `{ "username": "...", "email": "...", "name": "..." }`

#### Update Profile
- **PUT** `/api/users/me`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "name": "New Name" }`

### Roles (requires authentication)

#### Get All Roles
- **GET** `/api/roles`
- Headers: `Authorization: Bearer <token>`

#### Create Role
- **POST** `/api/roles`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "name": "Role Name", "avatar": "👨‍💼", "description": "...", "aiInstructions": "..." }`

#### Get Role
- **GET** `/api/roles/:id`
- Headers: `Authorization: Bearer <token>`

#### Update Role
- **PUT** `/api/roles/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "name": "...", "avatar": "...", "description": "...", "aiInstructions": "..." }`

#### Delete Role
- **DELETE** `/api/roles/:id`
- Headers: `Authorization: Bearer <token>`

### Messages (requires authentication)

#### Get Messages
- **GET** `/api/messages?limit=100&skip=0`
- Headers: `Authorization: Bearer <token>`

#### Create Message
- **POST** `/api/messages`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "sender": "user|role|ai", "senderName": "...", "avatar": "...", "content": "..." }`

#### Delete Message
- **DELETE** `/api/messages/:id`
- Headers: `Authorization: Bearer <token>`

#### Clear All Messages
- **DELETE** `/api/messages`
- Headers: `Authorization: Bearer <token>`

### AI (requires authentication)

#### Chat with AI
- **POST** `/api/ai/chat`
- Headers: `Authorization: Bearer <token>`
- Body: `{ "message": "...", "provider": "openai|claude|custom", "roleInstructions": "...", "endpoint": "..." }`
- Response: `{ "response": "AI response", "provider": "..." }`

### Health Check

#### Check Server Status
- **GET** `/api/health`
- Response: `{ "status": "ok", "timestamp": "...", "database": "connected|disconnected" }`

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication with 7-day expiry
- **Rate Limiting**: API requests are rate-limited (100 requests per 15 minutes)
- **CORS Protection**: Cross-origin requests are controlled via ALLOWED_ORIGINS
- **Helmet**: Security headers are set automatically
- **Input Validation**: All inputs are validated using express-validator
- **API Key Protection**: AI API keys are stored server-side only

## Database Schema

### User
```javascript
{
  email: String (unique),
  username: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Role
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  avatar: String,
  description: String,
  aiInstructions: String,
  createdAt: Date
}
```

### Message
```javascript
{
  userId: ObjectId (ref: User),
  sender: String (enum: 'user', 'role', 'ai'),
  senderName: String,
  avatar: String,
  content: String,
  roleId: ObjectId (ref: Role, optional),
  roleInstructions: String,
  isAI: Boolean,
  createdAt: Date
}
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongosh` or check service status
- Verify the MONGODB_URI in .env is correct
- The app will continue to work without MongoDB using in-memory storage

### Port Already in Use
- Change the PORT in .env to a different value
- Or kill the process using the port: `lsof -ti:3000 | xargs kill -9`

### JWT Token Issues
- Ensure JWT_SECRET is set in .env
- Token expires after 7 days - users need to login again
- Verify Authorization header format: `Bearer <token>`

### AI API Issues
- Verify API keys are correctly set in .env
- Check API provider status and quotas
- Review server logs for detailed error messages

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use a strong, random `JWT_SECRET`
- Configure proper `ALLOWED_ORIGINS` for CORS
- Set up MongoDB connection string with authentication

### Recommendations
- Use a process manager like PM2: `pm2 start server.js`
- Set up HTTPS/SSL certificates
- Use a reverse proxy (nginx, Apache)
- Enable MongoDB authentication and backups
- Set up monitoring and logging
- Consider using environment-specific .env files

### Example PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name virtual-company
pm2 save
pm2 startup
```

## Development Tips

- Use `npm run dev` for automatic server restart on file changes
- Check `/api/health` to verify server and database status
- View server logs for debugging
- Use tools like Postman or curl to test API endpoints
- MongoDB data persists between server restarts
