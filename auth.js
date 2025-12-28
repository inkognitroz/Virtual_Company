// Authentication JavaScript
/* global API */

// Check if user is already logged in
if (localStorage.getItem('authToken')) {
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
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await API.auth.login(username, password);
        
        // Store auth token and user info
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('virtualCompanyUser', JSON.stringify(response.user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Invalid username/email or password. Please try again or register a new account.');
    }
});

// Handle Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    
    try {
        const response = await API.auth.register(email, username, password, name);
        
        // Store auth token and user info
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('virtualCompanyUser', JSON.stringify(response.user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert(error.message || 'Registration failed. Please try again.');
    }
});
