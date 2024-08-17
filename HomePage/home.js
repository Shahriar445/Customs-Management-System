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

    // Handle unique login URL with token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        // Store the token in localStorage
        localStorage.setItem('token', token);

        // Decode the token to get user information (optional)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.sub;
        const role = payload.role;
        const userId = payload.userId; // Retrieve userId from payload

        // Store userId in localStorage
        localStorage.setItem('userId', userId);

        // Redirect to the appropriate dashboard
        redirectToDashboard(username, role);
    }
});

async function login(username, password, role) {
    try {
        const response = await fetch('https://localhost:7232/api/Auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ UserName: username, Password: password, Role: role })
        });

        const responseBody = await response.json(); // Parse JSON response

        console.log('Response from server:', responseBody); // Log the entire response

        if (response.ok) {
            // Store the JWT token and userId in localStorage
            localStorage.setItem('token', responseBody.token);
            localStorage.setItem('userId', responseBody.userId); // Store userId
            
            // Determine the base URL for redirection based on role
            let baseUrl = 'http://127.0.0.1:5501/';

            // Map roles to their respective paths
            const rolePaths = {
                'admin': 'AdminPage/admin_dashboard.html',
                'customs officer': 'CustomsOfficer/customsOfficer_dashboard.html',
                'importer': 'Importer/importer_dashboard.html',
                'exporter': 'Exporter/exporter_dashboard.html'
            };

            // Get the correct path for the role
            const path = rolePaths[role.toLowerCase()];

            if (path) {
                // Redirect to the role-specific URL with the token as a query parameter
                window.location.href = `${baseUrl}${path}?token=${responseBody.token}`;
            } else {
                console.error('Invalid role:', role);
                alert('An error occurred: invalid role.');
            }
        } else {
            // Handle error messages based on the response body
            if (responseBody.message) {
                alert(responseBody.message);
            } else {
                alert('An error occurred during login.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
}

async function register(username, email, password, role) {
    try {
        const response = await fetch('https://localhost:7232/api/Auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                UserName: username, // Matches backend property
                Email: email, // Matches backend property
                Password: password, // Matches backend property
                Role: role // Matches backend property
            })
        });

        if (response.ok) {
            console.log('User registered:', username, 'Role:', role);
            alert('Registration successful!'); // Show success message
            clearRegistrationForm(); // Clear the registration form fields
        } else {
            const error = await response.text();
            alert(`Registration failed: ${error}`); // Show error message from server
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

function redirectToDashboard(username, role) {
    console.log('Redirecting user:', username, 'Role:', role); // Log to check values

    const dashboardUrls = {
        'admin': '../AdminPage/admin_dashboard.html',
        'customs officer': '../CustomsOfficer/customsOfficer_dashboard.html',
        'importer': '../Importer/importer_dashboard.html',
        'exporter': '../Exporter/exporter_dashboard.html'
    };

    if (role) {
        const normalizedRole = role.toLowerCase();

        if (dashboardUrls.hasOwnProperty(normalizedRole)) {
            window.location.href = dashboardUrls[normalizedRole];
        } else {
            console.error('Invalid role:', role);
            alert('An error occurred: invalid role.');
        }
    } else {
        console.error('Role is undefined');
        alert('An error occurred: role is undefined.');
    }
}
