document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.yourbackend.com/importer/monitoring') // Replace with your actual API endpoint
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('shipment-data');
            data.forEach(shipment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${shipment.id}</td>
                    <td>${shipment.productName}</td>
                    <td>${shipment.status}</td>
                    <td>${shipment.estimatedArrival}</td>
                    <td>${shipment.currentLocation}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching shipment data:', error));
});
