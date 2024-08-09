document.addEventListener('DOMContentLoaded', async function() {
    // Function to fetch dashboard data
    async function fetchDashboardData() {
        try {
            const response = await fetch('https://localhost:7232/Exporter_Dashboard');
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching dashboard data:', error.message);
            return null;
        }
    }

    // Function to update DOM with fetched data
    async function updateDashboard() {
        const dashboardData = await fetchDashboardData();
        if (dashboardData) {
            document.getElementById('total-declarations').textContent = dashboardData.totalDeclarations;
            document.getElementById('pending-payments').textContent = dashboardData.pendingPayments;
            document.getElementById('shipments-monitored').textContent = dashboardData.shipmentMonitoring;
        } else {
            // Handle the case when data is null or error occurred
            document.getElementById('total-declarations').textContent = 'N/A';
            document.getElementById('pending-payments').textContent = 'N/A';
            document.getElementById('shipments-monitored').textContent = 'N/A';
        }
    }

    // Call the function to update the dashboard overview when the page loads
    updateDashboard();
});
