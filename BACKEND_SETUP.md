# Backend Setup Guide

This guide will help you set up and run the Virtual Company backend server.

## Quick Start

### Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - Choose one:
   - Local: [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)

### Installation Steps

1. **Install all dependencies** (frontend and backend):
   ```bash
   npm run setup
   ```
   
   Or install backend only:
   ```bash
   npm run backend:install
   ```

2. **Set up environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `backend/.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/virtual-company
   JWT_SECRET=change-this-to-a-random-secret-key
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:8000
   ```

3. **Start MongoDB** (if using local installation):
   ```bash
   mongod
   ```
   
   Or skip this if using MongoDB Atlas

4. **Start the backend server**:
   
   Development mode (with auto-reload):
   ```bash
   npm run backend:dev
   ```
   
   Production mode:
   ```bash
   npm run backend:start
   ```

5. **Start the frontend**:
   
   In a new terminal:
   ```bash
   npm start
   ```

6. **Run both frontend and backend together**:
   ```bash
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Using MongoDB Atlas (Cloud Database)

If you prefer not to install MongoDB locally, use MongoDB Atlas:

1. **Create a free account** at https://www.mongodb.com/cloud/atlas

2. **Create a new cluster**:
   - Choose the free tier (M0)
   - Select a region close to you
   - Create cluster

3. **Set up database access**:
   - Database Access → Add New Database User
   - Choose username/password authentication
   - Save credentials

4. **Whitelist your IP**:
   - Network Access → Add IP Address
   - Choose "Allow access from anywhere" for development
   - Or add your specific IP

5. **Get connection string**:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `myFirstDatabase` with your database name (e.g., `virtual-company`)

6. **Update .env file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/virtual-company?retryWrites=true&w=majority
   ```

## Switching from localStorage to Backend

The application supports both client-only (localStorage) and backend modes:

### Current Mode: localStorage (Default)

By default, the application uses localStorage (no backend required). This works entirely in the browser.

### Switching to Backend Mode

To use the backend API for data persistence:

1. Ensure backend server is running
2. Update `config.js`:
   ```javascript
   const CONFIG = {
       mode: 'backend', // Change from 'localStorage' to 'backend'
       apiBaseUrl: 'http://localhost:5000/api',
       // ...
   };
   ```

3. Refresh the application

## Verifying Backend is Working

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Roles
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create role
- `GET /api/roles/:id` - Get specific role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Create message
- `DELETE /api/messages/:id` - Delete message
- `DELETE /api/messages` - Delete all messages

## Troubleshooting

### MongoDB Connection Error

**Problem**: `MongoNetworkError: failed to connect to server`

**Solutions**:
1. Ensure MongoDB is running: `mongod`
2. Check MongoDB is on port 27017: `mongo --eval 'db.version()'`
3. Verify connection string in `.env`
4. For Atlas: Check IP whitelist and credentials

### CORS Error

**Problem**: `Access to fetch at 'http://localhost:5000' has been blocked by CORS policy`

**Solutions**:
1. Verify `CORS_ORIGIN` in `.env` matches frontend URL
2. Ensure backend server is running
3. Check browser console for exact error

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:
1. Stop other process using port 5000
2. Change `PORT` in `.env` to another port (e.g., 5001)
3. Find and kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

### Authentication Error

**Problem**: `Not authorized, no token`

**Solutions**:
1. Ensure you're logged in
2. Check token is stored: `localStorage.getItem('virtualCompanyUser')`
3. Try logging out and back in
4. Verify `JWT_SECRET` is set in `.env`

## Development Tips

### Watch Backend Logs
```bash
cd backend && npm run dev
```

This runs the server with nodemon, automatically restarting on file changes.

### Test with Different Databases
Create separate `.env` files:
- `.env.development`
- `.env.production`
- `.env.test`

### Reset Database
```javascript
// In MongoDB shell
use virtual-company
db.dropDatabase()
```

Or clear specific collections:
```javascript
db.users.deleteMany({})
db.roles.deleteMany({})
db.messages.deleteMany({})
```

## Security Considerations

### Development (Current Setup)
- ✅ Password hashing with bcrypt
- ✅ JWT authentication
- ✅ Input validation
- ✅ Rate limiting
- ⚠️ CORS allows all origins (for development)

### Production Deployment
Before deploying to production:

1. **Change JWT Secret**:
   ```env
   JWT_SECRET=use-a-long-random-string-here
   ```
   Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

2. **Update CORS Origin**:
   ```env
   CORS_ORIGIN=https://your-production-domain.com
   ```

3. **Use MongoDB Atlas** (or secure MongoDB instance)

4. **Set NODE_ENV**:
   ```env
   NODE_ENV=production
   ```

5. **Enable HTTPS** (use reverse proxy like nginx)

6. **Add rate limiting** (already included but adjust limits)

7. **Regular backups** of MongoDB database

## Next Steps

1. ✅ Backend is now set up
2. 📝 Test all API endpoints
3. 🔄 Switch frontend to backend mode
4. 🚀 Deploy to production (optional)

For more details, see:
- [Backend API Documentation](backend/README.md)
- [Main README](README.md)
