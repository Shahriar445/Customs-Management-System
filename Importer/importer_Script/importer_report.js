document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.yourbackend.com/importer/reports') //  actual API endpoint
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('report-data');
            data.forEach(report => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${report.id}</td>
                    <td>${report.name}</td>
                    <td>${report.dateGenerated}</td>
                    <td class="actions">
                        <button onclick="viewReport(${report.id})">View</button>
                        <button onclick="downloadReport(${report.id})">Download PDF</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching report data:', error));
});

function viewReport(reportId) {
    // Implement the function to view the report details
    alert('Viewing report ' + reportId);
}

function downloadReport(reportId) {
    fetch(`https://api.yourbackend.com/importer/reports/${reportId}/download`, { //  actual API endpoint
        method: 'GET',
        headers: {
            'Content-Type': 'application/pdf',
        },
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
        throw new Error('Network response was not ok.');
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => console.error('Error downloading report:', error));
}
