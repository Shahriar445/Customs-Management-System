// Function to fetch data from the API
async function fetchData() {
    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // Check if the token is available
        if (!token) {
            console.error('Token not found. Please log in again.');
            alert('You are not authorized to view this page. Please log in.');
            window.location.href = '..\index.html'; // Redirect to login page
            return;
        }

        // Fetch data from the API with the Authorization header
        const response = await fetch('https://localhost:7232/api/CMS/user-counts', {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the request
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Process and display data
        document.getElementById('total-exporters').textContent = data.totalExporters || '0';
        document.getElementById('total-importers').textContent = data.totalImporters || '0';
        document.getElementById('total-customs-officers').textContent = data.totalCustomsOfficers || '0';

        // For Pending Approvals and Active Users, if you have these data in your API response
        document.getElementById('pending-approvals').textContent = data.pendingApprovals || '0';
        document.getElementById('active-users').textContent = data.activeUsers || '0';

        console.log('Fetched data:', data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching data.');
    }
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});
