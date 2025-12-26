// Authentication JavaScript - Backend API Version

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
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const response = await API.auth.login({ username, password });
        
        if (response.success) {
            // Store user data with token
            localStorage.setItem('virtualCompanyUser', JSON.stringify({
                ...response.data.user,
                token: response.data.token
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert(error.message || 'Invalid username/email or password. Please try again or register a new account.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});

// Handle Registration
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    
    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    try {
        const response = await API.auth.register({
            email,
            username,
            password,
            name
        });
        
        if (response.success) {
            // Store user data with token
            localStorage.setItem('virtualCompanyUser', JSON.stringify({
                ...response.data.user,
                token: response.data.token
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert(error.message || 'Registration failed. Please try again with different credentials.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
});
