
document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners and functions
    updateQuantityLabel();
    document.getElementById('products-category').addEventListener('change', updateQuantityLabel);
    document.getElementById('products-name').addEventListener('change', updateProductPrice);
    document.getElementById('products-quantity').addEventListener('input', updateProductPrice);
});




const categoryLimits = {
    electronics: { maxWeight: 50, unit: 'kg', maxQuantity: 10 },
    clothing: { maxWeight: 20, unit: 'kg', maxQuantity: 50 },
    furniture: { maxWeight: 200, unit: 'kg', maxQuantity: 5 },
    food: { maxWeight: 100, unit: 'kg', maxQuantity: 20 }
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
// Function to validate quantity input before form submission
function validateQuantity() {
    const categorySelect = document.getElementById('products-category');
    const quantityInput = document.getElementById('products-quantity-label');
    const selectedCategory = categorySelect.value;

    if (selectedCategory && categoryLimits[selectedCategory]) {
        const { maxQuantity } = categoryLimits[selectedCategory];
        const quantity = parseInt(quantityInput.value, 10);

        if (quantity > maxQuantity) {
            alert(`Quantity cannot exceed ${maxQuantity} for the selected category.`);
            return false;
        }
    }

    return true;
}


// Function to update the quantity label based on selected category
function updateQuantityLabel() {
    const categorySelect = document.getElementById('products-category');
    const quantityLabel = document.getElementById('products-quantity-label');
    const quantityInput = document.getElementById('products-quantity');

    const selectedCategory = categorySelect.value;

    if (selectedCategory && categoryLimits[selectedCategory]) {
        const { maxQuantity } = categoryLimits[selectedCategory];
        quantityLabel.textContent = `Quantity (max ${maxQuantity}):`;
        quantityInput.setAttribute('max', maxQuantity);
    } else {
        quantityLabel.textContent = 'Quantity:';
        quantityInput.removeAttribute('max');
    }
}

// Event listener for category select change to update quantity label
document.getElementById('products-category').addEventListener('change', updateQuantityLabel);

// Event listener for category select change to update quantity label
document.getElementById('products-category').addEventListener('change', updateQuantityLabel);

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
    const vatInput = document.getElementById('vat');
    const taxInput = document.getElementById('tax');

    const selectedCategory = categorySelect.value;
    const selectedProduct = productSelect.value;
    const quantity = parseInt(quantityInput.value, 10);
    const vat = parseFloat(vatInput.value) || 0;
    const tax = parseFloat(taxInput.value) || 0;

    if (selectedCategory && selectedProduct) {
        const { price } = await fetchProductPrice(selectedCategory, selectedProduct);

        if (price !== null) {
            priceDisplay.value = `$${price.toFixed(2)}`;
            if (quantity) {
                const subtotal = price * quantity;
                const totalVAT = subtotal * (vat / 100);
                const totalTax = subtotal * (tax / 100);
                const totalPrice = subtotal + totalVAT + totalTax;
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



async function populateCountryDropdown() {
    const countryDropdown = document.getElementById('country-origin');

    try {
        const response = await fetch('https://localhost:7232/Getcountries');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const countries = await response.json();

        console.log('Fetched countries:', countries); // Log the data to verify

        // Clear existing options
        countryDropdown.innerHTML = '<option value="" disabled selected>Select country</option>';

        // Populate the dropdown with the fetched data
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country; // Use country name as the value
            option.textContent = country; // Display country name
            countryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
        // Handle errors (e.g., display a message to the user)
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', populateCountryDropdown);

document.addEventListener('DOMContentLoaded', function() {
    const countrySelect = document.getElementById('country-origin');
    const departurePortSelect = document.getElementById('departure-port');
    const destinationPortSelect = document.getElementById('destination-port');
    const vatInput = document.getElementById('vat');
    const taxInput = document.getElementById('tax');
    
    let portData = {}; // Store port data for easy access

    // Function to fetch ports and VAT/tax data based on selected country
    function fetchPorts(country) {
        const url = `https://localhost:7232/country/${country}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Clear previous options
                departurePortSelect.innerHTML = '<option value="" disabled selected>Select port</option>';
                destinationPortSelect.innerHTML = '<option value="" disabled selected>Select port</option>';

                // Store data in portData object
                portData = {};
                data.forEach(item => {
                    portData[item.port] = {
                        vat: item.vat,
                        tax: item.tax
                    };

                    // Create option elements for ports
                    const departureOption = document.createElement('option');
                    departureOption.value = item.port;
                    departureOption.textContent = item.port;
                    departurePortSelect.appendChild(departureOption);

                    const destinationOption = document.createElement('option');
                    destinationOption.value = item.port;
                    destinationOption.textContent = item.port;
                    destinationPortSelect.appendChild(destinationOption);
                });
            })
            .catch(error => console.error('Error fetching ports:', error));
    }

   // Function to update VAT and Tax based on selected port
function updateVatAndTax(port) {
    if (portData[port]) {
        vatInput.value = portData[port].vat;
        taxInput.value = portData[port].tax;
        updateProductPrice(); // Recalculate total price when VAT or tax changes
    } else {
        vatInput.value = '';
        taxInput.value = '';
        updateProductPrice(); // Recalculate total price when VAT or tax is not available
    }
}


    // Event listener for country select change
    countrySelect.addEventListener('change', function() {
        const selectedCountry = countrySelect.value;
        if (selectedCountry) {
            fetchPorts(selectedCountry);
        }
    });

    // Event listener for port of destination select change
    destinationPortSelect.addEventListener('change', function() {
        const selectedPort = destinationPortSelect.value;
        updateVatAndTax(selectedPort);
    });
});




// Event listeners
document.getElementById('products-category').addEventListener('change', updateProductOptions);
document.getElementById('products-name').addEventListener('change', updateProductPrice);
document.getElementById('products-quantity').addEventListener('input', updateProductPrice);

document.getElementById('customs-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (!validateWeight() || !validateQuantity()) {
        return; // Stop form submission if validation fails
    }

    const formData = new FormData(this);
    const totalPriceValue = parseFloat(document.getElementById('total-price').value.replace('$', ''));
    const userId = localStorage.getItem('userId');
  // Ensure userId is retrieved successfully
  if (!userId) {
    console.error('User ID not found.');
    alert('User ID is not available. Please log in again.');
    return;
}
    const data = {
        userId: parseInt(userId), // Convert to integer if needed
        declarationDate: new Date().toISOString(),
        status: "Pending",
        products: [{
            productName: formData.get('products-name'),
            category: formData.get('products-category'),
            quantity: parseInt(formData.get('products-quantity')),
            weight: parseFloat(formData.get('products-weight')),
            countryOfOrigin: formData.get('country-origin'),
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
        const response = await fetch('https://localhost:7232/CreateDeclarationExporter', {
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
