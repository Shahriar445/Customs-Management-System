document.getElementById('customs-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://your-backend-api.com/api/importer/declaration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        alert('Declaration submitted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your declaration.');
    }
});
