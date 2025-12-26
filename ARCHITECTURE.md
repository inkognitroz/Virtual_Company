# Virtual Company - Architecture Documentation

## System Architecture

Virtual Company now supports two operational modes with a flexible, scalable architecture.

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Virtual Company                             │
│                                                                     │
│  Modes:                                                            │
│  • Client-Only (localStorage) - Default, no backend required      │
│  • Full-Stack (Backend API) - Production-ready with MongoDB       │
└─────────────────────────────────────────────────────────────────────┘
```

## Architecture Modes

### Mode 1: Client-Only (Default)

```
┌──────────────────────────────────────────────────────┐
│                  Browser Client                      │
├──────────────────────────────────────────────────────┤
│  HTML/CSS/JavaScript                                 │
│  ├── index.html (Login/Register)                     │
│  ├── dashboard.html (Main App)                       │
│  ├── auth.js (Client-side auth)                      │
│  ├── dashboard.js (App logic)                        │
│  └── styles.css                                      │
├──────────────────────────────────────────────────────┤
│  Browser LocalStorage                                │
│  ├── virtualCompanyUsers                             │
│  ├── virtualCompanyRoles                             │
│  ├── virtualCompanyChatMessages                      │
│  └── virtualCompanyUser (session)                    │
└──────────────────────────────────────────────────────┘

Advantages:
✓ No setup required
✓ Works offline
✓ Instant deployment
✓ No server costs

Limitations:
✗ Data lost on browser clear
✗ Single device only
✗ Passwords not hashed
✗ No multi-user support
```

### Mode 2: Full-Stack (Backend Enabled)

```
┌────────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                              │
├────────────────────────────────────────────────────────────────────┤
│  Browser Client                                                    │
│  ├── HTML/CSS/JavaScript                                           │
│  ├── api.js (API Client)                                           │
│  ├── config.js (mode: 'backend')                                   │
│  ├── auth-backend.js (Backend auth)                                │
│  └── dashboard.js (API integration)                                │
└────────────────────────────────────────────────────────────────────┘
                                 ↕ HTTPS
                         REST API (JSON)
                                 ↕
