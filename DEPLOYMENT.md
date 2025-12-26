# Deployment Guide

This guide covers various deployment options for the Virtual Company application with backend.

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [Heroku Deployment](#heroku-deployment)
3. [AWS Deployment](#aws-deployment)
4. [DigitalOcean Deployment](#digitalocean-deployment)
5. [Production Checklist](#production-checklist)

---

## Docker Deployment

The easiest way to deploy with all components.

### Prerequisites
- Docker installed
- Docker Compose installed

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/inkognitroz/Virtual_Company.git
   cd Virtual_Company
   ```

2. **Set environment variables**
   ```bash
   export JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   export CORS_ORIGIN=http://your-domain.com
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:8000
   - Backend API: http://localhost:5000/api
   - MongoDB: localhost:27017

### Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build
```

### Production Docker Setup

1. **Update docker-compose.yml for production**:
   - Use stronger MongoDB credentials
   - Set proper JWT_SECRET
   - Configure CORS_ORIGIN
   - Use volumes for persistent data

2. **Use environment file**:
   ```bash
   # Create .env file
   JWT_SECRET=your-strong-secret-here
   CORS_ORIGIN=https://your-domain.com
   MONGO_PASSWORD=strong-password-here
   ```

3. **Deploy with environment**:
   ```bash
   docker-compose --env-file .env up -d
   ```

---

## Heroku Deployment

Deploy backend to Heroku with MongoDB Atlas.

### Prerequisites
- Heroku account
- Heroku CLI installed
- MongoDB Atlas account

### Backend Deployment

1. **Set up MongoDB Atlas**
   - Create free cluster at https://www.mongodb.com/cloud/atlas
   - Get connection string
   - Whitelist Heroku IPs or allow all (0.0.0.0/0)

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
   heroku config:set JWT_SECRET="$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")"
   heroku config:set JWT_EXPIRE=7d
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```

4. **Create Procfile** (in backend directory):
   ```
   web: node src/server.js
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open app**
   ```bash
   heroku open
   heroku logs --tail
   ```

### Frontend Deployment

Deploy frontend to GitHub Pages or Netlify:

**GitHub Pages:**
```bash
# Already works if repository is public
# Access at: https://username.github.io/Virtual_Company/
```

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Update `api.js` with your Heroku backend URL:
```javascript
const API_BASE_URL = 'https://your-app-name.herokuapp.com/api';
```

---

## AWS Deployment

Deploy using AWS services (EC2, RDS/DocumentDB).

### Option 1: AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   cd backend
   eb init -p node.js virtual-company-backend
   ```

3. **Create environment**
   ```bash
   eb create virtual-company-prod
   ```

4. **Set environment variables**
   ```bash
   eb setenv NODE_ENV=production \
     MONGODB_URI="your-mongodb-uri" \
     JWT_SECRET="your-secret" \
     CORS_ORIGIN="https://your-domain.com"
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

### Option 2: AWS EC2

1. **Launch EC2 instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier eligible)
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect and setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   
   # Clone repository
   git clone https://github.com/inkognitroz/Virtual_Company.git
   cd Virtual_Company
   ```

3. **Set up backend**
   ```bash
   cd backend
   npm install
   
   # Create .env
   nano .env
   # (paste your configuration)
   
   # Install PM2 for process management
   sudo npm install -g pm2
   
   # Start backend
   pm2 start src/server.js --name virtual-company-backend
   pm2 startup
   pm2 save
   ```

4. **Set up nginx**
   ```bash
   sudo apt-get install -y nginx
   
   # Create nginx config
   sudo nano /etc/nginx/sites-available/virtual-company
   ```
   
   Paste:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /home/ubuntu/Virtual_Company;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/virtual-company /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## DigitalOcean Deployment

### Using DigitalOcean App Platform

1. **Connect repository**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub repo

2. **Configure backend**
   - Detected as Node.js app
   - Build command: `cd backend && npm install`
   - Run command: `npm start`
   - Port: 5000

3. **Add MongoDB**
   - Add MongoDB database component
   - Or use MongoDB Atlas

4. **Set environment variables**
   - Add all required env vars in App Platform UI

5. **Deploy**
   - Automatic deployment on git push

---

## Production Checklist

Before deploying to production:

### Security
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Use HTTPS (SSL certificate)
- [ ] Update `CORS_ORIGIN` to your domain
- [ ] Set `NODE_ENV=production`
- [ ] Use strong MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Whitelist only necessary IPs
- [ ] Review and adjust rate limits
- [ ] Keep dependencies updated

### Configuration
- [ ] Set proper `JWT_EXPIRE` time
- [ ] Configure session timeout
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure monitoring (e.g., New Relic)
- [ ] Set up database backups
- [ ] Configure auto-scaling (if needed)

### Frontend
- [ ] Update API URL in `api.js`
- [ ] Update `config.js` mode to 'backend'
- [ ] Minify JavaScript/CSS
- [ ] Optimize images
- [ ] Enable CDN (optional)
- [ ] Set up analytics (optional)

### Database
- [ ] Set up regular backups
- [ ] Configure replica sets (for HA)
- [ ] Monitor disk space
- [ ] Set up alerts for downtime
- [ ] Plan for scaling

### Testing
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Load testing
- [ ] Security testing

### Documentation
- [ ] Update README with deployment URL
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures

### Monitoring
```bash
# Set up health check monitoring
curl https://your-api-url.com/api/health

# Monitor logs
pm2 logs
# or
heroku logs --tail
# or
docker-compose logs -f
```

---

## Troubleshooting

### Application won't start
- Check environment variables
- Verify MongoDB connection
- Check port availability
- Review application logs

### Database connection errors
- Verify MongoDB URI
- Check network connectivity
- Verify credentials
- Check IP whitelist (Atlas)

### CORS errors
- Update `CORS_ORIGIN` in backend
- Ensure protocol matches (http vs https)
- Check for trailing slashes

### High memory usage
- Check for memory leaks
- Monitor database queries
- Optimize indexes
- Consider scaling vertically

---

## Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure automated backups
3. Implement CI/CD pipeline
4. Set up staging environment
5. Plan for scaling
6. Implement logging and analytics
7. Regular security updates

For more help, see:
- [Backend Setup](BACKEND_SETUP.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Main README](README.md)
