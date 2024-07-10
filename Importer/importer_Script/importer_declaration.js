document.getElementById('customs-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        userId: 1, // Replace with the actual user ID from your authentication or session
        declarationDate: new Date().toISOString(), // You can format this date as per your requirement
        status: "Pending", // Initial status

        products: [{
            productName: formData.get('products-description'),
            quantity: parseInt(formData.get('products-quantity')),
            valueUSD: parseFloat(formData.get('products-value')),
            countryOfOrigin: formData.get('country-origin'),
            hsCode: formData.get('hs-code'),
            declarationId: 0 // Assuming this will be set by the server
        }],

        shipments: [{
            methodOfShipment: formData.get('shipment-method'),
            portOfDeparture: formData.get('departure-port'),
            portOfDestination: formData.get('destination-port'),
            departureDate: formData.get('expected-departure'),
            arrivalDate: formData.get('expected-arrival')
        }]
    };

    try {
        const response = await fetch('https://localhost:7232/CreateDeclaration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage);
        }

        alert('Declaration submitted successfully!');
        // Optionally, redirect to another page or clear the form
        // window.location.href = '/success-page.html';
         this.reset(); // Clear the form inputs
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the declaration.');
    }
});
