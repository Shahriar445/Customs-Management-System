document.addEventListener('DOMContentLoaded', function() {
    // Selecting the element where payment history will be populated
    const paymentList = document.querySelector('.payment-list');

    // API endpoint for fetching payment history
    const apiUrl = 'https://example.com/api/payment-history';

    // Fetch payment history from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update payment history list
            data.payments.forEach(payment => {
                const paymentItem = document.createElement('div');
                paymentItem.classList.add('payment-item');
                paymentItem.innerHTML = `
                    <h3>${payment.title}</h3>
                    <p>Date: ${payment.date}</p>
                    <p>Amount: ${payment.amount}</p>
                    <p>Status: ${payment.status}</p>
                `;
                paymentList.appendChild(paymentItem);
            });
        })
        .catch(error => {
            console.error('Error fetching payment history:', error);
        });
});