┌────────────────────────────────────────────────────────────────────┐
│                        Backend Layer                               │
├────────────────────────────────────────────────────────────────────┤
│  Express.js Server (Node.js)                                       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Security Middleware                                          │ │
│  │ • Helmet.js (Security headers)                               │ │
│  │ • CORS (Origin control)                                      │ │
│  │ • Rate Limiter (DDoS protection)                             │ │
│  │ • Input Validator (SQL injection, XSS)                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ API Routes                                                   │ │
│  │ • /api/auth/* → authController                               │ │
│  │ • /api/roles/* → roleController                              │ │
│  │ • /api/messages/* → messageController                        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Business Logic (Controllers)                                 │ │
│  │ • Authentication (register, login, getMe)                    │ │
│  │ • Role Management (CRUD operations)                          │ │
│  │ • Message Management (CRUD operations)                       │ │
│  │ • Authorization (JWT verification)                           │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Data Models (Mongoose)                                       │ │
│  │ • User Model (schema validation)                             │ │
│  │ • Role Model (schema validation)                             │ │
│  │ • Message Model (schema validation)                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                                 ↕
                        MongoDB Connection
                                 ↕
┌────────────────────────────────────────────────────────────────────┐
│                      Database Layer                                │
├────────────────────────────────────────────────────────────────────┤
│  MongoDB Database                                                  │
│                                                                    │
│  Collections:                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐      │
│  │ users          │  │ roles          │  │ messages       │      │
│  │ • _id          │  │ • _id          │  │ • _id          │      │
│  │ • email        │  │ • userId       │  │ • userId       │      │
│  │ • username     │  │ • name         │  │ • sender       │      │
│  │ • password     │  │ • avatar       │  │ • content      │      │
│  │ • name         │  │ • description  │  │ • roleId       │      │
│  │ • createdAt    │  │ • aiInst...    │  │ • timestamp    │      │
│  └────────────────┘  └────────────────┘  └────────────────┘      │
└────────────────────────────────────────────────────────────────────┘

Advantages:
✓ Secure password hashing
✓ Multi-device access
✓ Data persistence
✓ Production ready
✓ Scalable
✓ Team features ready

Requirements:
• Node.js server
• MongoDB database
• Environment configuration
```

## API Flow

### Authentication Flow

```
1. User Registration
   ┌──────────┐          ┌──────────┐          ┌──────────┐
   │ Browser  │          │  Server  │          │ Database │
   └────┬─────┘          └────┬─────┘          └────┬─────┘
        │                     │                     │
        │ POST /auth/register │                     │
        │ {email, username,   │                     │
        │  password, name}    │                     │
        ├────────────────────>│                     │
        │                     │ Validate input      │
        │                     │ Hash password       │
        │                     │ Create user         │
        │                     ├────────────────────>│
        │                     │                     │
        │                     │<────────────────────┤
        │                     │ Generate JWT        │
        │ {user, token}       │                     │
        │<────────────────────┤                     │
        │                     │                     │
        │ Store token         │                     │
        │ localStorage        │                     │
        │                     │                     │

2. Authenticated Request
   ┌──────────┐          ┌──────────┐          ┌──────────┐
   │ Browser  │          │  Server  │          │ Database │
   └────┬─────┘          └────┬─────┘          └────┬─────┘
        │                     │                     │
        │ GET /roles          │                     │
        │ Authorization:      │                     │
        │ Bearer <token>      │                     │
        ├────────────────────>│                     │
        │                     │ Verify JWT          │
        │                     │ Extract userId      │
        │                     │ Query roles         │
        │                     ├────────────────────>│
        │                     │                     │
        │                     │<────────────────────┤
        │ {roles: [...]}      │                     │
        │<────────────────────┤                     │
        │                     │                     │
```

## Security Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                     Security Layers                           │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Transport Layer                                           │
│     • HTTPS (SSL/TLS)                                         │
│     • Secure cookies (production)                             │
│                                                               │
│  2. Authentication Layer                                      │
│     • JWT tokens (HS256)                                      │
│     • Bcrypt password hashing (10 rounds)                     │
│     • Token expiration (7 days default)                       │
│                                                               │
│  3. Authorization Layer                                       │
│     • User ownership validation                               │
│     • Resource access control                                 │
│     • Role-based permissions                                  │
│                                                               │
│  4. Input Validation Layer                                    │
│     • Express-validator                                       │
│     • Schema validation (Mongoose)                            │
│     • Type checking                                           │
│     • Length limits                                           │
│                                                               │
│  5. Rate Limiting Layer                                       │
│     • 100 requests / 15 minutes                               │
│     • IP-based throttling                                     │
│     • Configurable limits                                     │
│                                                               │
│  6. HTTP Headers Layer                                        │
│     • Helmet.js security headers                              │
│     • XSS Protection                                          │
│     • CSRF tokens (when needed)                               │
│     • Content Security Policy                                 │
│                                                               │
│  7. Database Layer                                            │
│     • MongoDB authentication                                  │
│     • Connection encryption                                   │
│     • Query sanitization                                      │
│     • Injection prevention                                    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development

```
┌─────────────────────────────────────────┐
│ Developer Machine                       │
│                                         │
│  Frontend: http://localhost:8000       │
│  Backend:  http://localhost:5000       │
│  MongoDB:  mongodb://localhost:27017   │
│                                         │
│  npm run dev                            │
│  (runs both frontend & backend)         │
└─────────────────────────────────────────┘
```

### Docker Deployment

```
┌─────────────────────────────────────────────────┐
│ Docker Compose                                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────┐│
│  │ Frontend    │  │ Backend      │  │MongoDB ││
│  │ (nginx)     │  │ (Node.js)    │  │        ││
│  │ :8000       │  │ :5000        │  │ :27017 ││
│  └─────────────┘  └──────────────┘  └────────┘│
│         ↓                ↓                ↓    │
│  ┌──────────────────────────────────────────┐ │
│  │    virtual-company-network (bridge)      │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  docker-compose up -d                           │
└─────────────────────────────────────────────────┘
```

### Production (Cloud)

```
┌───────────────────────────────────────────────────────┐
│ Cloud Platform (Heroku/AWS/DigitalOcean)             │
├───────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────────┐         ┌──────────────────┐   │
│  │ Static Hosting   │         │ Backend Server   │   │
│  │ (GitHub Pages/   │         │ (Heroku/EC2)     │   │
│  │  Netlify/S3)     │         │                  │   │
│  │                  │         │ • Auto-scaling   │   │
│  │ Frontend Files   │         │ • Load balancer  │   │
│  └────────┬─────────┘         │ • Health checks  │   │
│           │                   └────────┬─────────┘   │
│           │                            │             │
│           │ HTTPS                      │ HTTPS       │
│           │                            │             │
│  ┌────────▼───────────────────────────▼─────────┐   │
│  │         CDN (CloudFlare/AWS)                 │   │
│  └──────────────────────────────────────────────┘   │
│                        │                             │
│                        │                             │
│                        ▼                             │
│           ┌────────────────────────┐                 │
│           │ MongoDB Atlas          │                 │
│           │ (Cloud Database)       │                 │
│           │                        │                 │
│           │ • Automated backups    │                 │
│           │ • Replica sets         │                 │
│           │ • Monitoring           │                 │
│           └────────────────────────┘                 │
└───────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Grid, Flexbox)
- **JavaScript ES6+** - Logic
- **Fetch API** - HTTP requests
- **LocalStorage** - Client-side storage (mode 1)
- **Web Speech API** - Voice features

### Backend
- **Node.js 18+** - Runtime
- **Express.js 4.x** - Web framework
- **Mongoose 8.x** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Helmet.js** - Security headers
- **Express Validator** - Input validation
- **CORS** - Cross-origin control

### Database
- **MongoDB 7.x** - NoSQL database
- **MongoDB Atlas** - Cloud option

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server / Reverse proxy
- **GitHub Actions** - CI/CD

## Scalability Considerations

### Horizontal Scaling

```
        ┌──────────────┐
        │ Load Balancer│
        └──────┬───────┘
               │
        ┌──────┴──────┐
        │             │
    ┌───▼───┐     ┌───▼───┐
    │Server1│     │Server2│
    └───┬───┘     └───┬───┘
        │             │
        └──────┬──────┘
               │
        ┌──────▼───────┐
        │   MongoDB    │
        │ Replica Set  │
        └──────────────┘
```

### Performance Optimization

- **Database Indexes** on frequently queried fields
- **Connection Pooling** for database
- **Caching** (Redis for sessions - future)
- **CDN** for static assets
- **Compression** (gzip)
- **Pagination** for large datasets

## Monitoring & Logging

```
Application
    │
    ├─> Access Logs (nginx/express)
    ├─> Error Logs (console/file)
    ├─> Performance Metrics
    │
    ├─> Health Endpoint (/api/health)
    │
    └─> External Monitoring
        ├─> Uptime monitoring
        ├─> Error tracking (Sentry)
        └─> Performance (New Relic)
```

## Development Workflow

```
1. Local Development
   └─> npm run dev (frontend + backend)

2. Code Changes
   └─> Git commit & push

3. Testing
   ├─> ./test-backend.sh (API tests)
   ├─> npm run lint (code quality)
   └─> Manual testing

4. Deployment
   ├─> Docker: docker-compose up
   ├─> Heroku: git push heroku main
   └─> AWS: eb deploy
```

## File Structure Overview

```
Virtual_Company/
├── Frontend (Client)
│   ├── index.html
│   ├── dashboard.html
│   ├── styles.css
│   ├── auth.js / auth-backend.js
│   ├── dashboard.js
│   ├── api.js
│   └── config.js
│
├── Backend (Server)
│   └── backend/
│       ├── src/
│       │   ├── config/
│       │   ├── controllers/
│       │   ├── middleware/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── utils/
│       │   └── server.js
│       ├── package.json
│       ├── .env.example
│       └── Dockerfile
│
├── Documentation
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── BACKEND_SETUP.md
│   ├── API_DOCUMENTATION.md
│   ├── MIGRATION_GUIDE.md
│   ├── DEPLOYMENT.md
│   ├── ARCHITECTURE.md
│   └── IMPLEMENTATION_SUMMARY.md
│
└── Deployment
    ├── docker-compose.yml
    ├── nginx.conf
    └── test-backend.sh
```

## Conclusion

Virtual Company's architecture provides:
- **Flexibility**: Choose client-only or full-stack
- **Security**: Production-grade authentication and authorization
- **Scalability**: Ready for growth
- **Maintainability**: Clean, modular code
- **Deployability**: Multiple deployment options
- **Documentation**: Comprehensive guides

For more details, see the specific documentation files.
