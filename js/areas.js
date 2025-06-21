// js/areas.js
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('areas-table-body');
    const modal = document.getElementById('area-modal');
    const addButton = document.getElementById('add-area-button');
    const closeButton = document.querySelector('.close-button');
    const form = document.getElementById('modal-form');
    const modalTitle = document.getElementById('modal-title');
    const areaIdInput = document.getElementById('area-id');

    const openModal = (area = null) => {
        form.reset();
        if (area) {
            modalTitle.textContent = 'Edit Area';
            areaIdInput.value = area.areaId;
            document.getElementById('name').value = area.name;
            document.getElementById('floor').value = area.floor;
            document.getElementById('building').value = area.building;
        } else {
            modalTitle.textContent = 'Tambah Area';
            areaIdInput.value = '';
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

    const loadAreas = async () => {
        try {
            const response = await apiFetch('/api/area');
            tableBody.innerHTML = '';
            response.data.forEach(area => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${area.areaId}</td>
                    <td>${area.name}</td>
                    <td>${area.floor}</td>
                    <td>${area.building}</td>
                    <td class="actions-cell">
                        <button class="edit-btn" data-id="${area.areaId}">Edit</button>
                        <button class="delete-btn" data-id="${area.areaId}">Hapus</button>
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
            if (confirm('Apakah Anda yakin ingin menghapus area ini?')) {
                try {
                    await apiFetch(`/api/area/delete/${id}`, { method: 'DELETE' });
                    loadAreas();
                } catch (error) {
                    alert('Gagal menghapus area.');
                }
            }
        }
        if (target.classList.contains('edit-btn')) {
            try {
                const response = await apiFetch('/api/area');
                const area = response.data.find(a => a.areaId == id);
                if (area) openModal(area);
            } catch (error) {
                 alert('Gagal mengambil data area untuk diedit.');
            }
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = areaIdInput.value;
        const areaData = {
            name: document.getElementById('name').value,
            floor: parseInt(document.getElementById('floor').value),
            building: document.getElementById('building').value,
        };
        print(areaData);

        try {
            if (id) {
                await apiFetch(`/api/area/update/${id}`, { method: 'PUT', body: JSON.stringify(areaData) });
            } else {
                await apiFetch('/api/area/add', { method: 'POST', body: JSON.stringify(areaData) });
            }
            closeModal();
            loadAreas();
        } catch (error) {
            alert(`Gagal menyimpan area: ${error.message}`);
        }
    });

    loadAreas();
});