// Admin-specific JavaScript for EduDesk System

// Admin dashboard initialization
function initializeAdminDashboard() {
    initializeAdminCharts();
    loadSystemStats();
    startRealTimeUpdates();
}

// Initialize admin charts
function initializeAdminCharts() {
    // System Overview Chart
    const systemOverviewCtx = document.getElementById('systemOverviewChart');
    if (systemOverviewCtx) {
        new Chart(systemOverviewCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Tickets Created',
                    data: [145, 152, 138, 165, 172, 158],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Tickets Resolved',
                    data: [142, 148, 140, 162, 168, 155],
                    borderColor: '#1dd1a1',
                    backgroundColor: 'rgba(29, 209, 161, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Ticket Status Chart
    const ticketStatusCtx = document.getElementById('ticketStatusChart');
    if (ticketStatusCtx) {
        new Chart(ticketStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'In Progress', 'Resolved'],
                datasets: [{
                    data: [25, 35, 120],
                    backgroundColor: [
                        '#feca57',
                        '#48dbfb',
                        '#1dd1a1'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Volume Trends Chart
    const volumeTrendsCtx = document.getElementById('volumeTrendsChart');
    if (volumeTrendsCtx) {
        new Chart(volumeTrendsCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Tickets',
                    data: [45, 52, 38, 65, 72, 28, 15],
                    backgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Category Distribution Chart
    const categoryDistCtx = document.getElementById('categoryDistChart');
    if (categoryDistCtx) {
        new Chart(categoryDistCtx, {
            type: 'pie',
            data: {
                labels: ['Fees', 'Examinations', 'Admissions', 'IT Support', 'Library'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
    
    // Response Time Chart
    const responseTimeCtx = document.getElementById('responseTimeChart');
    if (responseTimeCtx) {
        new Chart(responseTimeCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Avg Response Time (hours)',
                    data: [3.2, 2.8, 2.4, 2.1],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Satisfaction Chart
    const satisfactionCtx = document.getElementById('satisfactionChart');
    if (satisfactionCtx) {
        new Chart(satisfactionCtx, {
            type: 'bar',
            data: {
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Ratings',
                    data: [2, 5, 15, 45, 78],
                    backgroundColor: [
                        '#ff6b6b',
                        '#feca57',
                        '#48dbfb',
                        '#1dd1a1',
                        '#667eea'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Load system statistics
function loadSystemStats() {
    // Simulate loading real-time stats
    updateStatCard('total-tickets', '1,247', '+12%');
    updateStatCard('active-users', '3,456', '+8%');
    updateStatCard('resolution-rate', '94.2%', '+2.1%');
    updateStatCard('avg-response', '2.4h', '-15min');
}

function updateStatCard(type, value, change) {
    const statCard = document.querySelector(`.stat-icon.${type}`);
    if (statCard) {
        const statInfo = statCard.parentElement.querySelector('.stat-info');
        const h3 = statInfo.querySelector('h3');
        const small = statInfo.querySelector('.stat-change');
        
        if (h3) h3.textContent = value;
        if (small) small.textContent = change;
    }
}

// User management functions
function addNewUser() {
    const userData = {
        name: prompt('User name:'),
        email: prompt('Email address:'),
        role: prompt('Role (student/staff/admin):'),
        department: prompt('Department:')
    };
    
    if (userData.name && userData.email && userData.role) {
        console.log('Creating new user:', userData);
        showNotification(`User ${userData.name} created successfully`, 'success');
        addUserToTable(userData);
    }
}

function addUserToTable(userData) {
    const tbody = document.querySelector('.users-table tbody');
    const row = document.createElement('tr');
    row.dataset.role = userData.role;
    
    row.innerHTML = `
        <td>
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <strong>${userData.name}</strong><br>
                    <small>${userData.email}</small>
                </div>
            </div>
        </td>
        <td><span class="role-badge ${userData.role}">${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</span></td>
        <td>${userData.department}</td>
        <td><span class="status-badge active">Active</span></td>
        <td>Just now</td>
        <td>
            <button class="btn-sm btn-secondary" onclick="editUser('${userData.email}')">Edit</button>
            <button class="btn-sm btn-danger" onclick="deactivateUser('${userData.email}')">Deactivate</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

function editUser(userId) {
    console.log(`Editing user: ${userId}`);
    showNotification('User edit functionality would open here', 'info');
}

function deactivateUser(userId) {
    if (confirm('Are you sure you want to deactivate this user?')) {
        console.log(`Deactivating user: ${userId}`);
        showNotification('User deactivated successfully', 'success');
    }
}

function filterUsers(role) {
    const rows = document.querySelectorAll('.users-table tbody tr');
    const filterBtns = document.querySelectorAll('.users-filter .filter-btn');
    
    // Update filter buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter rows
    rows.forEach(row => {
        if (role === 'all' || row.dataset.role === role) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Settings management
function saveSettings() {
    const settings = {
        systemName: document.querySelector('input[value="EduDesk"]').value,
        defaultLanguage: document.querySelector('select').value,
        autoAssign: document.querySelector('input[type="checkbox"]').checked
    };
    
    console.log('Saving settings:', settings);
    showNotification('Settings saved successfully', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        console.log('Resetting settings to default');
        showNotification('Settings reset to default values', 'info');
        
        // Reset form values
        document.querySelector('input[value="EduDesk"]').value = 'EduDesk';
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
    }
}

// Analytics functions
function exportAnalytics() {
    const dateRange = document.querySelector('.date-range').value;
    console.log(`Exporting analytics data for: ${dateRange}`);
    showNotification('Analytics data export started...', 'info');
    
    setTimeout(() => {
        showNotification('Analytics data exported successfully', 'success');
    }, 2000);
}

// Real-time updates
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time data updates
        updateNotificationBadge();
        updateActivityFeed();
    }, 30000); // Update every 30 seconds
}

function updateActivityFeed() {
    const activityFeed = document.querySelector('.activity-feed');
    if (activityFeed && Math.random() > 0.7) {
        const activities = [
            {
                icon: 'user-plus',
                class: 'user-added',
                text: 'New user registered: Jane Smith (Student)',
                time: 'Just now'
            },
            {
                icon: 'check',
                class: 'ticket-resolved',
                text: 'Ticket resolved: #TK1250 by Mike Johnson',
                time: 'Just now'
            },
            {
                icon: 'exclamation-triangle',
                class: 'system-alert',
                text: 'System alert: Server response time increased',
                time: 'Just now'
            }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon ${randomActivity.class}">
                <i class="fas fa-${randomActivity.icon}"></i>
            </div>
            <div class="activity-content">
                <p><strong>${randomActivity.text}</strong></p>
                <span class="activity-time">${randomActivity.time}</span>
            </div>
        `;
        
        activityFeed.insertBefore(activityItem, activityFeed.firstChild);
        
        // Remove old activities (keep only 5)
        const items = activityFeed.querySelectorAll('.activity-item');
        if (items.length > 5) {
            items[items.length - 1].remove();
        }
    }
}

// System monitoring
function checkSystemHealth() {
    const healthMetrics = {
        serverStatus: 'healthy',
        databaseStatus: 'healthy',
        responseTime: '150ms',
        uptime: '99.9%'
    };
    
    console.log('System health check:', healthMetrics);
    return healthMetrics;
}

// Backup and maintenance
function initiateBackup() {
    console.log('Initiating system backup...');
    showNotification('System backup started', 'info');
    
    setTimeout(() => {
        showNotification('System backup completed successfully', 'success');
    }, 5000);
}

function scheduleMaintenance() {
    const maintenanceTime = prompt('Enter maintenance time (YYYY-MM-DD HH:MM):');
    if (maintenanceTime) {
        console.log(`Scheduling maintenance for: ${maintenanceTime}`);
        showNotification(`Maintenance scheduled for ${maintenanceTime}`, 'info');
    }
}

// Override dashboard initialization for admin
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeAdminDashboard();
});

// Add admin-specific CSS
const adminStyles = `
<style>
.stat-icon.total-tickets { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-icon.active-users { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.stat-icon.resolution-rate { background: linear-gradient(135deg, #1dd1a1, #17a085); }
.stat-icon.avg-response { background: linear-gradient(135deg, #feca57, #ff9ff3); }

.stat-change {
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 5px;
    display: block;
}

.stat-change.positive {
    color: #1dd1a1;
}

.stat-change.negative {
    color: #ff6b6b;
}

.admin-dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto;
    gap: 30px;
    margin-bottom: 30px;
}

.dashboard-card.large {
    grid-row: span 2;
}

.chart-container {
    height: 300px;
    margin: 20px 0;
}

.time-filter {
    padding: 8px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    background: white;
}

.status-legend {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
}

.legend-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
}

.legend-color.pending { background: #feca57; }
.legend-color.in-progress { background: #48dbfb; }
.legend-color.resolved { background: #1dd1a1; }

.department-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.department-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
}

.dept-info h4 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 1rem;
}

.dept-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.dept-metrics {
    display: flex;
    flex-direction: column;
    gap: 5px;
    text-align: right;
}

.dept-metrics .metric {
    font-size: 0.8rem;
    color: #667eea;
    font-weight: 600;
}

.activity-feed {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: 300px;
    overflow-y: auto;
}

.activity-icon.user-added { background: #1dd1a1; }
.activity-icon.ticket-resolved { background: #48dbfb; }
.activity-icon.system-alert { background: #feca57; }

.analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
}

.analytics-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.analytics-card h3 {
    margin: 0 0 20px 0;
    color: #333;
    text-align: center;
}

.analytics-controls {
    display: flex;
    gap: 15px;
    align-items: center;
}

.date-range {
    padding: 8px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    background: white;
}

.insights-panel {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.insights-panel h3 {
    margin: 0 0 20px 0;
    color: #333;
}

.insights-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.insight-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
}

.insight-item i {
    font-size: 1.2rem;
}

.text-success { color: #1dd1a1; }
.text-warning { color: #feca57; }

.users-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.users-table {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.users-table table {
    width: 100%;
    border-collapse: collapse;
}

.users-table th,
.users-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #e1e5e9;
}

.users-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.role-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.role-badge.student {
    background: #e3f2fd;
    color: #1976d2;
}

.role-badge.staff {
    background: #f3e5f5;
    color: #7b1fa2;
}

.role-badge.admin {
    background: #fff3e0;
    color: #f57c00;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.active {
    background: #d4edda;
    color: #155724;
}

.status-badge.inactive {
    background: #f8d7da;
    color: #721c24;
}

.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
}

.settings-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.settings-card h3 {
    margin: 0 0 20px 0;
    color: #333;
    border-bottom: 1px solid #e1e5e9;
    padding-bottom: 10px;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.setting-item label {
    color: #333;
    font-weight: 500;
}

.setting-input {
    padding: 8px 12px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    background: white;
    min-width: 150px;
}

.toggle {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #667eea;
}

input:checked + .slider:before {
    transform: translateX(26px);
}

.settings-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}

@media (max-width: 768px) {
    .admin-dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .analytics-grid {
        grid-template-columns: 1fr;
    }
    
    .settings-grid {
        grid-template-columns: 1fr;
    }
    
    .users-table {
        overflow-x: auto;
    }
    
    .analytics-controls {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', adminStyles);

