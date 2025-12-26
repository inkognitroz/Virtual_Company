# Migration Guide: Client-Only to Backend Mode

This guide helps you migrate from the client-only (localStorage) mode to the backend-enabled mode.

## Overview

Virtual Company supports two modes:
1. **Client-Only Mode** (Default): All data stored in browser localStorage
2. **Backend Mode**: Data persisted to MongoDB database via REST API

## Why Migrate to Backend Mode?

**Benefits:**
- ✅ **Data Persistence**: Access your data from any device
- ✅ **Security**: Passwords hashed, JWT authentication
- ✅ **Multi-Device**: Use on multiple browsers/devices
- ✅ **Backup**: Automatic database backups possible
- ✅ **Scalability**: Ready for team collaboration features
- ✅ **Production Ready**: Secure for deployment

**Considerations:**
- Requires MongoDB setup
- Requires Node.js backend server
- Additional configuration needed

## Prerequisites

Before migrating, ensure you have:
- [ ] Node.js (v14+) installed
- [ ] MongoDB installed or MongoDB Atlas account
- [ ] Backend dependencies installed (`npm run backend:install`)
- [ ] `.env` file configured in backend directory

## Migration Steps

### Step 1: Export Your Current Data

Before switching modes, export your data:

1. Open the application in client-only mode
2. Navigate to Settings section
3. Click "Export All Data"
4. Save the JSON file (e.g., `virtual-company-backup.json`)

### Step 2: Set Up Backend

Follow the [BACKEND_SETUP.md](BACKEND_SETUP.md) guide:

```bash
# Install backend dependencies
npm run backend:install

# Configure environment
cd backend
cp .env.example .env
# Edit .env with your settings

# Start MongoDB (if local)
mongod

# Start backend server
npm run backend:dev
```

Verify backend is running:
```bash
curl http://localhost:5000/api/health
```

### Step 3: Switch to Backend Mode

**Option A: Using config.js (Recommended)**

Edit `config.js`:
```javascript
const CONFIG = {
    mode: 'backend', // Change from 'localStorage' to 'backend'
    apiBaseUrl: 'http://localhost:5000/api',
    // ...
};
```

**Option B: Using auth-backend.js**

Update `index.html` to use backend authentication:
```html
<!-- Replace auth.js with auth-backend.js -->
<script src="api.js"></script>
<script src="auth-backend.js"></script>
```

Update `dashboard.html` similarly if you modify dashboard.js to use backend.

### Step 4: Create New Account

Since passwords are now hashed, you need to create a new account:

1. Refresh the application
2. Click "Register here"
3. Create a new account
4. You'll be logged in automatically

### Step 5: Import Your Data (Optional)

Currently, the import feature uses localStorage. To migrate your roles and messages:

**Manual Method:**

1. Use the exported JSON from Step 1
2. Manually recreate your roles using the backend interface
3. Or implement a data migration script (see below)

**Automated Script (Advanced):**

Create a migration script `migrate-data.js`:

```javascript
const fs = require('fs');
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';

async function login(username, password) {
    const res = await axios.post(`${API_URL}/auth/login`, { username, password });
    token = res.data.data.token;
    return token;
}

async function importRoles(roles) {
    for (const role of roles) {
        await axios.post(`${API_URL}/roles`, {
            name: role.name,
            avatar: role.avatar,
            description: role.description,
            aiInstructions: role.aiInstructions
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

async function importMessages(messages) {
    for (const message of messages) {
        await axios.post(`${API_URL}/messages`, {
            sender: message.sender,
            senderType: message.senderType || 'user',
            roleId: null, // Map to new role IDs if needed
            content: message.content
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

async function main() {
    const data = JSON.parse(fs.readFileSync('virtual-company-backup.json', 'utf8'));
    
    // Login with your new backend account
    await login('your-username', 'your-password');
    
    // Import data
    if (data.roles) await importRoles(data.roles);
    if (data.messages) await importMessages(data.messages);
    
    console.log('Migration complete!');
}

main().catch(console.error);
```

Run it:
```bash
cd backend
npm install axios
node ../migrate-data.js
```

### Step 6: Verify Migration

1. Login to your new account
2. Check that roles are created
3. Check that messages appear (if imported)
4. Test creating new roles and messages

## Switching Back to Client-Only Mode

If you need to switch back:

1. Edit `config.js`:
   ```javascript
   const CONFIG = {
       mode: 'localStorage',
       // ...
   };
   ```

2. Or update HTML files to use `auth.js` instead of `auth-backend.js`

3. Refresh the application

**Note**: Data created in backend mode won't be visible in client-only mode unless exported and re-imported to localStorage.

## Troubleshooting

### "Network Error" when accessing API

**Check:**
1. Backend server is running: `npm run backend:dev`
2. API URL is correct in `config.js` or `api.js`
3. CORS is properly configured in backend `.env`

### "Not authorized" errors

**Solutions:**
1. Ensure you're logged in
2. Check token is stored: `localStorage.getItem('virtualCompanyUser')`
3. Token may be expired - log out and log back in

### Data not persisting

**Verify:**
1. MongoDB is running and connected
2. Check backend console for errors
3. Verify API calls are successful in browser DevTools Network tab

### Cannot create account

**Check:**
1. All required fields filled
2. Password meets minimum length (6 characters)
3. Username/email not already exists
4. Backend validation messages in response

## Data Migration Script Examples

### Export from localStorage to file

```javascript
// Run in browser console on client-only mode
const data = {
    users: JSON.parse(localStorage.getItem('virtualCompanyUsers') || '[]'),
    roles: JSON.parse(localStorage.getItem('virtualCompanyRoles') || '[]'),
    messages: JSON.parse(localStorage.getItem('virtualCompanyChatMessages') || '[]')
};
const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'localStorage-backup.json';
a.click();
```

### Bulk import to backend API

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"myuser","password":"mypass"}'

# Save the token from response

curl -X POST http://localhost:5000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Manager","avatar":"👨‍💼","description":"Team manager","aiInstructions":"Act as a manager"}'
```

## Best Practices

1. **Always export data** before switching modes
2. **Test backend thoroughly** before migrating production data
3. **Use environment variables** for configuration
4. **Set up database backups** in production
5. **Monitor backend logs** for errors
6. **Use HTTPS** in production
7. **Implement regular backups** of MongoDB database

## Next Steps

After successful migration:

1. ✅ Set up automated database backups
2. ✅ Configure production environment variables
3. ✅ Deploy backend to cloud service (Heroku, AWS, etc.)
4. ✅ Enable HTTPS for security
5. ✅ Monitor application performance
6. ✅ Implement additional features (real-time chat, etc.)

## Support

For issues or questions:
- Check [BACKEND_SETUP.md](BACKEND_SETUP.md)
- Review backend logs for errors
- Test API endpoints with curl/Postman
- Create an issue on GitHub

---

**Remember**: Always backup your data before making changes!
