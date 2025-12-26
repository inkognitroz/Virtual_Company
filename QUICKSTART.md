# Quick Start Guide

Get Virtual Company running in 5 minutes!

## Choose Your Mode

### Option 1: Client-Only (No Setup Required) ⚡

**Best for**: Quick testing, demos, personal use

```bash
# Clone the repository
git clone https://github.com/inkognitroz/Virtual_Company.git
cd Virtual_Company

# Open in browser
open index.html
# Or use a local server
npm start
```

**That's it!** Visit http://localhost:8000

All data is stored in your browser's localStorage.

---

### Option 2: Full Stack with Backend 🚀

**Best for**: Production use, multi-device access, team collaboration

#### Prerequisites
- Node.js 14+ installed
- MongoDB installed OR MongoDB Atlas account (free)

#### Quick Setup

```bash
# 1. Clone and install
git clone https://github.com/inkognitroz/Virtual_Company.git
cd Virtual_Company
npm run setup

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env:
#   - Set MONGODB_URI (use MongoDB Atlas or local: mongodb://localhost:27017/virtual-company)
#   - Set JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# 3. Start MongoDB (if using local installation)
mongod

# 4. Run everything (in project root)
cd ..
npm run dev
```

**Access**:
- Frontend: http://localhost:8000
- Backend API: http://localhost:5000/api

---

### Option 3: Docker (Easiest Full Stack) 🐳

**Best for**: Quick full-stack setup, consistent environments

#### Prerequisites
- Docker & Docker Compose installed

#### One-Command Setup

```bash
# Clone
git clone https://github.com/inkognitroz/Virtual_Company.git
cd Virtual_Company

# Start everything
docker-compose up -d
```

**Access**:
- Application: http://localhost:8000
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

**Stop**:
```bash
docker-compose down
```

---

## First Steps After Setup

### 1. Create an Account

1. Open the application
2. Click "Register here"
3. Fill in your details:
   - Email: your@email.com
   - Username: yourname
   - Password: (min 6 characters)
   - Full Name: Your Name

### 2. Create Your First Role

1. Go to "Roles & Team" section
2. Click "+ Add Role"
3. Example role:
   ```
   Role Name: Product Manager
   Avatar: 👨‍💼 Manager
   Description: Leads product strategy
   AI Instructions: You are a strategic product manager.
                     Focus on user needs and business goals.
   ```
4. Click "Add Role"

### 3. Start a Conversation

1. Navigate to "Group Chat"
2. Select "Send as: Yourself"
3. Type a message and send
4. Try sending as different roles!

### 4. Export Your Data

1. Go to "Settings"
2. Click "Export All Data"
3. Save the JSON file as backup

---

## Switching Between Modes

### From Client-Only to Backend

1. Set up backend (see Option 2 above)
2. Export your data first!
3. Edit `config.js`:
   ```javascript
   const CONFIG = {
       mode: 'backend',  // Changed from 'localStorage'
       apiBaseUrl: 'http://localhost:5000/api',
   };
   ```
4. Refresh and create a new account
5. Manually recreate your roles

See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for details.

---

## Useful Commands

### Development

```bash
# Frontend only
npm start

# Backend only
npm run backend:dev

# Both together
npm run dev

# Lint code
npm run lint
```

### Docker

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Testing Backend API

```bash
# Run test script
./test-backend.sh

# Manual API test
curl http://localhost:5000/api/health
```

---

## Common Issues

### MongoDB Connection Error

**Problem**: `MongoNetworkError: failed to connect`

**Solutions**:
1. Ensure MongoDB is running: `mongod`
2. Or use MongoDB Atlas (see [BACKEND_SETUP.md](BACKEND_SETUP.md))

### Port Already in Use

**Problem**: `EADDRINUSE: address already in use`

**Solutions**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

### CORS Error

**Problem**: `blocked by CORS policy`

**Solutions**:
1. Ensure backend is running
2. Check `CORS_ORIGIN` in backend/.env matches frontend URL
3. Restart backend after .env changes

---

## What's Next?

### Learn More
- [Backend Setup Details](BACKEND_SETUP.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Migration Guide](MIGRATION_GUIDE.md)

### Try These Features
- Create multiple roles
- Use AI integration (connect OpenAI/Claude)
- Export and import data
- Start video calls
- Try voice input

### Deploy to Production
- See [DEPLOYMENT.md](DEPLOYMENT.md) for:
  - Heroku deployment
  - AWS deployment
  - Docker deployment
  - DigitalOcean deployment

---

## Need Help?

1. Check documentation files above
2. Review backend logs for errors
3. Test API endpoints manually
4. Create an issue on GitHub

---

**Remember**: Client-only mode = instant start, Backend mode = better for production!

Choose based on your needs. You can always switch later.

Happy collaborating! 🎉
