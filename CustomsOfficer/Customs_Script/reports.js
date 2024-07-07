document.addEventListener('DOMContentLoaded', function () {
    const reportList = document.getElementById('reportList');

    // Example data (replace with actual API fetch)
    const reportsData = [
        { id: 1, title: 'Monthly Report', date: '2024-07-15', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { id: 2, title: 'Quarterly Report', date: '2024-06-30', content: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.' },
        // Add more reports as needed
    ];

    // Populate report list
    reportsData.forEach(report => {
        const listItem = document.createElement('li');
        listItem.classList.add('report-item');
        listItem.innerHTML = `
            <h3>${report.title}</h3>
            <p>Date: ${report.date}</p>
            <p>${report.content}</p>
        `;
        reportList.appendChild(listItem);
    });
});
