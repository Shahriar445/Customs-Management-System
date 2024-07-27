document.addEventListener('DOMContentLoaded', function() {
    // Show login form by default
    document.getElementById('login-form').classList.remove('form-hidden');

    // Event listener for showing registration form
    document.getElementById('show-register').addEventListener('click', function() {
        document.getElementById('login-form').classList.add('form-hidden');
        document.getElementById('register-form').classList.remove('form-hidden');
    });

    // Event listener for showing login form
    document.getElementById('show-login').addEventListener('click', function() {
        document.getElementById('register-form').classList.add('form-hidden');
        document.getElementById('login-form').classList.remove('form-hidden');
    });

    // Event listener for form submission (login or register)
    document.querySelectorAll('form').forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            if (form.id === 'login-form') {
                // Perform login logic
                const username = this.querySelector('input[name="username"]').value;
                const password = this.querySelector('input[name="password"]').value;
                const role = this.querySelector('select[name="role"]').value;
                login(username, password, role);
            } else if (form.id === 'register-form') {
                // Perform registration logic
                const username = this.querySelector('input[name="username"]').value;
                const email = this.querySelector('input[name="email"]').value;
                const password = this.querySelector('input[name="password"]').value;
                const role = this.querySelector('select[name="role"]').value;
                register(username, email, password, role);
            }
        });
    });
});

// Function to perform login
async function login(username, password, role) {
    try {
        const response = await fetch('https://localhost:7232/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User logged in:', username, 'Role:', data.role);
            redirectToDashboard(data.userName, data.role);
        } else {
            alert('Login failed. Please check your credentials and role.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
}

// Function to perform registration
async function register(username, email, password, role) {
    try {
        const response = await fetch('https://localhost:7232/api/Auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, role })
        });

        if (response.ok) {
            console.log('User registered:', username, 'Role:', role);
            alert('Registration successful!'); // Show success message
            clearRegistrationForm(); // Clear the registration form fields
           
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration.');
    }
}

// Function to clear registration form
function clearRegistrationForm() {
    document.getElementById('register-form').reset(); // Reset the form fields
}

// Function to redirect user to appropriate dashboard page based on role
function redirectToDashboard(username, role) {
    // Define the URLs for different dashboard pages based on roles (replace with actual URLs)
    const dashboardUrls = {
        'admin': '../AdminPage/admin_dashboard.html',
        'customs officer': '../CustomsOfficer/customsOfficer_dashboard.html',
        'importer': '../Importer/importer_dashboard.html',
        'exporter': '../Exporter/exporter_dashboard.html'
    };

    // Normalize role to lowercase to ensure case-insensitive comparison
    const normalizedRole = role.toLowerCase();

    // Check if the role exists in the dashboard URLs
    if (dashboardUrls.hasOwnProperty(normalizedRole)) {
        // Redirect user to the appropriate dashboard page based on their role
        window.location.href = dashboardUrls[normalizedRole];
    } else {
        console.error('Invalid role:', role);
        alert('An error occurred: invalid role.');
    }
}
