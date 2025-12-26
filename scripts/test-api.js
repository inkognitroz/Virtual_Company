#!/usr/bin/env node

/**
 * API Test Script
 * Tests the Virtual Company API endpoints
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing Virtual Company API');
    console.log('API URL:', API_BASE_URL);
    console.log('');
    
    let token = null;
    const testUser = {
        email: `test-${Date.now()}@example.com`,
        username: `testuser${Date.now()}`,
        password: 'TestPassword123',
        name: 'Test User'
    };
    
    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing health check endpoint...');
        const healthResponse = await fetch(`${API_BASE_URL}/health`);
        const healthData = await healthResponse.json();
        console.log('✓ Health check passed:', healthData.status);
        console.log('  Database:', healthData.database);
        console.log('');
        
        // Test 2: Register
        console.log('2️⃣ Testing user registration...');
        const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        if (!registerResponse.ok) {
            const errorData = await registerResponse.json();
            throw new Error(`Registration failed: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const registerData = await registerResponse.json();
        token = registerData.token;
        console.log('✓ Registration successful');
        console.log('  User:', registerData.user.username);
        console.log('  Token received:', token ? 'Yes' : 'No');
        console.log('');
        
        // Test 3: Login
        console.log('3️⃣ Testing user login...');
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: testUser.username,
                password: testUser.password
            })
        });
        
        if (!loginResponse.ok) {
            throw new Error('Login failed');
        }
        
        const loginData = await loginResponse.json();
        console.log('✓ Login successful');
        console.log('  User:', loginData.user.username);
        console.log('');
        
        // Test 4: Get User Profile
        console.log('4️⃣ Testing get user profile...');
        const profileResponse = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!profileResponse.ok) {
            throw new Error('Get profile failed');
        }
        
        const profileData = await profileResponse.json();
        console.log('✓ Profile retrieved');
        console.log('  Name:', profileData.name);
        console.log('  Email:', profileData.email);
        console.log('');
        
        // Test 5: Create Role
        console.log('5️⃣ Testing create role...');
        const roleResponse = await fetch(`${API_BASE_URL}/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Manager',
                avatar: '👨‍💼',
                description: 'Test role for API testing',
                aiInstructions: 'You are a test manager role'
            })
        });
        
        if (!roleResponse.ok) {
            throw new Error('Create role failed');
        }
        
        const roleData = await roleResponse.json();
        console.log('✓ Role created');
        console.log('  Role:', roleData.role.name);
        console.log('  ID:', roleData.role._id);
        console.log('');
        
        // Test 6: Get Roles
        console.log('6️⃣ Testing get roles...');
        const rolesResponse = await fetch(`${API_BASE_URL}/roles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!rolesResponse.ok) {
            throw new Error('Get roles failed');
        }
        
        const rolesData = await rolesResponse.json();
        console.log('✓ Roles retrieved');
        console.log('  Count:', rolesData.length);
        console.log('');
        
        // Test 7: Create Message
        console.log('7️⃣ Testing create message...');
        const messageResponse = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                sender: 'user',
                senderName: testUser.name,
                avatar: '👤',
                content: 'Test message from API test script'
            })
        });
        
        if (!messageResponse.ok) {
            throw new Error('Create message failed');
        }
        
        const messageData = await messageResponse.json();
        console.log('✓ Message created');
        console.log('  Content:', messageData.data.content);
        console.log('');
        
        // Test 8: Get Messages
        console.log('8️⃣ Testing get messages...');
        const messagesResponse = await fetch(`${API_BASE_URL}/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!messagesResponse.ok) {
            throw new Error('Get messages failed');
        }
        
        const messagesData = await messagesResponse.json();
        console.log('✓ Messages retrieved');
        console.log('  Count:', messagesData.length);
        console.log('');
        
        console.log('✅ All API tests passed!');
        console.log('');
        console.log('📝 Summary:');
        console.log('  - Health check: ✓');
        console.log('  - User registration: ✓');
        console.log('  - User login: ✓');
        console.log('  - Get profile: ✓');
        console.log('  - Create role: ✓');
        console.log('  - Get roles: ✓');
        console.log('  - Create message: ✓');
        console.log('  - Get messages: ✓');
        
    } catch (error) {
        console.error('');
        console.error('❌ API test failed:');
        console.error(error.message);
        process.exit(1);
    }
}

// Check if server is running first
async function checkServer() {
    try {
        console.log('🔍 Checking if server is running...');
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
            console.log('✓ Server is running');
            console.log('');
            return true;
        }
    } catch (error) {
        console.error('❌ Server is not running!');
        console.error('Please start the server first with: npm start');
        console.error('');
        process.exit(1);
    }
}

// Run tests
(async () => {
    await checkServer();
    await testAPI();
})();
