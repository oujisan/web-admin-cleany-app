// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    loadUserStats();
    loadTaskStats();
});

async function loadUserStats() {
    const userStatsContainer = document.getElementById('user-stats');
    userStatsContainer.innerHTML = 'Loading user stats...';
    try {
        const response = await apiFetch('/api/user');
        const users = response.data;
        
        const roles = { admin: 0, koordinator: 0, cleaner: 0, user: 0 };
        users.forEach(user => {
            if (roles.hasOwnProperty(user.role)) {
                roles[user.role]++;
            }
        });

        userStatsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Total Pengguna</h3>
                <div class="stat-value">${users.length}</div>
                <div class="stat-details">
                    <p>Admin: ${roles.admin}</p>
                    <p>Koordinator: ${roles.koordinator}</p>
                    <p>Cleaner: ${roles.cleaner}</p>
                    <p>User: ${roles.user}</p>
                </div>
            </div>`;
    } catch (error) {
        userStatsContainer.innerHTML = '<p>Gagal memuat statistik pengguna.</p>';
    }
}

async function loadTaskStats() {
    const taskStatsContainer = document.getElementById('task-stats');
    taskStatsContainer.innerHTML = 'Loading task stats...';
    try {
        const response = await apiFetch('/api/task/assignment/report');
        const tasks = response.data;

        const statuses = { pending: 0, in_progress: 0, completed: 0 };
        tasks.forEach(task => {
            if (statuses.hasOwnProperty(task.status)) {
                statuses[task.status]++;
            }
        });

        taskStatsContainer.innerHTML = `
            <div class="stat-card">
                <h3>Tugas Pending</h3>
                <div class="stat-value">${statuses.pending}</div>
            </div>
            <div class="stat-card">
                <h3>Tugas Dikerjakan</h3>
                <div class="stat-value">${statuses.in_progress}</div>
            </div>
            <div class="stat-card">
                <h3>Tugas Selesai</h3>
                <div class="stat-value">${statuses.completed}</div>
            </div>
        `;
    } catch (error) {
        taskStatsContainer.innerHTML = '<p>Gagal memuat statistik tugas.</p>';
    }
}