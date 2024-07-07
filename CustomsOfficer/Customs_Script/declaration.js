document.addEventListener('DOMContentLoaded', function () {
    const declarationForm = document.getElementById('declarationForm');
    const declarationList = document.getElementById('declarationList');

    // Event listener for form submission
    declarationForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const formData = new FormData(declarationForm);
        const exporterName = formData.get('exporterName');
        const destinationPort = formData.get('destinationPort');
        const expectedDeparture = formData.get('expectedDeparture');
        const expectedArrival = formData.get('expectedArrival');

        // Example API endpoint (replace with your actual endpoint)
        const apiUrl = 'https://api.example.com/declarations';

        // Example POST request to submit declaration
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                exporterName,
                destinationPort,
                expectedDeparture,
                expectedArrival,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear form fields after successful submission
            declarationForm.reset();
            // Display a success message or update UI as needed
            alert('Declaration submitted successfully!');
            // Optionally, fetch updated list of declarations
            fetchDeclarations();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit declaration. Please try again.');
        });
    });

    // Function to fetch and display declarations
    function fetchDeclarations() {
        // Example API endpoint to fetch declarations (replace with actual endpoint)
        const apiUrl = 'https://api.example.com/declarations';

        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear existing list items
            declarationList.innerHTML = '';

            // Iterate through fetched data and create list items
            data.forEach(declaration => {
                const listItem = document.createElement('li');
                listItem.textContent = `Exporter: ${declaration.exporterName}, Destination Port: ${declaration.destinationPort}, Departure: ${declaration.expectedDeparture}, Arrival: ${declaration.expectedArrival}`;
                declarationList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to fetch declarations. Please try again.');
        });
    }

    // Initial fetch of declarations when page loads
    fetchDeclarations();
});
