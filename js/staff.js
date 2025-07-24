// Staff-specific JavaScript for EduDesk System

// Staff ticket management functions
function assignTicket(ticketId, staffId) {
    console.log(`Assigning ticket ${ticketId} to ${staffId === 'self' ? 'myself' : staffId}`);
    
    // Update UI
    const ticketRow = document.querySelector(`tr[data-ticket-id="${ticketId}"]`);
    if (ticketRow) {
        const statusCell = ticketRow.querySelector('.status');
        statusCell.textContent = 'In Progress';
        statusCell.className = 'status in-progress';
        
        const actionsCell = ticketRow.querySelector('td:last-child');
        actionsCell.innerHTML = `
            <button class="btn-sm btn-success" onclick="respondToTicket('${ticketId}')">Respond</button>
            <button class="btn-sm btn-secondary" onclick="viewTicket('${ticketId}')">View</button>
        `;
    }
    
    showNotification(`Ticket ${ticketId} assigned successfully`, 'success');
    
    // Update stats
    updateStaffStats();
}

function respondToTicket(ticketId) {
    const response = prompt('Enter your response:');
    if (response && response.trim()) {
        console.log(`Adding response to ticket ${ticketId}: ${response}`);
        showNotification(`Response added to ticket ${ticketId}`, 'success');
        
        // Update ticket status
        updateTicketStatus(ticketId, 'in-progress');
    }
}

function submitResponse(ticketId) {
    const ticketCard = document.querySelector(`[data-ticket-id="${ticketId}"]`);
    const responseText = ticketCard.querySelector('textarea').value;
    const newStatus = ticketCard.querySelector('.status-select').value;
    
    if (!responseText.trim()) {
        showNotification('Please enter a response', 'error');
        return;
    }
    
    // Simulate API call
    console.log(`Submitting response for ticket ${ticketId}:`, responseText);
    console.log(`Updating status to: ${newStatus}`);
    
    // Update UI
    updateTicketStatus(ticketId, newStatus);
    
    // Clear response form
    ticketCard.querySelector('textarea').value = '';
    
    showNotification(`Response submitted for ticket ${ticketId}`, 'success');
    
    // If resolved, move to resolved section
    if (newStatus === 'resolved') {
        setTimeout(() => {
            ticketCard.style.opacity = '0.5';
            ticketCard.querySelector('.ticket-response').style.display = 'none';
        }, 1000);
    }
}

function viewTicket(ticketId) {
    // Open ticket details modal or navigate to detail page
    console.log(`Viewing ticket ${ticketId}`);
    showNotification(`Opening ticket ${ticketId} details`, 'info');
}

function escalateTicket(ticketId) {
    const reason = prompt('Reason for escalation:');
    if (reason && reason.trim()) {
        console.log(`Escalating ticket ${ticketId}: ${reason}`);
        showNotification(`Ticket ${ticketId} escalated to supervisor`, 'info');
        updateTicketStatus(ticketId, 'escalated');
    }
}

// Knowledge base functions
function addKnowledgeArticle() {
    const title = prompt('Article title:');
    if (title && title.trim()) {
        console.log(`Creating new knowledge article: ${title}`);
        showNotification('Knowledge article created successfully', 'success');
        
        // Add to knowledge base list
        addKnowledgeToList(title, 'General', 'New article created by staff member');
    }
}

function addKnowledgeToList(title, category, description) {
    const knowledgeContainer = document.querySelector('.knowledge-articles');
    const articleCard = document.createElement('div');
    articleCard.className = 'knowledge-card';
    articleCard.dataset.category = category.toLowerCase();
    
    articleCard.innerHTML = `
        <div class="knowledge-header">
            <h3>${title}</h3>
            <span class="knowledge-category">${category}</span>
        </div>
        <p>${description}</p>
        <div class="knowledge-meta">
            <span><i class="fas fa-eye"></i> 0 views</span>
            <span><i class="fas fa-thumbs-up"></i> 0 helpful</span>
            <span><i class="fas fa-calendar"></i> Just now</span>
        </div>
        <div class="knowledge-actions">
            <button class="btn-secondary">Edit</button>
            <button class="btn-primary">View</button>
        </div>
    `;
    
    knowledgeContainer.insertBefore(articleCard, knowledgeContainer.firstChild);
}

