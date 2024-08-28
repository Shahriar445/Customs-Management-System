document.addEventListener('DOMContentLoaded', async () => {
    const declarationSelect = document.getElementById('declaration-select');
    const totalAmountSpan = document.getElementById('total-amount');
    const payNowButton = document.getElementById('pay-now');

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

            // Clear any existing options
            declarationSelect.innerHTML = '<option value="" disabled selected>Select your declaration</option>';

            // Populate the dropdown with declarations
            declarations.forEach(declaration => {
                const option = document.createElement('option');
                option.value = declaration.declarationId;
                option.textContent = `Declaration ${declaration.declarationId}`;
                declarationSelect.appendChild(option);
            });

            // Set up the event listener
            declarationSelect.addEventListener('change', () => updatePaymentSummary(declarations));
        } catch (error) {
            showError('Error fetching declarations. Please try again later.');
            console.error('Error fetching declarations:', error);
        }
    }

    // Update payment summary based on selected declaration
    function updatePaymentSummary(declarations) {
        const declarationId = declarationSelect.value;
        if (!declarationId) return;

        // Find the selected declaration
        const selectedDeclaration = declarations.find(declaration => declaration.declarationId == declarationId);

        if (selectedDeclaration) {
            // Calculate total amount based on products
            const totalAmount = selectedDeclaration.products.reduce((sum, product) => {
                return sum + (product.totalPrice || 0);
            }, 0);

            totalAmountSpan.textContent = totalAmount.toFixed(2);
            payNowButton.disabled = false;
        } else {
            totalAmountSpan.textContent = '0.00';
            payNowButton.disabled = true;
        }
    }

    // Initiate payment when "Pay Now" button is clicked
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
    
            console.log('Initiating payment with payload:', payload);
    
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
            console.log('Payment initiation response:', data);
    
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

    // Show error message
    function showError(message) {
        alert(`Error: ${message}`);
    }

    // Load declarations when the page loads
    await loadDeclarations();

    // Event listener for Pay Now button
    payNowButton.addEventListener('click', () => {
        console.log('Pay Now button clicked');
        initiatePayment();
    });

    // Handle successful payment
    function handleSuccessfulPayment() {
        const urlParams = new URLSearchParams(window.location.search);
        const transactionId = urlParams.get('transactionId');
        const declarationId = urlParams.get('declarationId');

        if (transactionId && declarationId) {
            // Show success alert
            alert('Payment successful!');

            // Clear the URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);

            // Redirect to the appropriate page
            const returnUrl = localStorage.getItem('returnUrl');
            if (returnUrl) {
                localStorage.removeItem('returnUrl');
                window.location.href = returnUrl;
            } else {
                // Fallback if no return URL was found
                window.location.href = '/'; // Redirect to homepage or a default page
            }
        }
    }

    // Call handleSuccessfulPayment function if URL contains parameters
    handleSuccessfulPayment();
});
