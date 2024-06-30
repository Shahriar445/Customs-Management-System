document.addEventListener('DOMContentLoaded', function() {
    const payWithCardButton = document.getElementById('pay-with-card');
    const payWithBkashButton = document.getElementById('pay-with-bkash');
    const cardForm = document.getElementById('card-form');
    const bkashForm = document.getElementById('bkash-form');
    const productSelect = document.getElementById('product-select');
    const totalAmountSpan = document.getElementById('total-amount');

    // Fetch products from backend
    async function fetchProducts() {
        try {
            const response = await fetch('YOUR_BACKEND_API_ENDPOINT');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();
            populateProductDropdown(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Populate product dropdown
    function populateProductDropdown(products) {
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - $${product.amount.toFixed(2)}`;
            productSelect.appendChild(option);
        });
    }

    // Update total amount when product is selected
    productSelect.addEventListener('change', function() {
        const selectedOption = productSelect.selectedOptions[0];
        const selectedProductAmount = selectedOption ? parseFloat(selectedOption.textContent.split('- $')[1]) : 0;
        totalAmountSpan.textContent = selectedProductAmount.toFixed(2);
    });

    payWithCardButton.addEventListener('click', function() {
        cardForm.classList.add('active');
        bkashForm.classList.remove('active');
    });

    payWithBkashButton.addEventListener('click', function() {
        bkashForm.classList.add('active');
        cardForm.classList.remove('active');
    });

    document.getElementById('card-payment-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.productId = productSelect.value;
        data.amount = totalAmountSpan.textContent;

        try {
            const response = await fetch('YOUR_PAYMENT_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert('Payment successful!');
        } catch (error) {
            console.error('Error:', error);
            alert('Payment failed!');
        }
    });

    document.getElementById('bkash-payment-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.productId = productSelect.value;
        data.amount = totalAmountSpan.textContent;

        try {
            const response = await fetch('YOUR_PAYMENT_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            alert('Payment successful!');
        } catch (error) {
            console.error('Error:', error);
            alert('Payment failed!');
        }
    });

    // Fetch products on page load
    fetchProducts();
});
