document.addEventListener('DOMContentLoaded', function() {
    const declarationForm = document.getElementById('declaration-form');

    declarationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting

        // Collect form data
        const formData = new FormData(declarationForm);
        const formDataObj = Object.fromEntries(formData.entries());

        // API endpoint URL
        const apiUrl = ''; //  actual API endpoint here 

        // Example: Logging form data to console (remove in production)
        console.log('Form Data:', formDataObj);

        // Fetch POST request to API
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle API response
            console.log('API Response:', data);
            alert('Declaration submitted successfully!'); // Example alert, customize as needed
            // Optionally, reset the form after successful submission
            declarationForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the declaration.');
        });
    });
});
