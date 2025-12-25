// Authentication JavaScript

// Utility function to sanitize input (prevent XSS)
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to validate password strength
function isValidPassword(password) {
    // Minimum 8 characters, at least one letter and one number
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

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

// Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = sanitizeInput(document.getElementById('username').value.trim());
    const password = document.getElementById('password').value;
    
    // Validate inputs
    if (!username || !password) {
        alert('Please enter both username/email and password.');
        return;
    }
    
    if (username.length < 3) {
        alert('Username/email must be at least 3 characters long.');
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

// Handle Registration
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = sanitizeInput(document.getElementById('reg-email').value.trim());
    const username = sanitizeInput(document.getElementById('reg-username').value.trim());
    const password = document.getElementById('reg-password').value;
    const name = sanitizeInput(document.getElementById('reg-name').value.trim());
    
    // Validate inputs
    if (!email || !username || !password || !name) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    if (username.length < 3 || username.length > 20) {
        alert('Username must be between 3 and 20 characters.');
        return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        alert('Username can only contain letters, numbers, and underscores.');
        return;
    }
    
    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and contain both letters and numbers.');
        return;
    }
    
    if (name.length < 2 || name.length > 50) {
        alert('Name must be between 2 and 50 characters.');
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
        password, // Note: In production, this should be hashed
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
