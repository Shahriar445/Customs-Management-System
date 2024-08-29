document.addEventListener('DOMContentLoaded', async () => {
    const declarationSelect = document.getElementById('declaration-select');
    const payNowButton = document.getElementById('pay-now');
    const errorContainer = document.getElementById('error-container');
    const notification = document.getElementById('notification');
    const declarationsTableBody = document.querySelector('#declaration-table tbody');

    // Retrieve userId from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
        showError('User ID not found in local storage');
        return;
    }

    // Fetch declarations and populate the dropdown
    async function loadDeclarations() {
        try {
            const response = await fetch(`https://localhost:7232/api/CMS/GetDeclarationsByUserIdImporter/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch declarations');
            }
            const declarations = await response.json();

            declarationSelect.innerHTML = '<option value="" disabled selected>Select your declaration</option>';
            declarations.forEach(declaration => {
                const option = document.createElement('option');
                option.value = declaration.declarationId;
                option.textContent = `Declaration ${declaration.declarationId}`;
                declarationSelect.appendChild(option);
            });

            payNowButton.disabled = false;
            populateTable(declarations);
        } catch (error) {
            showError('Error fetching declarations. Please try again later.');
            console.error('Error fetching declarations:', error);
        }
    }

    function populateTable(declarations) {
        declarationsTableBody.innerHTML = ''; // Clear existing rows

        declarations.forEach(declaration => {
            declaration.products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${declaration.declarationId}</td>
                    <td>${product.productName}</td>
                    <td>${product.totalPrice !== null ? product.totalPrice : 'N/A'}</td>
                `;
                declarationsTableBody.appendChild(row);
            });
        });
    }

    async function initiatePayment() {
        const declarationId = declarationSelect.value;
        if (!declarationId) {
            showError('No declaration selected');
            return;
        }

        try {
            const returnUrl = `${window.location.origin}${window.location.pathname}`;
            const payload = {
                declarationId: parseInt(declarationId),
                returnUrl: returnUrl
            };

            const response = await fetch('https://localhost:7232/api/Payment/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to initiate payment: ${response.status} ${response.statusText}. ${errorText}`);
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                showError('Payment URL not received');
                console.error('Payment URL not received:', data);
            }
        } catch (error) {
            showError('Error initiating payment. Please try again later.');
            console.error('Error initiating payment:', error);
        }
    }

    function showError(message) {
        errorContainer.textContent = `Error: ${message}`;
        errorContainer.style.display = 'block';
    }

    function hideError() {
        errorContainer.style.display = 'none';
    }

    async function handleSuccessfulPayment() {
        const urlParams = new URLSearchParams(window.location.search);
        const transactionId = urlParams.get('transactionId');
        const declarationId = urlParams.get('declarationId');

        if (transactionId && declarationId) {
            // Store transaction details in localStorage
            localStorage.setItem('paymentSuccess', 'true');
            localStorage.setItem('transactionId', transactionId);

            // Clear the URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);

            // Redirect after showing the notification
            setTimeout(() => {
                const returnUrl = localStorage.getItem('returnUrl');
                if (returnUrl) {
                    localStorage.removeItem('returnUrl');
                    window.location.href = returnUrl;
                } else {
                    window.location.href = '/'; // Redirect to homepage or a default page
                }
            }, 5000);
        }
    }

    function showPaymentSuccessNotification() {
        const paymentSuccess = localStorage.getItem('paymentSuccess');
        const transactionId = localStorage.getItem('transactionId');

        if (paymentSuccess && transactionId) {
            // Create a popup notification
            alert(`Payment successful! Your transaction ID is ${transactionId}.`);

            // Clear the stored data
            localStorage.removeItem('paymentSuccess');
            localStorage.removeItem('transactionId');
        }
    }

    await loadDeclarations();

    payNowButton.addEventListener('click', () => {
        initiatePayment();
    });

    handleSuccessfulPayment();
    showPaymentSuccessNotification();
});
