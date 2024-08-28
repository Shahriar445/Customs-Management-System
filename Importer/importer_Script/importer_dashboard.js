// Function to fetch dashboard overview data
async function fetchDashboardOverview() {
    try {
        const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
        if (!userId) {
            throw new Error('User ID not found in localStorage');
        }

        const response = await fetch(`https://localhost:7232/api/CMS/dashboardOverview/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard overview');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dashboard overview:', error.message);
        return null;
    }
}

// Function to update DOM with dashboard overview data
async function updateDashboardOverview() {
    const data = await fetchDashboardOverview();
    if (data) {
        document.getElementById('total-declarations').textContent = data.totalDeclarations;
        document.getElementById('pending-payments').textContent = data.pendingPayments;
        document.getElementById('shipments-monitored').textContent = data.shipmentMonitoring;
    } else {
        // Handle error case or display default values
        document.getElementById('total-declarations').textContent = 'N/A';
        document.getElementById('pending-payments').textContent = 'N/A';
        document.getElementById('shipments-monitored').textContent = 'N/A';
    }
}

// Call updateDashboardOverview function when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardOverview();
});
