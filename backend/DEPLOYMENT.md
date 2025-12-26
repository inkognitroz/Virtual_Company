# Backend Deployment Guide

This guide covers deploying the Virtual Company backend API to various platforms.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Git for version control

## Environment Configuration

Before deploying, create a `.env` file with the following variables:

```env
PORT=3000
JWT_SECRET=<generate-a-strong-random-secret>
NODE_ENV=production
DB_PATH=./data/virtual-company.db
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Important**: 
- Generate a strong JWT secret using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- Set `CORS_ORIGINS` to your frontend domain(s)
- Never commit `.env` to version control

## Deployment Options

### Option 1: Traditional Server (VPS/Cloud)

#### 1. Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Navigate to backend directory
cd backend

# Install dependencies
npm install --production

# Start with PM2
pm2 start src/server.js --name virtual-company-api

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

**PM2 Commands:**
```bash
pm2 status              # Check status
pm2 logs virtual-company-api  # View logs
pm2 restart virtual-company-api  # Restart
pm2 stop virtual-company-api     # Stop
pm2 delete virtual-company-api   # Remove
```

#### 2. Using systemd (Linux)

Create `/etc/systemd/system/virtual-company.service`:

```ini
[Unit]
Description=Virtual Company Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/Virtual_Company/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node src/server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable virtual-company
sudo systemctl start virtual-company
sudo systemctl status virtual-company
```

#### 3. Nginx Reverse Proxy Configuration

Create `/etc/nginx/sites-available/virtual-company`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/virtual-company /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

### Option 2: Heroku

1. **Create Heroku app:**
```bash
heroku create virtual-company-api
```

2. **Add Procfile** in backend directory:
```
web: node src/server.js
```

3. **Set environment variables:**
```bash
heroku config:set JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGINS=https://yourdomain.com
```

4. **Deploy:**
```bash
git subtree push --prefix backend heroku main
# Or if main branch:
git push heroku main
```

### Option 3: Railway

1. Visit [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `/backend`
5. Add environment variables:
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `CORS_ORIGINS`
6. Deploy

### Option 4: Render

1. Visit [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables
6. Deploy

### Option 5: DigitalOcean App Platform

1. Visit DigitalOcean App Platform
2. Create new app from GitHub
3. Configure:
   - **Source Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
4. Add environment variables
5. Deploy

### Option 6: Docker

Create `Dockerfile` in backend directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
      - CORS_ORIGINS=${CORS_ORIGINS}
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

## Database Migration

For production, consider migrating to PostgreSQL or MySQL:

### PostgreSQL Example

1. Install pg package:
```bash
npm install pg
```

2. Update database configuration to use pg instead of better-sqlite3

3. Update environment:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Security Checklist

- [ ] Strong JWT secret (64+ random bytes)
- [ ] CORS origins set to specific domains
- [ ] HTTPS/SSL enabled
- [ ] Environment variables properly configured
- [ ] Database backups configured
- [ ] Rate limiting implemented (optional)
- [ ] Monitoring and logging setup
- [ ] Regular security updates

## Monitoring

### Using PM2

```bash
# Monitor in real-time
pm2 monit

# Web-based monitoring
pm2 plus
```

### Health Check

Monitor the health endpoint:
```bash
curl https://api.yourdomain.com/api/health
```

Expected response:
```json
{"status":"ok","message":"Virtual Company API is running"}
```

## Backup Strategy

### SQLite Database Backup

```bash
# Manual backup
cp backend/data/virtual-company.db backend/data/backup-$(date +%Y%m%d-%H%M%S).db

# Automated backup (cron)
0 2 * * * cp /path/to/backend/data/virtual-company.db /path/to/backups/backup-$(date +\%Y\%m\%d).db
```

### Automated Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DB_PATH="/path/to/backend/data/virtual-company.db"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/backup-$DATE.db

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup-*.db" -mtime +30 -delete

echo "Backup completed: backup-$DATE.db"
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

### Database Locked
- Ensure only one server instance is running
- Check file permissions on data directory

### CORS Errors
- Verify CORS_ORIGINS includes your frontend domain
- Check that requests include proper Origin header
- Ensure frontend is using HTTPS if backend is

### JWT Errors
- Verify JWT_SECRET is set correctly
- Check token expiration (default 7 days)
- Ensure clocks are synchronized

## Performance Optimization

1. **Enable compression:**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add rate limiting:**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

3. **Database connection pooling** (for PostgreSQL/MySQL)

## Support

For issues or questions:
- Check backend logs: `pm2 logs virtual-company-api`
- Review backend/README.md
- Check GitHub issues
