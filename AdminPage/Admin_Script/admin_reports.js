document.addEventListener('DOMContentLoaded', function() {
    populateUserOptions();
});

document.getElementById('report-form').addEventListener('submit', function(event) {
    event.preventDefault();
    generateReport();
});

// Function to get JWT token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Function to populate user options in the dropdown
function populateUserOptions() {
    const token = getToken();
    
    fetch('https://localhost:7232/api/CMS/active', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const userTypeSelect = document.getElementById('user-type');
        data.forEach(user => {
            const option = document.createElement('option');
            option.value = user.userId;
            option.textContent = `${user.userName} (${user.role})`;
            userTypeSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching user data:', error));
}

// Function to generate a report for the selected user
function generateReport() {
    const token = getToken();
    const selectedUserId = document.getElementById('user-type').value;

    fetch(`https://localhost:7232/api/CMS/user-reports?userId=${selectedUserId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => displayReport(data))
    .catch(error => console.error('Error fetching report data:', error));
}

// Function to display the report
function displayReport(data) {
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = ''; // Clear previous content

    if (!data || Object.keys(data).length === 0) {
        reportContent.innerHTML = '<p>No data available for this user.</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>User ID</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Declarations</th>
                <th>Payments</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${data.userId}</td>
                <td>${data.userName}</td>
                <td>${data.role}</td>
                <td>
                    <ul>
                        ${(data.Declarations || []).map(declaration => `
                            <li>ID: ${declaration.DeclarationId}, Date: ${declaration.DeclarationDate}, Status: ${declaration.IsActive}</li>
                        `).join('')}
                    </ul>
                </td>
                <td>
                    <ul>
                        ${(data.Payments || []).map(payment => `
                            <li>ID: ${payment.PaymentId}, Amount: ${payment.Amount}, Date: ${payment.Date}, Status: ${payment.Status}</li>
                        `).join('')}
                    </ul>
                </td>
            </tr>
        </tbody>
    `;
    reportContent.appendChild(table);
}
