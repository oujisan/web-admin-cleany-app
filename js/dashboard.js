// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    loadUserStats();
    loadTaskStats();

    // ✅ Auto-refresh tiap 30 detik
    setInterval(() => {
        loadUserStats();
        loadTaskStats();
    }, 30000);
});

let taskChart; 

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
        console.log('API response:', response);
        const tasks = response.data;

        const statuses = { pending: 0, in_progress: 0, completed: 0 };
        tasks.forEach(task => {
            console.log('Task status:', task.status);
            if (statuses.hasOwnProperty(task.status)) {
                statuses[task.status]++;
            }
        });

        console.log('Task counts:', statuses);

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

        renderTaskChart(statuses);

    } catch (error) {
        taskStatsContainer.innerHTML = '<p>Gagal memuat statistik tugas.</p>';
    }
}

function renderTaskChart(statuses) {
    const ctx = document.getElementById('taskChart').getContext('2d');
    const dataArr = [statuses.pending, statuses.in_progress, statuses.completed];

    if (!taskChart) {
        taskChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tugas Pending', 'Tugas Dikerjakan', 'Tugas Selesai'],
                datasets: [{
                    label: 'Jumlah Tugas',
                    data: dataArr,
                    backgroundColor: ['#f6c23e', '#36b9cc', '#1cc88a'],
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Statistik Tugas',
                        color: '#333',
                        font: {
                            size: 18
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } else {
        taskChart.data.datasets[0].data = dataArr;
        taskChart.update();
    }
}
