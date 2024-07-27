// dashboard.js

// Function to fetch dashboard overview data
async function fetchDashboardOverview() {
    try {
        const response = await fetch('https://localhost:7232/api/CMS/dashboardOverview');
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
        document.getElementById('reports-generated').textContent = data.generatedReports;
    } else {
        // Handle error case or display default values
        document.getElementById('total-declarations').textContent = 'N/A';
        document.getElementById('pending-payments').textContent = 'N/A';
        document.getElementById('shipments-monitored').textContent = 'N/A';
        document.getElementById('reports-generated').textContent = 'N/A';
    }
}

// Call updateDashboardOverview function when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardOverview();
});
