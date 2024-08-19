document.addEventListener("DOMContentLoaded", function () {
    const pendingShipmentsTable = document.getElementById("pending-shipments-data");
    const runningShipmentsTable = document.getElementById("running-shipments-data");
    const rejectedShipmentsTable = document.getElementById("rejected-shipments-data");
    const completeShipmentsTable = document.getElementById("complete-shipments-data"); // Added for complete shipments

    // Fetch and populate pending shipments
    fetch("https://localhost:7232/api/CMS/PendingShipments")
        .then(response => response.json())
        .then(data => populateTable(data, pendingShipmentsTable, true))
        .catch(error => console.error('Error fetching pending shipments:', error));

    // Fetch and populate running shipments
    fetch("https://localhost:7232/api/CMS/GetRunningShipments")
        .then(response => response.json())
        .then(data => populateTable(data, runningShipmentsTable, false, "Running"))
        .catch(error => console.error('Error fetching running shipments:', error));

    // Fetch and populate rejected shipments
    fetch("https://localhost:7232/api/CMS/GetRejectedShipments")
        .then(response => response.json())
        .then(data => populateTable(data, rejectedShipmentsTable, false, "Rejected"))
        .catch(error => console.error('Error fetching rejected shipments:', error));
    
    // Fetch and populate complete shipments
    fetch("https://localhost:7232/api/CMS/GetCompleteShipments")
        .then(response => response.json())
        .then(data => populateCompleteShipmentsTable(data, completeShipmentsTable))
        .catch(error => console.error('Error fetching complete shipments:', error));

    function populateTable(shipments, tableElement, isPending, status = "") {
        shipments.forEach(shipment => {
            const row = document.createElement("tr");

            // Extracting and defaulting values
            const shipmentId = shipment.shipmentId || "N/A";
            const declarationId = shipment.declarationId || "N/A";
            const methodOfShipment = shipment.methodOfShipment || "N/A";
            const portOfDeparture = shipment.portOfDeparture || "N/A";
            const portOfDestination = shipment.portOfDestination || "N/A";
            const departureDate = shipment.departureDate ? new Date(shipment.departureDate).toLocaleDateString() : "N/A";
            const arrivalDate = shipment.arrivalDate ? new Date(shipment.arrivalDate).toLocaleDateString() : "N/A";
            const paymentStatus = shipment.paymentStatus || "N/A";
            
            // Calculate Running Time
            const runningTime = status === "Running" ? calculateRunningTime(shipment.departureDate) : '';
    
            // Constructing row HTML
            row.innerHTML = `
                <td>${shipmentId}</td>
                <td>${declarationId}</td>
                <td>${methodOfShipment}</td>
                <td>${portOfDeparture}</td>
                <td>${portOfDestination}</td>
                <td>${departureDate}</td>
                <td>${arrivalDate}</td>
                ${isPending ? `<td>
                    <button class="approve-button" data-id="${shipmentId}" ${shipment.paymentStatus !== "Completed" ? "disabled" : ""}>Approve</button>
                    <button class="reject-button" data-id="${shipmentId}">Reject</button>
                </td>` : ''}
                ${status === "Running" ? `<td>${runningTime}</td>` : ''}
            `;
    
            tableElement.appendChild(row);
        });
    
        if (isPending) {
            addEventListeners();
        }
    }

    // Populate the complete shipments table
    function populateCompleteShipmentsTable(shipments, tableElement) {
        shipments.forEach(shipment => {
            const row = document.createElement("tr");

            // Extracting and defaulting values
            const shipmentId = shipment.shipmentId || "N/A";
            const declarationId = shipment.declarationId || "N/A";
            const methodOfShipment = shipment.methodOfShipment || "N/A";
            const portOfDeparture = shipment.portOfDeparture || "N/A";
            const portOfDestination = shipment.portOfDestination || "N/A";
            const departureDate = shipment.departureDate ? new Date(shipment.departureDate).toLocaleDateString() : "N/A";
            const arrivalDate = shipment.arrivalDate ? new Date(shipment.arrivalDate).toLocaleDateString() : "N/A";
            const paymentStatus = shipment.paymentStatus || "N/A";
            const userName = shipment.userName || "N/A";
            const userRole = shipment.userRole || "N/A";

            // Constructing row HTML
            row.innerHTML = `
                <td>${shipmentId}</td>
                <td>${declarationId}</td>
                <td>${methodOfShipment}</td>
                <td>${portOfDeparture}</td>
                <td>${portOfDestination}</td>
                <td>${departureDate}</td>
                <td>${arrivalDate}</td>
                <td>${paymentStatus}</td>
                <td>${userName}</td>
                <td>${userRole}</td>
            `;

            tableElement.appendChild(row);
        });
    }

    function addEventListeners() {
        document.querySelectorAll(".approve-button").forEach(button => {
            button.addEventListener("click", function () {
                const shipmentId = this.getAttribute("data-id");
                approveShipment(shipmentId);
            });
        });

        document.querySelectorAll(".reject-button").forEach(button => {
            button.addEventListener("click", function () {
                const shipmentId = this.getAttribute("data-id");
                rejectShipment(shipmentId);
            });
        });
    }

    function approveShipment(shipmentId) {
        fetch(`https://localhost:7232/api/CMS/ApproveShipment/${shipmentId}`, {
            method: "POST"
        }).then(response => {
            if (response.ok) {
                alert("Shipment approved.");
                location.reload(); // Reload the page to reflect changes
            } else {
                response.text().then(text => alert(text)); // Display the error message returned by the API
            }
        }).catch(error => console.error('Error approving shipment:', error));
    }

    function rejectShipment(shipmentId) {
        fetch(`https://localhost:7232/api/CMS/RejectShipment/${shipmentId}`, {
            method: "POST"
        }).then(response => {
            if (response.ok) {
                alert("Shipment rejected.");
                location.reload(); // Reload the page to reflect changes
            } else {
                alert("Failed to reject shipment.");
            }
        }).catch(error => console.error('Error rejecting shipment:', error));
    }

    function calculateRunningTime(departureDate) {
        const now = new Date();
        const departure = new Date(departureDate);
        const diffTime = Math.abs(now - departure);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return `${diffDays} day(s)`;
    }
});
