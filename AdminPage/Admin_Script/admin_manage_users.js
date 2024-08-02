document.addEventListener('DOMContentLoaded', function() {
    fetchPendingUsers();
    fetchActiveUsers();
});

// Function to fetch pending users from the backend API
async function fetchPendingUsers() {
    try {
        const response = await fetch('https://localhost:7232/api/CMS/pending');
        if (!response.ok) {
            throw new Error('Failed to fetch pending users');
        }
        const pendingUsers = await response.json();
        displayPendingUsers(pendingUsers);
    } catch (error) {
        showMessage(`Error fetching pending users: ${error.message}`, 'error');
    }
}

// Function to fetch active users from the backend API
async function fetchActiveUsers() {
    try {
        const response = await fetch('https://localhost:7232/api/CMS/active');
        if (!response.ok) {
            throw new Error('Failed to fetch active users');
        }
        const activeUsers = await response.json();
        displayActiveUsers(activeUsers);
    } catch (error) {
        showMessage(`Error fetching active users: ${error.message}`, 'error');
    }
}

// Function to display pending users in the table
function displayPendingUsers(users) {
    const pendingTableBody = document.querySelector('#pending-users-table tbody');
    pendingTableBody.innerHTML = ''; // Clear previous content

    users.forEach(user => {
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td>${user.userName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="approve-btn" data-user-id="${user.userId}">Approve</button>
            </td>
        `;
        pendingTableBody.appendChild(userRow);

        // Add event listener for approve button
        userRow.querySelector('.approve-btn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button action
            approveUser(user.userId);
        });
    });
}

// Function to display active users in the table
function displayActiveUsers(users) {
    const activeTableBody = document.querySelector('#active-users-table tbody');
    activeTableBody.innerHTML = ''; // Clear previous content

    users.forEach(user => {
        const userRow = document.createElement('tr');
        userRow.innerHTML = `
            <td>${user.userName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="stop-role-btn" data-user-id="${user.userId}">Stop Role</button>
            </td>
        `;
        activeTableBody.appendChild(userRow);

        // Add event listener for stop role button
        userRow.querySelector('.stop-role-btn').addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default button action
            stopUserRole(user.userId);
        });
    });
}

// Function to approve a user
async function approveUser(userId) {
    try {
        const url = `https://localhost:7232/api/CMS/approve-user/${userId}`;
        console.log(`Approving user with URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isActive: true })
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get error details from the response
            throw new Error(`Failed to approve user: ${response.status} ${errorText}`);
        }

        showMessage('User approved successfully', 'success');
        // Reload both pending users and active users after approval
        fetchPendingUsers(); // Fetch pending users to update the list
        fetchActiveUsers(); // Fetch active users to update the list
    } catch (error) {
        showMessage(`Error approving user: ${error.message}`, 'error');
    }
}

// Function to stop a user's role
async function stopUserRole(userId) {
    try {
        const url = `https://localhost:7232/api/CMS/stop-role/${userId}`;
        console.log(`Stopping role for user with URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isActive: false }) // Set `isActive` to false to stop the role
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get error details from the response
            throw new Error(`Failed to stop user role: ${response.status} ${errorText}`);
        }

        showMessage('User role stopped successfully', 'success');
        // Reload both pending users and active users after stopping role
        fetchPendingUsers(); // Fetch pending users to update the list
        fetchActiveUsers(); // Fetch active users to update the list
    } catch (error) {
        showMessage(`Error stopping user role: ${error.message}`, 'error');
    }
}
// Function to show messages in the UI
function showMessage(message, type) {
    const messageContainer = document.querySelector('#message');
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`; // Add a class based on the type (success/error)
    
    // Remove previous hide class if exists
    messageContainer.classList.remove('hide');
    
    // Add hide class after 2 seconds
    setTimeout(() => {
        messageContainer.classList.add('hide');
    }, 2000); // Duration to show the message
    
    // Reset the message container after transition ends
    messageContainer.addEventListener('transitionend', () => {
        if (messageContainer.classList.contains('hide')) {
            messageContainer.textContent = ''; // Clear message content
            messageContainer.className = 'message'; // Reset class
        }
    }, { once: true });
}
