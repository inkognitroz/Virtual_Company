# Virtual Company - Backend API

This is the backend API server for the Virtual Company application, providing secure authentication, data persistence, and real-time features.

## Features

- **Secure Authentication**: JWT-based authentication with password hashing
- **RESTful API**: Well-structured endpoints for all operations
- **Database Persistence**: MongoDB for reliable data storage
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS Support**: Configured for frontend integration
- **Security**: Helmet.js for HTTP header security

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/virtual-company
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:8000
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)

### Roles
- `GET /api/roles` - Get all roles (requires authentication)
- `POST /api/roles` - Create a new role (requires authentication)
- `GET /api/roles/:id` - Get a specific role (requires authentication)
- `PUT /api/roles/:id` - Update a role (requires authentication)
- `DELETE /api/roles/:id` - Delete a role (requires authentication)

### Messages
- `GET /api/messages` - Get all messages (requires authentication)
- `POST /api/messages` - Create a new message (requires authentication)
- `DELETE /api/messages/:id` - Delete a specific message (requires authentication)
- `DELETE /api/messages` - Delete all messages (requires authentication)

### Health Check
- `GET /api/health` - Check API status

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── roleController.js    # Role management logic
│   │   └── messageController.js # Message handling logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── validator.js         # Request validation middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Role.js              # Role model
│   │   └── Message.js           # Message model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── roleRoutes.js        # Role routes
│   │   └── messageRoutes.js     # Message routes
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   └── server.js                # Main server file
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/virtual-company |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:8000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window in ms | 900000 (15 min) |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Secure HTTP headers
- **CORS**: Controlled cross-origin access

## Database Schema

### User
- email (String, unique, required)
- username (String, unique, required)
- password (String, hashed, required)
- name (String, required)
- createdAt (Date)

### Role
- userId (ObjectId, ref: User)
- name (String, required)
- avatar (String, required)
- description (String)
- aiInstructions (String)
- createdAt (Date)

### Message
- userId (ObjectId, ref: User)
- sender (String, required)
- senderType (String: 'user' | 'role')
- roleId (ObjectId, ref: Role)
- content (String, required)
- timestamp (Date)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
```

## Development

### Run Linter
```bash
npm run lint
```

### Run Tests
```bash
npm test
```

## Deployment

### Using MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update MONGODB_URI in .env with your Atlas connection string

### Using Docker (Optional)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t virtual-company-backend .
docker run -p 5000:5000 --env-file .env virtual-company-backend
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in .env
- Verify network connectivity

### CORS Errors
- Update CORS_ORIGIN in .env to match your frontend URL
- Ensure credentials are properly set

### Authentication Errors
- Verify JWT_SECRET is set in .env
- Check token format in Authorization header
- Ensure token hasn't expired

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details
