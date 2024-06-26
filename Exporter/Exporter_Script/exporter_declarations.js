// exporter_declarations.js

document.addEventListener('DOMContentLoaded', function() {
    const declarationForm = document.getElementById('declaration-form');

    declarationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Simulate form submission (replace with actual submission logic)
        const product = document.getElementById('product').value;
        const quantity = document.getElementById('quantity').value;
        const destination = document.getElementById('destination').value;

        console.log('Declaration submitted:', { product, quantity, destination });

        // Clear form fields after submission
        declarationForm.reset();
    });
});
