// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    checkAuth();
});

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.data.user.role === 'admin') {
            localStorage.setItem('authToken', response.data.token);
            window.location.href = 'index.html';
        } else {
            alert('Akses ditolak. Anda bukan admin.');
        }
    } catch (error) {
        alert(`Login gagal: ${error.message}`);
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const isLoginPage = window.location.pathname.endsWith('login.html');

    if (!token && !isLoginPage) {
        window.location.href = 'login.html';
    } else if (token && isLoginPage) {
        window.location.href = 'index.html';
    }
}