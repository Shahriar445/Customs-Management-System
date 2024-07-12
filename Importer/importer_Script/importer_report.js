document.addEventListener('DOMContentLoaded', function() {
    const reportTableBody = document.getElementById('report-data');
    const createReportForm = document.getElementById('create-report-form');

    // Function to fetch and display reports
    async function fetchReports() {
        try {
            const response = await fetch('https://localhost:7232/api/CMS/GetReports');
            if (!response.ok) {
                throw new Error('Failed to fetch reports');
            }
            const reports = await response.json();
            displayReports(reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }

    // Function to display reports in the table
    function displayReports(reports) {
        reportTableBody.innerHTML = ''; // Clear existing rows
        reports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.reportId}</td>
                <td>${report.reportType}</td>
                <td>${new Date(report.createAt).toLocaleDateString()}</td>
                <td>
                    <button onclick="downloadReport(${report.reportId})">Download</button>
                </td>
            `;
            reportTableBody.appendChild(row);
        });
    }

    // Function to handle report download
    async function downloadReport(reportId) {
        try {
            const response = await fetch(`https://localhost:7232/api/CMS/GetReport/${reportId}`);
            if (!response.ok) {
                throw new Error('Failed to download report');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${reportId}.pdf`; // Adjust filename if necessary
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    }

    // Function to handle form submission for creating a report
    createReportForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const reportType = document.getElementById('report-type').value;
        const content = document.getElementById('content').value;
        const declarationDate = document.getElementById('declaration-date').value;

        const productName = document.getElementById('product-name').value;
        const quantity = document.getElementById('quantity').value;
        const weight = document.getElementById('weight').value;
        const country = document.getElementById('country').value;
        const hscode = document.getElementById('hscode').value;

        const methodShipment = document.getElementById('method-shipment').value;
        const portDeparture = document.getElementById('port-departure').value;
        const portDestination = document.getElementById('port-destination').value;
        const departureDate = document.getElementById('departure-date').value;
        const arrivalDate = document.getElementById('arrival-date').value;

        // Prepare the data to send to the API
        const reportDto = {
            userId: 1, // Replace with actual user ID or fetch dynamically
            reportType: reportType,
            content: content,
            declaration: {
                userId: 1, // Replace with actual user ID or fetch dynamically
                declarationDate: declarationDate,
                status: 'Pending', // Assuming default status
                products: [{
                    productName: productName,
                    quantity: parseInt(quantity),
                    weight: parseFloat(weight),
                    countryOfOrigin: country,
                    hscode: hscode
                }],
                shipments: [{
                    methodOfShipment: methodShipment,
                    portOfDeparture: portDeparture,
                    portOfDestination: portDestination,
                    departureDate: departureDate,
                    arrivalDate: arrivalDate
                }]
            }
        };

        try {
            const response = await fetch('https://localhost:7232/api/CMS/CreateReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportDto)
            });

            if (!response.ok) {
                throw new Error('Failed to create report');
            }

            // Refresh the reports table after creating the report
            fetchReports();

            // Reset the form fields after successful submission
            createReportForm.reset();
        } catch (error) {
            console.error('Error creating report:', error);
        }
    });

    // Fetch reports when the page loads
    fetchReports();
});
