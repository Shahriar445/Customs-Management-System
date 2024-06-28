document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const reportsDataContainer = document.querySelector('.reports-data');

    // Function to fetch reports data from the backend API
    function fetchReportsData() {
        // API endpoint URL for reports
        const apiUrl = '';

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
                displayReportsData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Handle error gracefully, e.g., display a message to the user
            });
    }

    // Function to display reports data on the dashboard
    function displayReportsData(data) {
        // Clear previous data
        reportsDataContainer.innerHTML = '';

        // Loop through the data and create HTML elements to display
        data.forEach(item => {
            const reportItem = document.createElement('div');
            reportItem.classList.add('report-item');

            const title = document.createElement('h3');
            title.textContent = item.title;

            const description = document.createElement('p');
            description.textContent = item.description;

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download PDF';
            downloadButton.addEventListener('click', function() {
                downloadPDFReport(item.id); // Call function to download PDF
            });

            reportItem.appendChild(title);
            reportItem.appendChild(description);
            reportItem.appendChild(downloadButton);

            reportsDataContainer.appendChild(reportItem);
        });
    }

    // Function to download PDF report
    function downloadPDFReport(reportId) {
        //  backend API endpoint for downloading PDF
        const pdfUrl = `https://your-backend-api.com/exporter/reports/${reportId}/pdf`;

        // Use JavaScript to initiate download
        fetch(pdfUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${reportId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error downloading PDF:', error);
                // Handle error gracefully, e.g., display a message to the user
            });
    }

    // Initial fetch when the page loads
    fetchReportsData();
});
