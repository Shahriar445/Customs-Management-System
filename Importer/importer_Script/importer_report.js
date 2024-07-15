document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Replace with actual user ID
    fetchDeclarations(userId); // Fetch declarations on page load

    const declarationSelect = document.getElementById('declaration-select');
    const reportTypeInput = document.getElementById('report-type');
    const contentTextarea = document.getElementById('content');
    const dateGeneratedInput = document.getElementById('date-generated'); // Assuming you have a date input field

    // Event listener for declaration selection change
    declarationSelect.addEventListener('change', function() {
        const selectedDeclarationId = declarationSelect.value;
        if (!selectedDeclarationId) {
            // Reset form fields if no declaration selected
            resetFormFields();
            return;
        }

        // Fetch declaration details based on selectedDeclarationId
        fetchDeclarationDetails(selectedDeclarationId);
    });

    async function fetchDeclarations(userId) {
        try {
            const response = await fetch(`https://localhost:7232/api/CMS/GetDeclarationsByUserIdImporter/${userId}`);
            const declarations = await response.json();
            populateDeclarations(declarations);
        } catch (error) {
            console.error('Error fetching declarations:', error);
        }
    }

    function populateDeclarations(declarations) {
        declarations.forEach(declaration => {
            const option = document.createElement('option');
            option.value = declaration.declarationId;
            option.textContent = `Declaration ${declaration.declarationId} - ${new Date(declaration.declarationDate).toLocaleDateString()}`;
            declarationSelect.appendChild(option);
        });
    }

    async function fetchDeclarationDetails(declarationId) {
        try {
            const response = await fetch(`https://localhost:7232/api/CMS/GetDeclarationDetails/${declarationId}`);
            const declarationDetails = await response.json();
            
            // Update form fields with declaration details
            reportTypeInput.value = declarationDetails.reportType;
            contentTextarea.value = declarationDetails.content;
            dateGeneratedInput.value = new Date(declarationDetails.dateGenerated).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            
        } catch (error) {
            console.error('Error fetching declaration details:', error);
        }
    }

    function resetFormFields() {
        reportTypeInput.value = '';
        contentTextarea.value = '';
        dateGeneratedInput.value = ''; // Reset date input
    }
});
