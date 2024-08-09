
// Maximum weights and units by category
const categoryLimits = {
    electronics: { maxWeight: 50, unit: 'kg' },
    clothing: { maxWeight: 20, unit: 'kg' },
    furniture: { maxWeight: 200, unit: 'kg' },
    food: { maxWeight: 100, unit: 'kg' }
};

// Function to validate weight input before form submission
function validateWeight() {
    const categorySelect = document.getElementById('products-category');
    const weightInput = document.getElementById('products-weight');
    const selectedCategory = categorySelect.value;

    if (selectedCategory && categoryLimits[selectedCategory]) {
        const { maxWeight } = categoryLimits[selectedCategory];
        const weight = parseFloat(weightInput.value);

        if (weight > maxWeight) {
            alert(`Weight cannot exceed ${maxWeight} kg for the selected category.`);
            return false;
        }
    }

    return true;
}
// Function to fetch products based on category
async function fetchProductsByCategory(category) {
    try {
        const response = await fetch(`https://localhost:7232/api/CMS/GetProductsByCategory?category=${category}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        // Check if the response body is empty
        if (response.status === 204) {
            return [];
        }

        const data = await response.json();

        // Ensure data is an array
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
        }

        return data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        return [];
    }
}

// Function to fetch price for a selected product
async function fetchProductPrice(category, productName) {
    try {
        const response = await fetch(`https://localhost:7232/api/CMS/GetPrice?category=${category}&productName=${productName}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch product price');
        }

        const data = await response.json();

        console.log('Fetched price data:', data); // Log the data for debugging

        // Handle the case where data is a plain number
        if (typeof data === 'number') {
            return { price: data };
        }

        // If data is not a number, handle as a string
        if (typeof data === 'string') {
            const priceNumber = parseFloat(data);
            if (!isNaN(priceNumber)) {
                return { price: priceNumber };
            }
        }

        throw new Error('Invalid price format');
    } catch (error) {
        console.error('Error fetching product price:', error.message);
        return { price: null };
    }
}

// Function to update the product name options based on selected category
async function updateProductOptions() {
    const categorySelect = document.getElementById('products-category');
    const productSelect = document.getElementById('products-name');
    const weightLabel = document.getElementById('products-weight-label');

    const selectedCategory = categorySelect.value;

    if (selectedCategory) {
        const products = await fetchProductsByCategory(selectedCategory);

        // Clear existing options
        productSelect.innerHTML = '<option value="" disabled selected>Select product</option>';

        // Populate product options
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.productName; // Assuming productName is a property
            option.textContent = product.productName;
            productSelect.appendChild(option);
        });

        // Update weight label and validation based on selected category
        if (categoryLimits[selectedCategory]) {
            const { maxWeight, unit } = categoryLimits[selectedCategory];
            weightLabel.textContent = `Weight (Per Piece, max ${maxWeight} ${unit}):`;
            const weightInput = document.getElementById('products-weight');
            weightInput.setAttribute('max', maxWeight);
        }
    } else {
        productSelect.innerHTML = '<option value="" disabled selected>Select category first</option>';
        weightLabel.textContent = 'Weight (Per Piece):'; // Default label
        document.getElementById('products-weight').removeAttribute('max');
    }

    // Clear the price display and total price when category changes
    document.getElementById('product-price').value = '';
    document.getElementById('total-price').value = '';
}

// Function to update the price display based on selected product and calculate total price
async function updateProductPrice() {
    const categorySelect = document.getElementById('products-category');
    const productSelect = document.getElementById('products-name');
    const quantityInput = document.getElementById('products-quantity');
    const priceDisplay = document.getElementById('product-price');
    const totalPriceDisplay = document.getElementById('total-price');

    const selectedCategory = categorySelect.value;
    const selectedProduct = productSelect.value;
    const quantity = parseInt(quantityInput.value, 10);

    if (selectedCategory && selectedProduct) {
        const { price } = await fetchProductPrice(selectedCategory, selectedProduct);

        if (price !== null) {
            priceDisplay.value = `$${price.toFixed(2)}`;
            if (quantity) {
                const totalPrice = price * quantity;
                totalPriceDisplay.value = `$${totalPrice.toFixed(2)}`;
            } else {
                totalPriceDisplay.value = '';
            }
        } else {
            priceDisplay.value = 'Price not available';
            totalPriceDisplay.value = '';
        }
    } else {
        priceDisplay.value = 'Select a product to see the price';
        totalPriceDisplay.value = '';
    }
}

// Event listeners
document.getElementById('products-category').addEventListener('change', updateProductOptions);
document.getElementById('products-name').addEventListener('change', updateProductPrice);
document.getElementById('products-quantity').addEventListener('input', updateProductPrice);

document.getElementById('customs-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!validateWeight()) {
        return; // Stop form submission if validation fails
    }

    const formData = new FormData(this);
    const totalPriceValue = parseFloat(document.getElementById('total-price').value.replace('$', ''));

    const data = {
        userId: 2, // Replace with the actual user ID from your authentication or session
        declarationDate: new Date().toISOString(),
        status: "Pending",
        products: [{
            productName: formData.get('products-name'),
            category: formData.get('products-category'),
            quantity: parseInt(formData.get('products-quantity')),
            weight: parseFloat(formData.get('products-weight')),
            countryOfOrigin: formData.get('country-origin'),
            hsCode: formData.get('hs-code'),
            totalPrice: isNaN(totalPriceValue) ? 0 : totalPriceValue, // Add totalPrice
            declarationId: 0
        }],
        shipments: [{
            methodOfShipment: formData.get('shipment-method'),
            portOfDeparture: formData.get('departure-port'),
            portOfDestination: formData.get('destination-port'),
            departureDate: formData.get('expected-departure'),
            arrivalDate: formData.get('expected-arrival')
        }]
    };

    try {
        const response = await fetch('https://localhost:7232/Create-Declaration-Exporter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage);
        }

        alert('Declaration submitted successfully!');
        this.reset(); // Clear the form inputs
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the declaration.');
    }
});
