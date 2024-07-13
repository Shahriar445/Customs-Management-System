document.addEventListener('DOMContentLoaded', function() {
    fetchDeclarations();
    document.getElementById('create-report-form').addEventListener('submit', createReport);
    document.getElementById('download-report').addEventListener('click', downloadReportAsPDF);
});

async function fetchDeclarations() {
    try {
        const response = await fetch('https://localhost:7232/api/CMS/GetDeclarations'); // Adjust the endpoint as necessary
        const declarations = await response.json();

        const declarationSelect = document.getElementById('declaration-id');
        declarations.forEach(declaration => {
            const option = document.createElement('option');
            option.value = declaration.declarationId;
            option.textContent = `Declaration ID: ${declaration.declarationId} - ${declaration.declarationDate}`;
            declarationSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching declarations:', error);
    }
}

async function createReport(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
        declarationId: formData.get('declaration-id'),
        reportType: formData.get('report-type'),
        content: formData.get('content'),
        dateGenerated: new Date().toISOString()
    };

    try {
        const response = await fetch('https://localhost:7232/CreateReport', {
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

        alert('Report created successfully!');
        this.reset(); // Clear the form inputs
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the report.');
    }
}

function downloadReportAsPDF() {
    const reportType = document.getElementById('report-type').value;
    const content = document.getElementById('content').value;
    const dateGenerated = new Date().toLocaleDateString();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Report Type: ${reportType}`, 10, 10);
    doc.text(`Date Generated: ${dateGenerated}`, 10, 20);
    doc.text('Content:', 10, 30);
    doc.text(content, 10, 40);

    doc.save('report.pdf');
}
