document.addEventListener("DOMContentLoaded", function() {
    const stripe = Stripe('your-publishable-key-here'); // Replace with your Stripe publishable key
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    const paymentForm = document.getElementById('payment-form');
    const paymentMethodSelect = document.getElementById('payment-method');
    const bkashButton = document.getElementById('bkash-button');
    const cardElementContainer = document.getElementById('card-element');
    const shipmentSelect = document.getElementById('shipment');
    const paymentAmountInput = document.getElementById('payment-amount');
    const submitButton = document.getElementById('submit-button');

    // Fetch shipments and populate the select element
    fetch('/api/shipments')
        .then(response => response.json())
        .then(data => {
            data.forEach(shipment => {
                const option = document.createElement('option');
                option.value = shipment.id;
                option.text = `Shipment ${shipment.id} - ${shipment.description}`;
                shipmentSelect.appendChild(option);
            });
        });

    // Update amount when a shipment is selected
    shipmentSelect.addEventListener('change', function() {
        const selectedShipment = shipmentSelect.value;
        // Fetch the shipment details to get the amount
        fetch(`/api/shipments/${selectedShipment}`)
            .then(response => response.json())
            .then(data => {
                paymentAmountInput.value = data.amount;
            });
    });

    paymentMethodSelect.addEventListener('change', function(event) {
        const paymentMethod = event.target.value;
        if (paymentMethod === 'credit_card') {
            cardElementContainer.style.display = 'block';
            bkashButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else if (paymentMethod === 'bkash') {
            cardElementContainer.style.display = 'none';
            bkashButton.style.display = 'block';
            submitButton.style.display = 'none';
        } else {
            cardElementContainer.style.display = 'none';
            bkashButton.style.display = 'none';
            submitButton.style.display = 'block';
        }
    });

    paymentForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const shipmentId = shipmentSelect.value;
        const amount = paymentAmountInput.value;
        const paymentMethod = paymentMethodSelect.value;

        if (paymentMethod === 'credit_card') {
            const { paymentIntent, error } = await stripe.createPaymentIntent({
                amount: amount * 100, // Amount in cents
                currency: 'usd',
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Customer Name' // Replace with the customer's name
                    }
                }
            });

            if (error) {
                console.error(error);
            } else {
                console.log('Payment successful!', paymentIntent);
                // Send payment details to the backend
                fetch('/api/shipments/pay', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        shipmentId: shipmentId,
                        amount: amount,
                        paymentMethod: paymentMethod
                    })
                });
            }
        } else if (paymentMethod === 'bkash') {
            // bKash payment handling here
            bkashButton.click();
        }
    });

    bkashButton.addEventListener('click', function() {
        // Initialize bKash payment
        bKash.init({
            paymentRequest: {
                amount: paymentAmountInput.value,
                intent: 'sale'
            },
            onSuccess: function(data) {
                console.log('bKash payment successful!', data);
                // Send payment details to the backend
                fetch('/api/shipments/pay', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        shipmentId: shipmentSelect.value,
                        amount: paymentAmountInput.value,
                        paymentMethod: 'bkash'
                    })
                });
            },
            onError: function(error) {
                console.error('bKash payment error!', error);
            }
        });
    });

    // Mount the Stripe card element
    cardElement.mount('#card-element');
});
