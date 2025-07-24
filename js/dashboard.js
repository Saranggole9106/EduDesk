// Dashboard JavaScript for EduDesk System

import { supabase } from './config.js';

// Section management
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    const activeNav = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Ticket filtering
function filterTickets(status) {
    const tickets = document.querySelectorAll('.ticket-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update filter buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter tickets
    tickets.forEach(ticket => {
        if (status === 'all' || ticket.dataset.status === status) {
            ticket.style.display = 'block';
        } else {
            ticket.style.display = 'none';
        }
    });
}

// FAQ management
function filterFAQ(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    // Update category buttons
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter FAQ items
    faqItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('i');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        faqItem.classList.remove('active');
    } else {
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.querySelector('.faq-answer').style.display = 'none';
            item.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
            item.classList.remove('active');
        });
        
        // Open clicked FAQ item
        answer.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
        faqItem.classList.add('active');
    }
}

// Ticket form submission
function handleTicketSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const ticketData = {
        category: formData.get('category'),
        priority: formData.get('priority'),
        subject: formData.get('subject'),
        description: formData.get('description'),
        attachment: formData.get('attachment')
    };
    
    // Validate form
    if (!ticketData.category || !ticketData.priority || !ticketData.subject || !ticketData.description) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate ticket ID
        const ticketId = 'TK' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        
        // Reset form
        event.target.reset();
        
        // Show success message
        showNotification(`Ticket ${ticketId} created successfully!`, 'success');
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Redirect to tickets section
        setTimeout(() => {
            showSection('tickets');
        }, 2000);
        
    }, 1500);
}

// Staff ticket management functions
function assignTicket(ticketId, staffId) {
    // Simulate API call to assign ticket
    console.log(`Assigning ticket ${ticketId} to staff ${staffId}`);
    showNotification(`Ticket ${ticketId} assigned successfully`, 'success');
}

function updateTicketStatus(ticketId, status) {
    // Simulate API call to update ticket status
    console.log(`Updating ticket ${ticketId} status to ${status}`);
    
    // Update UI
    const ticketCard = document.querySelector(`[data-ticket-id="${ticketId}"]`);
    if (ticketCard) {
        const statusElement = ticketCard.querySelector('.ticket-status');
        statusElement.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        statusElement.className = `ticket-status ${status}`;
    }
    
    showNotification(`Ticket ${ticketId} status updated to ${status}`, 'success');
}

function respondToTicket(ticketId) {
    const response = prompt('Enter your response:');
    if (response && response.trim()) {
        // Simulate API call to add response
        console.log(`Adding response to ticket ${ticketId}: ${response}`);
        showNotification(`Response added to ticket ${ticketId}`, 'success');
    }
}

