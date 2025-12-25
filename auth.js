// Authentication JavaScript

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
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
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
    
    const email = document.getElementById('reg-email').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    
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
