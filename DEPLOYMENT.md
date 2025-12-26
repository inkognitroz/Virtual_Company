# Deployment Guide

This guide covers different deployment options for the Virtual Company application.

## Deployment Options

### Option 1: Static Frontend Only (GitHub Pages)

**Best for**: Quick demos, personal use, testing

**Pros**:
- Free hosting on GitHub Pages
- No server maintenance required
- Instant deployment via git push
- Works entirely in the browser

**Cons**:
- No persistent data across devices
- API keys stored in browser (less secure)
- No centralized user management

**Setup**:
1. Fork/clone the repository
2. Enable GitHub Pages in repository settings
3. Select branch and root folder
4. Access at `https://[username].github.io/Virtual_Company/`

### Option 2: Full Stack Deployment

**Best for**: Production use, teams, multi-device access

**Pros**:
- Persistent database storage
- Secure authentication with JWT
- API keys protected on server
- Multi-device synchronization
- User management

**Cons**:
- Requires server hosting
- Database setup needed
- More complex deployment

## Platform-Specific Deployment

### Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add MongoDB Add-on**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

3. **Configure Environment Variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   heroku config:set ALLOWED_ORIGINS=https://your-app-name.herokuapp.com
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Railway.app

1. **Connect GitHub Repository**
   - Link your GitHub repo to Railway
   - Railway auto-detects Node.js

2. **Add MongoDB Database**
   - Add MongoDB plugin in Railway dashboard
   - Connection string auto-configured

3. **Set Environment Variables**
   - Add JWT_SECRET
   - Add ALLOWED_ORIGINS
   - Set NODE_ENV=production

4. **Deploy**
   - Railway auto-deploys on git push

### Render

1. **Create New Web Service**
   - Connect GitHub repository
   - Choose Node.js environment

2. **Configure Build & Start**
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add MongoDB**
   - Use MongoDB Atlas (free tier)
   - Or add Render's managed MongoDB

4. **Environment Variables**
   - Set all required variables in Render dashboard

### DigitalOcean App Platform

1. **Create New App**
   - Connect GitHub repository
   - Select Node.js

2. **Configure**
   - Set build command: `npm install`
   - Set run command: `npm start`

3. **Add Database**
   - Add DigitalOcean Managed MongoDB
   - Or use MongoDB Atlas

4. **Environment Variables**
   - Configure in app settings

### VPS (Custom Server)

**Requirements**: Ubuntu 20.04+, Node.js 16+, MongoDB 5+

1. **Install Dependencies**
   ```bash
   # Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # PM2 Process Manager
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/Virtual_Company.git
   cd Virtual_Company
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit configuration
   ```

4. **Start Services**
   ```bash
   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Start Application
   pm2 start server.js --name virtual-company
   pm2 save
   pm2 startup
   ```

5. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/virtual-company
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/virtual-company /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Database Hosting Options

### MongoDB Atlas (Recommended)

**Free Tier**: 512MB storage, shared cluster

1. Create account at mongodb.com/cloud/atlas
2. Create new cluster (M0 free tier)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Set MONGODB_URI in .env

### Self-Hosted MongoDB

See VPS deployment instructions above.

## Environment Variables

**Required**:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token signing (generate random string)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins

**Optional**:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `OPENAI_API_KEY` - For AI proxy feature
- `CLAUDE_API_KEY` - For AI proxy feature

## Production Checklist

- [ ] Set strong JWT_SECRET (use random string generator)
- [ ] Configure ALLOWED_ORIGINS properly (no wildcards in production)
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB authentication
- [ ] Setup regular database backups
- [ ] Configure SSL/HTTPS
- [ ] Enable rate limiting (already included)
- [ ] Setup monitoring (PM2, New Relic, etc.)
- [ ] Configure logging
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Test all API endpoints
- [ ] Load testing
- [ ] Security audit

## Monitoring

### Using PM2

```bash
# View logs
pm2 logs virtual-company

# Monitor resources
pm2 monit

# Restart application
pm2 restart virtual-company

# View status
pm2 status
```

### Application Monitoring

Consider using:
- **New Relic** - APM and monitoring
- **Sentry** - Error tracking
- **LogDNA** - Log management
- **Datadog** - Full stack monitoring

## Backup Strategy

### MongoDB Backup

```bash
# Automated backup script
mongodump --uri="$MONGODB_URI" --out=/backups/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="$MONGODB_URI" /backups/20231201
```

### Automated Backups

Setup cron job:
```bash
0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB connection timeout**
   - Check MongoDB is running: `sudo systemctl status mongod`
   - Verify connection string in .env
   - Check firewall rules

3. **502 Bad Gateway (Nginx)**
   - Check if app is running: `pm2 status`
   - Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

4. **JWT token issues**
   - Ensure JWT_SECRET is set
   - Check token expiry (default 7 days)

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Multiple app instances with PM2 cluster mode
- MongoDB replica sets
- Redis for session storage

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Enable MongoDB indexes
- Implement caching

## Security Best Practices

1. Keep dependencies updated: `npm audit fix`
2. Use strong passwords for database
3. Rotate JWT secrets regularly
4. Enable CORS only for trusted origins
5. Implement rate limiting (included)
6. Use HTTPS everywhere
7. Regular security audits
8. Monitor for suspicious activity
9. Keep backups encrypted
10. Use environment variables (never commit secrets)
