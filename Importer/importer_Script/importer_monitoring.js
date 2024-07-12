document.addEventListener('DOMContentLoaded', function () {
    fetch('https://localhost:7232/api/CMS/GetMonitorings')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const shipmentData = document.getElementById('shipment-data');
            data.forEach(item => {
                const row = document.createElement('tr');
                
                const shipmentIdCell = document.createElement('td');
                shipmentIdCell.textContent = item.monitoringId;
                row.appendChild(shipmentIdCell);

                const declarationIdCell = document.createElement('td');
                declarationIdCell.textContent = item.declarationId;
                row.appendChild(declarationIdCell);
                
                const methodOfShipmentCell = document.createElement('td');
                methodOfShipmentCell.textContent = item.methodOfShipment;
                row.appendChild(methodOfShipmentCell);
                
                const portOfDepartureCell = document.createElement('td');
                portOfDepartureCell.textContent = item.portOfDeparture;
                row.appendChild(portOfDepartureCell);
                
                const portOfDestinationCell = document.createElement('td');
                portOfDestinationCell.textContent = item.portOfDestination;
                row.appendChild(portOfDestinationCell);
                
                const departureDateCell = document.createElement('td');
                departureDateCell.textContent = new Date(item.departureDate).toLocaleDateString();
                row.appendChild(departureDateCell);
                
                const arrivalDateCell = document.createElement('td');
                arrivalDateCell.textContent = new Date(item.arrivalDate).toLocaleDateString();
                row.appendChild(arrivalDateCell);
                
                const statusCell = document.createElement('td');
                statusCell.textContent = item.status;
                row.appendChild(statusCell);

                const productNameCell = document.createElement('td');
                productNameCell.textContent = item.productName;
                row.appendChild(productNameCell);

                const quantityCell = document.createElement('td');
                quantityCell.textContent = item.quantity;
                row.appendChild(quantityCell);

                const weightCell = document.createElement('td');
                weightCell.textContent = item.weight;
                row.appendChild(weightCell);

                const countryOfOriginCell = document.createElement('td');
                countryOfOriginCell.textContent = item.countryOfOrigin;
                row.appendChild(countryOfOriginCell);

                const hsCodeCell = document.createElement('td');
                hsCodeCell.textContent = item.hscode;
                row.appendChild(hsCodeCell);
                
                shipmentData.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
});
