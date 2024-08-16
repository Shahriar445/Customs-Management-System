document.addEventListener('DOMContentLoaded', () => {
    const reportTable = document.getElementById('report-data');
    const downloadButton = document.getElementById('download-report');

    // Fetch the report data
    fetch('https://localhost:7232/Get-officer-report')
        .then(response => response.json())
        .then(data => {
            // Populate the report table
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.declarationId}</td>
                    <td>${item.userName}</td>
                    <td>${item.roleName}</td>
                    <td>${new Date(item.declarationDate).toLocaleDateString()}</td>
                    <td>${item.status}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.totalPrice.toFixed(2)}</td>
                `;
                reportTable.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching report data:', error));

    // Download PDF report
    downloadButton.addEventListener('click', () => {
        window.location.href = 'https://localhost:7232/download-report';
    });
});
