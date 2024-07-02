document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById('user-form');
    const userTableBody = document.getElementById('user-table-body');
    const userIdInput = document.getElementById('user-id');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const userRoleSelect = document.getElementById('user-role');

    async function fetchUsers() {
        const response = await fetch('/api/users');
        const users = await response.json();
        userTableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                    <button onclick="approveUser(${user.id})">Approve</button>
                    <button onclick="denyUser(${user.id})">Deny</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    userForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const user = {
            id: userIdInput.value,
            name: userNameInput.value,
            email: userEmailInput.value,
            role: userRoleSelect.value
        };
        if (user.id) {
            await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
        } else {
            await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
        }
        userForm.reset();
        fetchUsers();
    });

    window.editUser = async function (id) {
        const response = await fetch(`/api/users/${id}`);
        const user = await response.json();
        userIdInput.value = user.id;
        userNameInput.value = user.name;
        userEmailInput.value = user.email;
        userRoleSelect.value = user.role;
    };

    window.deleteUser = async function (id) {
        await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        });
        fetchUsers();
    };

    window.approveUser = async function (id) {
        await fetch(`/api/users/${id}/approve`, {
            method: 'POST'
        });
        fetchUsers();
    };

    window.denyUser = async function (id) {
        await fetch(`/api/users/${id}/deny`, {
            method: 'POST'
        });
        fetchUsers();
    };

    fetchUsers();
});
