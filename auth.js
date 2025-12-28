/**
 * Authentication JavaScript
 * 
 * SECURITY WARNING: This is a demo application that stores passwords in plain text 
 * in localStorage. This is NOT secure and should NOT be used in production.
 * For production applications, implement proper server-side authentication with 
 * hashed passwords, HTTPS, and secure session management.
 */

// Check if user is already logged in
if (localStorage.getItem('virtualCompanyUser')) {
    window.location.href = 'dashboard.html';
}

// Toggle between login and register forms
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

/**
 * Validates login input
 * @param {string} username - Username or email
 * @param {string} password - Password
 * @returns {Object} Validation result with valid flag and message
 */
function validateLoginInput(username, password) {
    if (!username || username.trim().length === 0) {
        return { valid: false, message: 'Username or email is required.' };
    }
    if (!password || password.length === 0) {
        return { valid: false, message: 'Password is required.' };
    }
    if (password.length < 4) {
        return { valid: false, message: 'Password must be at least 4 characters.' };
    }
    return { valid: true };
}

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate input
    const validation = validateLoginInput(username, password);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('virtualCompanyUsers') || '[]');
    
    // Find user
    const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
        // Store current user
        localStorage.setItem('virtualCompanyUser', JSON.stringify({
            username: user.username,
            email: user.email,
            name: user.name
        }));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username/email or password. Please try again or register a new account.');
    }
});

/**
 * Validates registration input
 * @param {string} email - Email address
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {string} name - Full name
 * @returns {Object} Validation result with valid flag and message
 */
function validateRegistrationInput(email, username, password, name) {
    // Email validation
    if (!email || email.trim().length === 0) {
        return { valid: false, message: 'Email is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address.' };
    }
    
    // Username validation
    if (!username || username.trim().length === 0) {
        return { valid: false, message: 'Username is required.' };
    }
    if (username.trim().length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters.' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores.' };
    }
    
    // Password validation
    if (!password || password.length === 0) {
        return { valid: false, message: 'Password is required.' };
    }
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters.' };
    }
    
    // Name validation
    if (!name || name.trim().length === 0) {
        return { valid: false, message: 'Full name is required.' };
    }
    
    return { valid: true };
}

// Handle Registration
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value.trim();
    
    // Validate input
    const validation = validateRegistrationInput(email, username, password, name);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }
    
    // Get stored users
    const users = JSON.parse(localStorage.getItem('virtualCompanyUsers') || '[]');
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
        alert('Username or email already exists. Please use a different one or login.');
        return;
    }
    
    // Add new user
    users.push({
        email,
        username,
        password,
        name
    });
    
    // Save users
    localStorage.setItem('virtualCompanyUsers', JSON.stringify(users));
    
    // Auto login
    localStorage.setItem('virtualCompanyUser', JSON.stringify({
        username,
        email,
        name
    }));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});
