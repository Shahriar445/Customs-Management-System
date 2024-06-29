document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('payment-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form values
        var amount = document.getElementById('payment-amount').value;
        var method = document.getElementById('payment-method').value;
        var reference = document.getElementById('payment-reference').value;

        if (method === 'bkash') {
            // Show bKash payment button
            document.getElementById('bkash-button').style.display = 'block';

            // Add event listener to bKash payment button
            document.getElementById('bkash-button').addEventListener('click', function() {
                // Call bKash payment function
                initiateBkashPayment(amount, reference);
            });
        } else {
            // Handle other payment meth  ods
            console.log('Payment submitted:', amount, method, reference);
            alert('Payment submitted successfully!');
            document.getElementById('payment-form').reset();
        }
    });
});

function initiateBkashPayment(amount, reference) {
    // Assuming you have bKash SDK included and configured properly
    // This function should initiate the bKash payment process
    bKash.init({
        paymentRequest: {
            amount: amount,
            intent: 'sale',
            reference: reference
        },
        onSuccess: function(data) {
            console.log('bKash payment successful:', data);
            alert('Payment successful!');
            document.getElementById('payment-form').reset();
        },
        onError: function(error) {
            console.log('bKash payment failed:', error);
            alert('Payment failed. Please try again.');
        }
    });

    // Trigger bKash payment UI
    bKash.requestPayment();
}
