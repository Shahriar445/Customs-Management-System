async function fetchSummaryData(apiUrl, role) {
    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Update the HTML elements with the data
        document.getElementById(`${role}-total-declarations`).textContent = data.totalDeclarations;
        document.getElementById(`${role}-pending-shipments`).textContent = data.pendingShipments;
        document.getElementById(`${role}-running-shipments`).textContent = data.runningShipments;
    } catch (error) {
        console.error(`Error fetching ${role} summary data:`, error);
    }
}

// Call the function to fetch and update data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSummaryData('https://localhost:7232/api/CMS/exporter-summary', 'exporter');
    fetchSummaryData('https://localhost:7232/api/CMS/importer-summary', 'importer');
});
