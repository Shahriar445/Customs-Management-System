// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch(''); //  API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Process data here (e.g., update UI)
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to send data to the API (example for adding a user)
async function addUser(userData) {
    try {
        const response = await fetch('https://api.example.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Failed to add user');
        }
        const result = await response.json();
        // Handle success response
        console.log('User added successfully:', result);
    } catch (error) {
        console.error('Error adding user:', error);
    }
}

// Example usage:
// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

// Example of adding a user (call this function when needed)
const newUser = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    role: 'user',
};
addUser(newUser);
