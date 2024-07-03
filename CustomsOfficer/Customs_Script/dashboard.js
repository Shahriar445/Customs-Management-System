document.addEventListener('DOMContentLoaded', function() {
    // Selecting elements where data will be populated
    const summarySection = document.querySelector('.summary');
    const overviewCards = document.querySelector('.overview-cards');

    // API endpoint for fetching dashboard data
    const apiUrl = 'https://example.com/api/dashboard';

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update summary section
            summarySection.innerHTML = `
                <h2>Dashboard Summary</h2>
                <p>Total Declarations: ${data.totalDeclarations}</p>
                <p>Shipment Pending: ${data.shipmentPending}</p>
                <p>Running Shipments: ${data.runningShipments}</p>
            `;

            // Update overview cards
            data.overviewCards.forEach(card => {
                overviewCards.innerHTML += `
                    <div class="card">
                        <h3>${card.title}</h3>
                        <p>${card.value}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
