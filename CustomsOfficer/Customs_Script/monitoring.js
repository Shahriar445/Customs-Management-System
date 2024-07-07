document.addEventListener('DOMContentLoaded', function() {
    // Selecting the elements where data will be populated
    const activityList = document.querySelector('.activity-list');
    const logList = document.querySelector('.log-list');
    const alertList = document.querySelector('.alert-list');

    // API endpoints for fetching data
    const activitiesApiUrl = 'https://example.com/api/current-activities';
    const logsApiUrl = 'https://example.com/api/recent-logs';
    const alertsApiUrl = 'https://example.com/api/alerts';

    // Fetch current activities
    fetch(activitiesApiUrl)
        .then(response => response.json())
        .then(data => {
            data.activities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.classList.add('activity-item');
                activityItem.innerHTML = `
                    <h3>${activity.title}</h3>
                    <p>${activity.description}</p>
                `;
                activityList.appendChild(activityItem);
            });
        })
        .catch(error => console.error('Error fetching current activities:', error));

    // Fetch recent logs
    fetch(logsApiUrl)
        .then(response => response.json())
        .then(data => {
            data.logs.forEach(log => {
                const logItem = document.createElement('div');
                logItem.classList.add('log-item');
                logItem.innerHTML = `
                    <h3>${log.title}</h3>
                    <p>${log.description}</p>
                `;
                logList.appendChild(logItem);
            });
        })
        .catch(error => console.error('Error fetching recent logs:', error));

    // Fetch alerts
    fetch(alertsApiUrl)
        .then(response => response.json())
        .then(data => {
            data.alerts.forEach(alert => {
                const alertItem = document.createElement('div');
                alertItem.classList.add('alert-item');
                alertItem.innerHTML = `
                    <h3>${alert.title}</h3>
                    <p>${alert.description}</p>
                `;
                alertList.appendChild(alertItem);
            });
        })
        .catch(error => console.error('Error fetching alerts:', error));
});
