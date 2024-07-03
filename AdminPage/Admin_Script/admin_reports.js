document.getElementById('report-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get selected user type
    const userType = document.getElementById('user-type').value;

    // Example: Fetch data from backend API (replace with your actual API endpoint)
    fetch(`https://api.example.com/users?type=${userType}`)
        .then(response => response.json())
        .then(data => {
            // Clear previous results
            const reportContent = document.getElementById('report-content');
            reportContent.innerHTML = '';

            // Generate report based on fetched data
            data.forEach(user => {
                const userElement = document.createElement('div');
                userElement.classList.add('user');
                userElement.innerHTML = `<strong>${user.name}</strong> (${user.email})`;

                reportContent.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
