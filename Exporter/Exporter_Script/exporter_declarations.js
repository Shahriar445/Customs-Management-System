document.addEventListener('DOMContentLoaded', function() {
    const showExporterFormButton = document.getElementById('showExporterForm');
    const showCustomsOfficerFormButton = document.getElementById('showCustomsOfficerForm');
    const exporterForm = document.getElementById('exporterForm');
    const customsOfficerForm = document.getElementById('customsOfficerForm');

    showExporterFormButton.addEventListener('click', function() {
        exporterForm.style.display = 'block';
        customsOfficerForm.style.display = 'none';
    });

    showCustomsOfficerFormButton.addEventListener('click', function() {
        exporterForm.style.display = 'none';
        customsOfficerForm.style.display = 'block';
    });

    exporterForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        // Collect form data
        const formData = new FormData(exporterForm);
        const formDataObj = Object.fromEntries(formData.entries());

        // Perform form validation if necessary
        if (validateForm(formDataObj)) {
            // Send data to the server via API
            submitDeclaration(formDataObj, 'exporter');
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });

    customsOfficerForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        // Collect form data
        const formData = new FormData(customsOfficerForm);
        const formDataObj = Object.fromEntries(formData.entries());

        // Perform form validation if necessary
        if (validateForm(formDataObj)) {
            // Send data to the server via API
            submitDeclaration(formDataObj, 'customsOfficer');
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });
});

function validateForm(data) {
    // Add your custom validation logic here if needed
    return true;
}

function submitDeclaration(data, role) {
    // Replace
