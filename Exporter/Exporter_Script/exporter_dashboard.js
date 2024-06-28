document.addEventListener('DOMContentLoaded', function() {
    // Sample data to demonstrate the functionality
    var dashboardData = {
        totalDeclarations: 120,
        pendingPayments: 15,
        shipmentsMonitored: 45,
        reportsGenerated: 30
    };

    // Update the dashboard overview with the data
    document.getElementById('total-declarations').textContent = dashboardData.totalDeclarations;
    document.getElementById('pending-payments').textContent = dashboardData.pendingPayments;
    document.getElementById('shipments-monitored').textContent = dashboardData.shipmentsMonitored;
    document.getElementById('reports-generated').textContent = dashboardData.reportsGenerated;
});