function filterKnowledge(category) {
    const articles = document.querySelectorAll('.knowledge-card');
    const categoryBtns = document.querySelectorAll('.knowledge-categories .category-btn');
    
    // Update category buttons
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter articles
    articles.forEach(article => {
        if (category === 'all' || article.dataset.category === category) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

// Staff performance tracking
function updateStaffStats() {
    // Simulate updating staff statistics
    const assignedCount = document.querySelector('.stat-info h3');
    if (assignedCount) {
        const currentCount = parseInt(assignedCount.textContent);
        assignedCount.textContent = currentCount + 1;
    }
}

// Report generation
function generateStaffReport(type) {
    console.log(`Generating ${type} staff report`);
    showNotification(`${type} report is being generated...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification(`${type} report generated successfully`, 'success');
        
        // Create download link
        const link = document.createElement('a');
        link.href = '#';
        link.download = `staff-${type}-report.pdf`;
        link.textContent = `Download ${type} Report`;
        link.className = 'download-link';
        
        // Add to page temporarily
        document.body.appendChild(link);
        setTimeout(() => link.remove(), 5000);
    }, 2000);
}

// Initialize staff charts
function initializeStaffCharts() {
    // Resolution Time Chart
    const resolutionTimeCtx = document.getElementById('resolutionTimeChart');
    if (resolutionTimeCtx) {
        new Chart(resolutionTimeCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Avg Resolution Time (hours)',
                    data: [3.2, 2.8, 3.5, 2.1, 2.9, 4.2, 3.8],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Hours'
                        }
                    }
                }
            }
        });
    }
    
    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
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
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Ticket filtering for staff
function filterStaffTickets(status) {
    const tickets = document.querySelectorAll('.tickets-table tbody tr');
    const filterBtns = document.querySelectorAll('.tickets-filter .filter-btn');
    
    // Update filter buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter tickets
    tickets.forEach(ticket => {
        const ticketStatus = ticket.dataset.status;
        const ticketPriority = ticket.dataset.priority;
        
        let shouldShow = false;
        
        switch(status) {
            case 'all':
                shouldShow = true;
                break;
            case 'urgent':
                shouldShow = ticketPriority === 'urgent';
                break;
            default:
                shouldShow = ticketStatus === status;
        }
        
        ticket.style.display = shouldShow ? 'table-row' : 'none';
    });
}

// Auto-refresh functionality
function startAutoRefresh() {
    setInterval(() => {
        // Simulate checking for new tickets
        const notificationBadge = document.querySelector('.notification-badge');
        if (notificationBadge) {
            const currentCount = parseInt(notificationBadge.textContent);
            const newCount = Math.random() > 0.8 ? currentCount + 1 : currentCount;
            
            if (newCount > currentCount) {
                notificationBadge.textContent = newCount;
                showNotification('New ticket assigned to you', 'info');
            }
        }
    }, 30000); // Check every 30 seconds
}

// Initialize staff dashboard
function initializeStaffDashboard() {
    // Initialize charts
    if (document.getElementById('resolutionTimeChart')) {
        initializeStaffCharts();
    }
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + T for new ticket
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            showSection('tickets');
        }
        
        // Ctrl + A for assigned tickets
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            showSection('assigned');
        }
    });
}

// Override the main dashboard initialization for staff
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeStaffDashboard();
});

// Add staff-specific CSS
const staffStyles = `
<style>
.stat-icon.assigned { background: linear-gradient(135deg, #4facfe, #00f2fe); }

.urgent-tickets {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.urgent-ticket-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid transparent;
}

.urgent-ticket-item:has(.ticket-priority.urgent) {
    border-left-color: #ff6b6b;
    background: #fff5f5;
}

.urgent-ticket-item:has(.ticket-priority.high) {
    border-left-color: #feca57;
    background: #fffbf0;
}

.ticket-priority {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.ticket-priority.urgent {
    background: #ff6b6b;
}

.ticket-priority.high {
    background: #feca57;
}

.ticket-priority.medium {
    background: #48dbfb;
}

.ticket-priority.low {
    background: #1dd1a1;
}

.performance-metrics {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.metric-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
}

.metric-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.metric-info h4 {
    margin: 0;
    color: #333;
    font-size: 1.5rem;
}

.metric-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.activity-timeline {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.activity-item {
    display: flex;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
}

.activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    flex-shrink: 0;
}

.activity-icon.resolved {
    background: #1dd1a1;
}

.activity-icon.responded {
    background: #48dbfb;
}

.activity-icon.assigned {
    background: #667eea;
}

.activity-content h4 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 1rem;
}

.activity-content p {
    margin: 0 0 5px 0;
    color: #666;
    font-size: 0.9rem;
}

.activity-time {
    font-size: 0.8rem;
    color: #999;
}

.tickets-table {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tickets-table table {
    width: 100%;
    border-collapse: collapse;
}

.tickets-table th,
.tickets-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #e1e5e9;
}

.tickets-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
}

.tickets-table tr:hover {
    background: #f8f9fa;
}

.priority {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.priority.urgent {
    background: #fee;
    color: #c33;
}

.priority.high {
    background: #fff3cd;
    color: #856404;
}

.priority.medium {
    background: #d1ecf1;
    color: #0c5460;
}

.priority.low {
    background: #d4edda;
    color: #155724;
}

.status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
    border-radius: 6px;
    margin-right: 5px;
}

.assigned-ticket {
    margin-bottom: 30px;
}

.ticket-student {
    margin-bottom: 10px;
    color: #666;
    font-size: 0.9rem;
}

.ticket-response {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e1e5e9;
}

.ticket-response textarea {
    width: 100%;
    padding: 10px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    resize: vertical;
    font-family: inherit;
    margin-bottom: 10px;
}

.ticket-response textarea:focus {
    outline: none;
    border-color: #667eea;
}

.response-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}

.status-select {
    padding: 8px 12px;
    border: 2px solid #e1e5e9;
    border-radius: 6px;
    background: white;
}

.knowledge-articles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

.knowledge-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.knowledge-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.knowledge-header h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
    flex: 1;
}

.knowledge-category {
    padding: 4px 8px;
    background: #667eea;
    color: white;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
}

.knowledge-meta {
    display: flex;
    gap: 15px;
    margin: 15px 0;
    font-size: 0.8rem;
    color: #666;
}

.knowledge-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
}

.knowledge-actions {
    display: flex;
    gap: 10px;
}

.reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-bottom: 30px;
}

.report-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.report-card h3 {
    margin: 0 0 20px 0;
    color: #333;
    text-align: center;
}

.report-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.filter-select {
    padding: 8px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    background: white;
    color: #333;
}

.header-actions {
    display: flex;
    gap: 15px;
    align-items: center;
}

@media (max-width: 768px) {
    .tickets-table {
        overflow-x: auto;
    }
    
    .reports-grid {
        grid-template-columns: 1fr;
    }
    
    .knowledge-articles {
        grid-template-columns: 1fr;
    }
    
    .response-actions {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', staffStyles);

