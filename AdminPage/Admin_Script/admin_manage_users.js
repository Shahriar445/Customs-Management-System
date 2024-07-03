// Function to fetch pending users from the backend API
async function fetchPendingUsers() {
    try {
        const response = await fetch('http://your-backend-api-url/pending-users');
        if (!response.ok) {
            throw new Error('Failed to fetch pending users');
        }
        const pendingUsers = await response.json();
        displayPendingUsers(pendingUsers);
    } catch (error) {
        console.error('Error fetching pending users:', error);
    }
}

// Function to fetch active users from the backend API
async function fetchActiveUsers() {
    try {
        const response = await fetch('http://your-backend-api-url/active-users');
        if (!response.ok) {
            throw new Error('Failed to fetch active users');
        }
        const activeUsers = await response.json();
        displayActiveUsers(activeUsers);
    } catch (error) {
        console.error('Error fetching active users:', error);
    }
}

// Function to display pending users in the UI
function displayPendingUsers(users) {
    const pendingList = document.querySelector('.pending-list');
    pendingList.innerHTML = ''; // Clear previous content

    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user-item');
        userElement.innerHTML = `
            <p>${user.username}</p>
            <button class="approve-btn" data-user-id="${user.id}">Approve</button>
            <button class="reject-btn" data-user-id="${user.id}">Reject</button>
        `;
        pendingList.appendChild(userElement);

        // Add event listeners for approve and reject buttons
        const approveBtn = userElement.querySelector('.approve-btn');
        approveBtn.addEventListener('click', () => approveUser(user.id));

        const rejectBtn = userElement.querySelector('.reject-btn');
        rejectBtn.addEventListener('click', () => rejectUser(user.id));
    });
}

// Function to display active users in the UI
function displayActiveUsers(users) {
    const activeList = document.querySelector('.active-list');
    activeList.innerHTML = ''; // Clear previous content

    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.classList.add('user-item');
        userElement.innerHTML = `
            <p>${user.username}</p>
            <button class="stop-role-btn" data-user-id="${user.id}">Stop Role</button>
        `;
        activeList.appendChild(userElement);

        // Add event listener for stop role button
        const stopRoleBtn = userElement.querySelector('.stop-role-btn');
        stopRoleBtn.addEventListener('click', () => stopUserRole(user.id));
    });
}

// Function to approve a user
async function approveUser(userId) {
    try {
        const response = await fetch(`http://your-backend-api-url/approve-user/${userId}`, {
            method: 'PUT', // Assuming your API uses PUT for update
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'approved' })
        });
        if (!response.ok) {
            throw new Error('Failed to approve user');
        }
        // Reload pending users after approval
        fetchPendingUsers();
    } catch (error) {
        console.error('Error approving user:', error);
    }
}

// Function to reject a user
async function rejectUser(userId) {
    try {
        const response = await fetch(`http://your-backend-api-url/reject-user/${userId}`, {
            method: 'PUT', // Assuming your API uses PUT for update
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'rejected' })
        });
        if (!response.ok) {
            throw new Error('Failed to reject user');
        }
        // Reload pending users after rejection
        fetchPendingUsers();
    } catch (error) {
        console.error('Error rejecting user:', error);
    }
}

// Function to stop user's role
async function stopUserRole(userId) {
    try {
        const response = await fetch(`http://your-backend-api-url/stop-role/${userId}`, {
            method: 'PUT', // Assuming your API uses PUT for update
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: 'inactive' })
        });
        if (!response.ok) {
            throw new Error('Failed to stop user role');
        }
        // Reload active users after stopping role
        fetchActiveUsers();
    } catch (error) {
        console.error('Error stopping user role:', error);
    }
}

// Initialize page by fetching and displaying users
fetchPendingUsers();
fetchActiveUsers();
