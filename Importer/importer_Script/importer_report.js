document.addEventListener('DOMContentLoaded', function() {
    const userId = 1; // Replace with actual user ID
    fetchReports(userId); // Fetch reports on page load
    fetchDeclarations();
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
       // fetchDeclarationDetails(selectedDeclarationId);
        populateDeclarations(selectedDeclarationId)
        
    });

    // Event listener for form submission (example)
    const createReportForm = document.getElementById('create-report-form');
    createReportForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        const reportData = {
            reportType: reportTypeInput.value,
            content: contentTextarea.value,
            dateGenerated: dateGeneratedInput.value // Assuming dateGeneratedInput is the correct input field for date
        };

        try {
            await createReport(reportData); // Call createReport function with reportData
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    });

    async function fetchReports(userId) {
        try {
            const response = await fetch(`https://localhost:7232/api/CMS/reportsByRole`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const reports = await response.json();
            populateReports(reports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    }

    function populateReports(reports) {
        const reportDataElement = document.getElementById('report-data');
        reportDataElement.innerHTML = ''; // Clear previous data

        reports.forEach(report => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${report.reportId}</td>
                <td>${report.userId}</td>
                <td>${report.reportType}</td>
                <td>${new Date(report.createAt).toLocaleDateString()}</td>
                <td><button onclick="downloadReport(${report.reportId})">Download</button></td>
            `;
            reportDataElement.appendChild(row);
        });
    }

     // Function to fetch declarations --- for drop down menu when create report  
     async function fetchDeclarations() {
        try {
            const response = await fetch(`https://localhost:7232/api/CMS/GetDeclarationsByUserIdImporter/${userId}`);
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



    async function createReport(reportData) {
        try {
            const response = await fetch('https://localhost:7232/api/CMS/CreateReport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (!response.ok) {
                throw new Error('Error creating report.');
            }

            // Optionally handle success (e.g., show confirmation message)
            console.log('Report created successfully.');

            // Clear form fields after successful submission
            resetFormFields();
            // Optionally, fetch updated reports after creation
            fetchReports(userId);

        } catch (error) {
            console.error('Error creating report:', error);
        }
    }

    function resetFormFields() {
        reportTypeInput.value = '';
        contentTextarea.value = '';
        dateGeneratedInput.value = ''; // Reset date input
    }

    function downloadReport(reportId) {
        // Logic to download report as PDF, if needed
        console.log(`Downloading report ${reportId}...`);
        // Implement PDF download logic using jsPDF or other libraries
    }
});
