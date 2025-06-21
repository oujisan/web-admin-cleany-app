// js/api.js
const BASE_URL = 'https://api-cleany-aucceebjbggydtf2.southeastasia-01.azurewebsites.net';

async function apiFetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!data.success) {
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            }
            throw new Error(data.message || 'An error occurred');
        }
        
        return data;
    } catch (error) {
        console.error(`API Error on ${endpoint}:`, error);
        throw error;
    }
}