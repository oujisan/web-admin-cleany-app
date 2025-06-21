// js/users.js (KODE LENGKAP DENGAN LOGIKA PASSWORD FINAL)

document.addEventListener('DOMContentLoaded', () => {
    // --- Referensi Elemen DOM ---
    const tableBody = document.getElementById('users-table-body');
    const modal = document.getElementById('user-modal');
    const addButton = document.getElementById('add-user-button');
    const closeButton = modal.querySelector('.close-button');
    const form = document.getElementById('modal-form');
    const modalTitle = document.getElementById('modal-title');
    const userIdInput = document.getElementById('user-id');
    const oldPasswordInput = document.getElementById('old-password'); // Referensi ke input password lama
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const shiftSelectionGroup = document.getElementById('shift-selection-group');
    const shiftSelect = document.getElementById('shift');

    let availableShifts = [];

    // --- Fungsi-fungsi ---
    const loadShifts = async () => {
        try {
            const response = await apiFetch('/api/shift');
            availableShifts = response.data;
            shiftSelect.innerHTML = '<option value="" disabled selected>Pilih Shift...</option>';
            availableShifts.forEach(shift => {
                const option = document.createElement('option');
                option.value = shift.name;
                option.textContent = `${shift.name} (${shift.startTime} - ${shift.endTime})`;
                shiftSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Gagal memuat data shift:", error);
        }
    };

    const openModal = (user = null) => {
        form.reset();
        shiftSelectionGroup.style.display = 'none';

        if (user) {
            modalTitle.textContent = 'Edit User';
            userIdInput.value = user.userId;
            oldPasswordInput.value = user.password;
            document.getElementById('firstName').value = user.firstName;
            document.getElementById('lastName').value = user.lastName;
            document.getElementById('username').value = user.username;
            document.getElementById('email').value = user.email;
            roleSelect.value = user.role;
            passwordInput.placeholder = 'Kosongkan jika tidak ingin diubah';
            passwordInput.required = false;

            if (user.role === 'cleaner') {
                shiftSelectionGroup.style.display = 'block';
                shiftSelect.value = user.shift;
            }
        } else {
            // Mode Tambah User Baru
            modalTitle.textContent = 'Tambah User';
            userIdInput.value = '';
            oldPasswordInput.value = '';
            passwordInput.placeholder = 'Password wajib diisi';
            passwordInput.required = true;
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    const loadUsers = async () => {
        try {
            const response = await apiFetch('/api/user');
            tableBody.innerHTML = '';
            response.data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.userId}</td>
                    <td>${user.firstName} ${user.lastName || ''}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td class="actions-cell">
                        <button class="edit-btn" data-id="${user.userId}">Edit</button>
                        <button class="delete-btn" data-id="${user.userId}">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="6">Gagal memuat data.</td></tr>`;
        }
    };

    // --- Event Listeners ---
    addButton.addEventListener('click', () => openModal());
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    roleSelect.addEventListener('change', (event) => {
        if (event.target.value === 'cleaner') {
            shiftSelectionGroup.style.display = 'block';
            shiftSelect.required = true;
        } else {
            shiftSelectionGroup.style.display = 'none';
            shiftSelect.required = false;
        }
    });

    tableBody.addEventListener('click', async (event) => {
        const target = event.target;
        const id = target.dataset.id;
        if (target.classList.contains('delete-btn')) {
            if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
                try {
                    await apiFetch(`/api/user/delete/${id}`, { method: 'DELETE' });
                    loadUsers();
                } catch (error) {
                    alert('Gagal menghapus user.');
                }
            }
        }
        if (target.classList.contains('edit-btn')) {
            try {
                const response = await apiFetch('/api/user');
                const user = response.data.find(u => u.userId == id);
                if (user) openModal(user);
            } catch(error) {
                alert('Gagal mengambil data user untuk diedit.');
            }
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = userIdInput.value;
        const selectedRole = roleSelect.value;
        
        const userData = {
            userId: id ? parseInt(id) : 0,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            role: selectedRole,
            imageUrl: "",
            shift: selectedRole === 'cleaner' ? shiftSelect.value : ""
        };
        
        if (id) {
            if (passwordInput.value) {
                userData.password = passwordInput.value;
            } else {
                userData.password = oldPasswordInput.value;
            }
        } else {
            userData.password = passwordInput.value;
        }

        try {
            if (id) {
                await apiFetch(`/api/user/update/${id}`, { method: 'PUT', body: JSON.stringify(userData) });
            } else {
                await apiFetch('/api/user/add', { method: 'POST', body: JSON.stringify(userData) });
            }
            closeModal();
            loadUsers();
        } catch (error) {
            alert(`Gagal menyimpan user: ${error.message}`);
        }
    });
    loadUsers();
    loadShifts();
});