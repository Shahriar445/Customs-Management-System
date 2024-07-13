document.addEventListener('DOMContentLoaded', function () {
    const userId = 1; // Replace with actual user ID
    const declarationSelect = document.getElementById('declaration-select');
    const totalAmount = document.getElementById('total-amount');
    const cardForm = document.getElementById('card-form');
    const bkashForm = document.getElementById('bkash-form');
    const cardPaymentForm = document.getElementById('card-payment-form');
    const bkashPaymentForm = document.getElementById('bkash-payment-form');

    // Function to fetch declarations
    async function fetchDeclarations() {
        try {
            const response = await fetch(`https://localhost:7232/api/CMS/GetDeclarationsByUserId/${userId}`);
            const declarations = await response.json();
            populateDeclarations(declarations);
        } catch (error) {
            console.error('Error fetching declarations:', error);
        }
    }

    // Function to populate declarations dropdown
    function populateDeclarations(declarations) {
        declarations.forEach(declaration => {
            const option = document.createElement('option');
            option.value = declaration.declarationId;
            option.textContent = `Declaration ${declaration.declarationId} - ${new Date(declaration.declarationDate).toLocaleDateString()}`;
            declarationSelect.appendChild(option);
        });
    }

    // Function to handle card payment
    cardPaymentForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const declarationId = declarationSelect.value;
        const amount = parseFloat(totalAmount.textContent);
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvc = document.getElementById('card-cvc').value;

        // Validate and process payment details here...

        try {
            await submitPayment(userId, declarationId, null, amount, 'Card', cardNumber, cardExpiry, cardCvc);
            alert('Payment successful');
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    });

    // Function to handle bKash payment
    bkashPaymentForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const declarationId = declarationSelect.value;
        const amount = parseFloat(totalAmount.textContent);
        const bkashNumber = document.getElementById('bkash-number').value;

        // Validate and process payment details here...

        try {
            await submitPayment(userId, declarationId, null, amount, 'bKash', bkashNumber);
            alert('Payment successful');
        } catch (error) {
            console.error('Error submitting payment:', error);
        }
    });

    // Function to submit payment
    async function submitPayment(userId, declarationId, productId, amount, paymentMethod, ...paymentDetails) {
        const paymentData = {
            userId,
            declarationId,
            productId,
            amount,
            paymentMethod,
            paymentDetails
        };

        const response = await fetch('https://localhost:7232/api/CMS/SubmitPayment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (!response.ok) {
            throw new Error('Payment submission failed');
        }
    }

    // Fetch declarations on page load
    fetchDeclarations();
});
