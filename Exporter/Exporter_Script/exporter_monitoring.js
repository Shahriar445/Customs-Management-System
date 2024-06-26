document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const monitoringDataContainer = document.querySelector('.monitoring-data');

    // Function to fetch monitoring data from the backend API
    function fetchMonitoringData() {
        // Replace with your actual API endpoint URL
        const apiUrl = 'https://your-backend-api.com/exporter/monitoring';

        // Make a GET request to fetch data
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Process the retrieved data
                displayMonitoringData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Handle error gracefully, e.g., display a message to the user
            });
    }

    // Function to display monitoring data on the dashboard
    function displayMonitoringData(data) {
        // Clear previous data
        monitoringDataContainer.innerHTML = '';

        // Loop through the data and create HTML elements to display
        data.forEach(item => {
            const monitoringItem = document.createElement('div');
            monitoringItem.classList.add('monitoring-item');

            const title = document.createElement('h3');
            title.textContent = item.title;

            const description = document.createElement('p');
            description.textContent = item.description;

            monitoringItem.appendChild(title);
            monitoringItem.appendChild(description);

            monitoringDataContainer.appendChild(monitoringItem);
        });
    }

    // Initial fetch when the page loads
    fetchMonitoringData();
});
