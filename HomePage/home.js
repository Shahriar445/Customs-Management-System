// home.js

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

            // Simulate login or registration process (replace with actual logic)
            var username = this.querySelector('input[name="username"]').value;
            var password = this.querySelector('input[name="password"]').value;
            var role = this.querySelector('select[name="role"]').value;

            // Simulated login/registration logic
            if (form.id === 'login-form') {
                // Perform login logic
                login(username, password, role);
            } else if (form.id === 'register-form') {
                // Perform registration logic
                register(username, password, role);
            }
        });
    });
});

// Simulated login function
function login(username, password, role) {
    // Simulated successful login
    console.log('User logged in:', username, 'Role:', role);
    // Redirect to appropriate page based on role (replace with actual redirection logic)
    redirectToDashboard(role);
}

// Simulated registration function
function register(username, password, role) {
    // Simulated successful registration
    console.log('User registered:', username, 'Role:', role);
    // Automatically log in user after registration (replace with actual login logic)
    login(username, password, role);
}

// Function to redirect user to appropriate dashboard page based on role
function redirectToDashboard(role) {

      
 // Define the URLs for different dashboard pages based on roles (replace with actual URLs)
var dashboardUrls = {
    admin: '../AdminPage/admin_dashboard.html',
    customs_officer: '../CustomsOfficer/customsOfficer_dashboard.html',
    importer: '../Importer/importer_dashboard.html',
    exporter: '../Exporter/exporter_dashboard.html'
};


    // Redirect user to the appropriate dashboard page based on their role
    window.location.href = dashboardUrls[role];
}
