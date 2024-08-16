document.addEventListener('DOMContentLoaded', () => {
    const paymentList = document.querySelector('.payment-list');

    // Fetch the payment history
    fetch('https://localhost:7232/payment-history-show')
        .then(response => response.json())
        .then(data => {
            // Populate the payment history section
            data.forEach(payment => {
                const paymentItem = document.createElement('div');
                paymentItem.classList.add('payment-item');
                paymentItem.innerHTML = `
                    <p><strong>Payment ID:</strong> ${payment.paymentId}</p>
                    <p><strong>User ID:</strong> ${payment.userId}</p>
                    <p><strong>Amount:</strong> ${payment.amount.toFixed(2)}</p>
                    <p><strong>Date:</strong> ${new Date(payment.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${payment.status}</p>
                    <p><strong>Declaration ID:</strong> ${payment.declarationId}</p>
                    <p><strong>Product Name:</strong> ${payment.productName}</p>
                `;
                paymentList.appendChild(paymentItem);
            });
        })
        .catch(error => console.error('Error fetching payment history:', error));
});
