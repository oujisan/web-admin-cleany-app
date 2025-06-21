// js/shifts.js
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('shifts-table-body');
    const modal = document.getElementById('shift-modal');
    const addButton = document.getElementById('add-shift-button');
    const closeButton = document.querySelector('.close-button');
    const form = document.getElementById('modal-form');
    const modalTitle = document.getElementById('modal-title');
    const shiftIdInput = document.getElementById('shift-id');

    const openModal = (shift = null) => {
        form.reset();
        if (shift) {
            modalTitle.textContent = 'Edit Shift';
            shiftIdInput.value = shift.shiftId;
            document.getElementById('name').value = shift.name;
            document.getElementById('startTime').value = shift.startTime;
            document.getElementById('endTime').value = shift.endTime;
        } else {
            modalTitle.textContent = 'Tambah Shift';
            shiftIdInput.value = '';
        }
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    addButton.addEventListener('click', () => openModal());
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) closeModal();
    });

    const loadShifts = async () => {
        try {
            const response = await apiFetch('/api/shift');
            tableBody.innerHTML = '';
            response.data.forEach(shift => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${shift.shiftId}</td>
                    <td>${shift.name}</td>
                    <td>${shift.startTime}</td>
                    <td>${shift.endTime}</td>
                    <td class="actions-cell">
                        <button class="edit-btn" data-id="${shift.shiftId}">Edit</button>
                        <button class="delete-btn" data-id="${shift.shiftId}">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="5">Gagal memuat data.</td></tr>`;
        }
    };

    tableBody.addEventListener('click', async (event) => {
        const target = event.target;
        const id = target.dataset.id;
        if (target.classList.contains('delete-btn')) {
            if (confirm('Apakah Anda yakin ingin menghapus shift ini?')) {
                try {
                    await apiFetch(`/api/shift/delete/${id}`, { method: 'DELETE' });
                    loadShifts();
                } catch (error) {
                    alert('Gagal menghapus shift.');
                }
            }
        }
        if (target.classList.contains('edit-btn')) {
             try {
                const response = await apiFetch('/api/shift');
                const shift = response.data.find(s => s.shiftId == id);
                if (shift) openModal(shift);
            } catch (error) {
                 alert('Gagal mengambil data shift untuk diedit.');
            }
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = shiftIdInput.value;
        const shiftData = {
            name: document.getElementById('name').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
        };

        try {
            if (id) {
                await apiFetch(`/api/shift/update/${id}`, { method: 'PUT', body: JSON.stringify(shiftData) });
            } else {
                await apiFetch('/api/shift/add', { method: 'POST', body: JSON.stringify(shiftData) });
            }
            closeModal();
            loadShifts();
        } catch (error) {
            alert(`Gagal menyimpan shift: ${error.message}`);
        }
    });
    
    loadShifts();
});