// Admin analytics functions
function generateReport(type) {
    console.log(`Generating ${type} report`);
    showNotification(`${type} report is being generated...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification(`${type} report generated successfully`, 'success');
    }, 2000);
}

function exportData(format) {
    console.log(`Exporting data in ${format} format`);
    showNotification(`Data export in ${format} format started...`, 'info');
    
    // Simulate data export
    setTimeout(() => {
        showNotification(`Data exported successfully in ${format} format`, 'success');
    }, 1500);
}

// Chart initialization for admin dashboard
function initializeCharts() {
    // Ticket Status Chart
    const ticketStatusCtx = document.getElementById('ticketStatusChart');
    if (ticketStatusCtx) {
        new Chart(ticketStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'In Progress', 'Resolved', 'Closed'],
                datasets: [{
                    data: [25, 35, 120, 80],
                    backgroundColor: [
                        '#ff6b6b',
                        '#feca57',
                        '#48dbfb',
                        '#1dd1a1'
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
    
    // Monthly Tickets Chart
    const monthlyTicketsCtx = document.getElementById('monthlyTicketsChart');
    if (monthlyTicketsCtx) {
        new Chart(monthlyTicketsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Tickets Created',
                    data: [45, 52, 38, 65, 72, 58],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Tickets Resolved',
                    data: [42, 48, 40, 62, 68, 55],
                    borderColor: '#1dd1a1',
                    backgroundColor: 'rgba(29, 209, 161, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
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
    
    // Category Distribution Chart
    const categoryDistCtx = document.getElementById('categoryDistChart');
    if (categoryDistCtx) {
        new Chart(categoryDistCtx, {
            type: 'bar',
            data: {
                labels: ['Admissions', 'Fees', 'Examinations', 'IT Support', 'Library', 'Other'],
                datasets: [{
                    label: 'Tickets by Category',
                    data: [45, 32, 28, 22, 15, 18],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#43e97b'
                    ]
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
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Search functionality
function searchTickets() {
    const searchInput = document.querySelector('.search-box input');
    const searchTerm = searchInput.value.toLowerCase();
    const tickets = document.querySelectorAll('.ticket-card, .ticket-item');
    
    tickets.forEach(ticket => {
        const ticketText = ticket.textContent.toLowerCase();
        if (ticketText.includes(searchTerm)) {
            ticket.style.display = 'block';
        } else {
            ticket.style.display = 'none';
        }
    });
}

function searchFAQ() {
    const searchInput = document.querySelector('.faq-search input');
    const searchTerm = searchInput.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const faqText = item.textContent.toLowerCase();
        if (faqText.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize real-time subscriptions
function initializeRealtime() {
    // Subscribe to ticket changes
    const ticketSubscription = supabase
        .channel('tickets-channel')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'tickets'
        }, (payload) => {
            console.log('Ticket update received:', payload);
            updateTicketsList(); // Function to refresh tickets list
        })
        .subscribe();

    // Subscribe to ticket responses
    const responseSubscription = supabase
        .channel('responses-channel')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'ticket_responses'
        }, (payload) => {
            console.log('Response update received:', payload);
            updateResponsesList(); // Function to refresh responses
        })
        .subscribe();
}

// Function to update tickets list
async function updateTicketsList() {
    const { data: tickets, error } = await supabase
        .from('tickets')
        .select(`
            *,
            profiles:created_by(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching tickets:', error);
        return;
    }

    // Update UI with new tickets
    displayTickets(tickets);
}

// Function to update responses list
async function updateResponsesList() {
    const { data: responses, error } = await supabase
        .from('ticket_responses')
        .select(`
            *,
            profiles:created_by(first_name, last_name)
        `)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching responses:', error);
        return;
    }

    // Update UI with new responses
    displayResponses(responses);
}

// Initialize dashboard
function initializeDashboard() {
    // Add form event listeners
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleTicketSubmission);
    }
    
    // Add search event listeners
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function() {
            if (this.closest('.faq-search')) {
                searchFAQ();
            } else {
                searchTickets();
            }
        });
    });
    
    // Initialize charts if on admin dashboard
    if (document.getElementById('ticketStatusChart')) {
        initializeCharts();
    }
    
    // Update notification badge
    updateNotificationBadge();
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        // Simulate getting notification count
        const notificationCount = 3; // This would come from an API
        badge.textContent = notificationCount;
        badge.style.display = notificationCount > 0 ? 'flex' : 'none';
    }
}

// Mobile responsiveness
function handleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        // Add mobile menu toggle button
        if (!document.querySelector('.mobile-menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.onclick = () => {
                sidebar.classList.toggle('open');
            };
            
            const topBar = document.querySelector('.top-bar');
            topBar.insertBefore(menuToggle, topBar.firstChild);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    handleMobileMenu();
    initializeRealtime();
    updateTicketsList();
    
    // Handle window resize
    window.addEventListener('resize', handleMobileMenu);
});

// Add CSS for notifications and mobile menu
const additionalStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.notification.success {
    border-left: 4px solid #1dd1a1;
}

.notification.error {
    border-left: 4px solid #ff6b6b;
}

.notification.info {
    border-left: 4px solid #667eea;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.notification-content i {
    font-size: 1.2rem;
}

.notification.success .notification-content i {
    color: #1dd1a1;
}

.notification.error .notification-content i {
    color: #ff6b6b;
}

.notification.info .notification-content i {
    color: #667eea;
}

.notification-close {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 5px;
}

.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    color: #667eea;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 10px;
    margin-right: 15px;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .mobile-menu-toggle {
        display: block;
    }
    
    .top-bar {
        flex-direction: row;
        align-items: center;
    }
    
    .welcome-text {
        flex: 1;
    }
    
    .top-actions {
        flex-direction: row;
        gap: 10px;
    }
    
    .search-box {
        display: none;
    }
}

