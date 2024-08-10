document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch monitoring overview data
    async function fetchMonitoringOverview() {
        try {
            const response = await fetch('https://localhost:7232/Exporter-monitoring');
            if (!response.ok) {
                throw new Error('Failed to fetch monitoring overview');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching monitoring overview:', error.message);
            return null;
        }
    }

    // Function to update DOM with monitoring overview data
    async function updateMonitoringOverview() {
        const data = await fetchMonitoringOverview();
        if (data) {
            document.getElementById('shipments-processed').textContent = `${data.shipmentsProcessed} shipments processed.`;
            document.getElementById('shipments-pending').textContent = `${data.shipmentPending} shipments pending.`;

            document.getElementById('current-status').textContent = data.currentStatus;
            document.getElementById('customs-clearance').textContent = `Clearance rate: ${data.customsClearanceRate.toFixed(2)}%`;
        } else {
            // Handle error case or display default values
            document.getElementById('shipments-processed').textContent = 'N/A';
            document.getElementById('shipments-pending').textContent = 'N/A';
            document.getElementById('current-status').textContent = 'N/A';
            document.getElementById('customs-clearance').textContent = 'N/A';
        }
    }

    // Call updateMonitoringOverview function when page loads
    updateMonitoringOverview();
});