.content-section {
    display: none;
}

.content-section.active {
    display: block;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.section-header h2 {
    color: #333;
    font-size: 1.8rem;
}

.tickets-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.filter-btn, .category-btn {
    padding: 10px 20px;
    border: 2px solid #e1e5e9;
    background: white;
    color: #666;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.filter-btn.active, .category-btn.active {
    background: #667eea;
    border-color: #667eea;
    color: white;
}

.filter-btn:hover, .category-btn:hover {
    border-color: #667eea;
    color: #667eea;
}

.tickets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

.ticket-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.ticket-card:hover {
    transform: translateY(-5px);
}

.ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.ticket-header h3 {
    color: #333;
    font-size: 1.1rem;
    margin: 0;
    flex: 1;
}

.ticket-status {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.ticket-status.pending {
    background: #fff3cd;
    color: #856404;
}

.ticket-status.in-progress {
    background: #d1ecf1;
    color: #0c5460;
}

.ticket-status.resolved {
    background: #d4edda;
    color: #155724;
}

.ticket-description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 15px;
}

.ticket-meta {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 15px;
    font-size: 0.85rem;
    color: #666;
}

.ticket-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
}

.ticket-actions {
    display: flex;
    gap: 10px;
}

.btn-secondary {
    padding: 8px 16px;
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e1e5e9;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.btn-secondary:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

.btn-success {
    padding: 8px 16px;
    background: #1dd1a1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.btn-success:hover {
    background: #17a085;
}

.create-ticket-form {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
}

.faq-search {
    margin-bottom: 20px;
}

.faq-categories {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.faq-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.faq-item {
    background: white;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.faq-question {
    padding: 20px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.3s ease;
}

.faq-question:hover {
    background: #f8f9fa;
}

.faq-question h3 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
}

.faq-question i {
    color: #667eea;
    transition: transform 0.3s ease;
}

.faq-answer {
    padding: 0 20px 20px;
    color: #666;
    line-height: 1.6;
    display: none;
}

.faq-answer ol, .faq-answer ul {
    margin: 10px 0;
    padding-left: 20px;
}

.faq-answer li {
    margin-bottom: 5px;
}

.profile-content {
    display: flex;
    justify-content: center;
}

.profile-card {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e1e5e9;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
}

.profile-info h3 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 1.5rem;
}

.profile-info p {
    margin: 2px 0;
    color: #666;
    font-size: 0.9rem;
}

.profile-details {
    margin-bottom: 30px;
}

.detail-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f8f9fa;
}

.detail-group:last-child {
    border-bottom: none;
}

.detail-group label {
    font-weight: 600;
    color: #333;
}

.detail-group span {
    color: #666;
}

.profile-actions {
    display: flex;
    gap: 15px;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    background: white;
    border: 2px solid #e1e5e9;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    color: #333;
}

.action-btn:hover {
    border-color: #667eea;
    background: #f8f9ff;
    transform: translateY(-2px);
}

.action-btn i {
    color: #667eea;
    font-size: 1.2rem;
}

.ticket-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.ticket-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
    transition: background 0.3s ease;
}

.ticket-item:hover {
    background: #e9ecef;
}

.ticket-info h4 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 1rem;
}

.ticket-info p {
    margin: 0 0 5px 0;
    color: #666;
    font-size: 0.9rem;
}

.ticket-date {
    font-size: 0.8rem;
    color: #999;
}

.announcements {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.announcement-item {
    display: flex;
    gap: 15px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
}

.announcement-icon {
    width: 40px;
    height: 40px;
    background: #667eea;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
}

.announcement-content h4 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 1.1rem;
}

.announcement-content p {
    margin: 0 0 8px 0;
    color: #666;
    line-height: 1.5;
}

.announcement-date {
    font-size: 0.8rem;
    color: #999;
}

.stat-icon.tickets { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-icon.pending { background: linear-gradient(135deg, #feca57, #ff9ff3); }
.stat-icon.resolved { background: linear-gradient(135deg, #1dd1a1, #17a085); }
.stat-icon.rating { background: linear-gradient(135deg, #ff6b6b, #ee5a52); }
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Export functions for use in other modules
export {
    initializeRealtime,
    updateTicketsList,
    updateResponsesList
};

