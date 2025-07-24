// Enhanced Dashboard JavaScript with Interactive Features

// Global variables
let currentUser = null;
let currentRole = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadUserData();
});

// Initialize dashboard based on role
function initializeDashboard() {
    currentRole = getCurrentRole();
    currentUser = getCurrentUser();
    
    if (currentRole) {
        updateDashboardForRole(currentRole);
        loadRoleSpecificData(currentRole);
    }
}

// Get current role from URL or localStorage
function getCurrentRole() {
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get('role');
    const roleFromStorage = localStorage.getItem('userRole');
    
    return roleFromUrl || roleFromStorage || 'student';
}

// Get current user from localStorage
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Setup event listeners
function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Notification button
    const notificationBtn = document.querySelector('.icon-btn .fa-bell');
    if (notificationBtn) {
        notificationBtn.parentElement.addEventListener('click', toggleNotifications);
    }
    
    // Profile button
    const profileBtn = document.querySelector('.icon-btn .fa-user');
    if (profileBtn) {
        profileBtn.parentElement.addEventListener('click', toggleProfileMenu);
    }
    
    // Quick action buttons
    document.querySelectorAll('[onclick]').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('showSection')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionName = onclickAttr.match(/showSection\('([^']+)'\)/)[1];
                showSection(sectionName);
            });
        }
    });
    
    // Responsive sidebar toggle
    setupResponsiveSidebar();
}

// Handle navigation clicks
function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    e.currentTarget.classList.add('active');
    
    // Get section name from onclick attribute or href
    const onclickAttr = e.currentTarget.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('showSection')) {
        const sectionName = onclickAttr.match(/showSection\('([^']+)'\)/)[1];
        showSection(sectionName);
    }
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
    } else {
        // If section doesn't exist, show dashboard
        const dashboardSection = document.getElementById('dashboard-section');
        if (dashboardSection) {
            dashboardSection.style.display = 'block';
            dashboardSection.classList.add('active');
        }
    }
    
    // Update page title
    updatePageTitle(sectionName);
    
    // Load section-specific data
    loadSectionData(sectionName);
}

// Handle search functionality
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const currentSection = document.querySelector('.content-section.active');
    
    if (currentSection) {
        const searchableItems = currentSection.querySelectorAll('.ticket-item, .activity-item, .announcement-item');
        
        searchableItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query) || query === '') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Toggle notifications panel
function toggleNotifications() {
    // Create or toggle notifications panel
    let notificationPanel = document.getElementById('notification-panel');
    
    if (!notificationPanel) {
        notificationPanel = createNotificationPanel();
        document.body.appendChild(notificationPanel);
    }
    
    notificationPanel.style.display = notificationPanel.style.display === 'none' ? 'block' : 'none';
}

// Create notification panel
function createNotificationPanel() {
    const panel = document.createElement('div');
    panel.id = 'notification-panel';
    panel.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        width: 300px;
        max-height: 400px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        overflow-y: auto;
        display: none;
    `;
    
    const notifications = getNotifications();
    panel.innerHTML = `
        <div style="padding: 20px; border-bottom: 1px solid #f0f0f0;">
            <h3 style="margin: 0; font-size: 16px; color: #333;">Notifications</h3>
        </div>
        <div style="padding: 10px;">
            ${notifications.map(notif => `
                <div style="padding: 10px; border-bottom: 1px solid #f8f9fa; cursor: pointer;" onclick="markAsRead('${notif.id}')">
                    <div style="font-size: 14px; font-weight: 600; color: #333; margin-bottom: 5px;">${notif.title}</div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 5px;">${notif.message}</div>
                    <div style="font-size: 12px; color: #999;">${notif.time}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    return panel;
}

// Get notifications based on role
function getNotifications() {
    const baseNotifications = [
        {
            id: 'n1',
            title: 'System Update',
            message: 'System maintenance scheduled for tonight',
            time: '2 hours ago'
        }
    ];
    
    if (currentRole === 'student') {
        return [
            ...baseNotifications,
            {
                id: 'n2',
                title: 'Ticket Update',
                message: 'Your ticket #TK001 has been resolved',
                time: '1 hour ago'
            },
            {
                id: 'n3',
                title: 'New Announcement',
                message: 'Exam schedule has been released',
                time: '3 hours ago'
            }
        ];
    } else if (currentRole === 'staff') {
        return [
            ...baseNotifications,
            {
                id: 'n2',
                title: 'New Ticket Assigned',
                message: 'Ticket #TK045 has been assigned to you',
                time: '30 minutes ago'
            },
            {
                id: 'n3',
                title: 'Urgent Ticket',
                message: 'High priority ticket requires attention',
                time: '1 hour ago'
            }
        ];
    } else if (currentRole === 'admin') {
        return [
            ...baseNotifications,
            {
                id: 'n2',
                title: 'System Alert',
                message: 'High ticket volume detected',
                time: '45 minutes ago'
            },
            {
                id: 'n3',
                title: 'New User Registration',
                message: '5 new users registered today',
                time: '2 hours ago'
            }
        ];
    }
    
    return baseNotifications;
}

// Toggle profile menu
function toggleProfileMenu() {
    let profileMenu = document.getElementById('profile-menu');
    
    if (!profileMenu) {
        profileMenu = createProfileMenu();
        document.body.appendChild(profileMenu);
    }
    
    profileMenu.style.display = profileMenu.style.display === 'none' ? 'block' : 'none';
}

// Create profile menu
function createProfileMenu() {
    const menu = document.createElement('div');
    menu.id = 'profile-menu';
    menu.style.cssText = `
        position: fixed;
        top: 70px;
        right: 20px;
        width: 200px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
    `;
    
    menu.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid #f0f0f0;">
            <div style="font-weight: 600; color: #333;">${currentUser?.name || 'User'}</div>
            <div style="font-size: 12px; color: #666;">${currentUser?.email || 'user@example.com'}</div>
        </div>
        <div style="padding: 10px;">
            <a href="#" onclick="showSection('profile')" style="display: block; padding: 8px 10px; color: #333; text-decoration: none; border-radius: 4px;">
                <i class="fas fa-user" style="margin-right: 8px;"></i>Profile
            </a>
            <a href="#" onclick="showSection('settings')" style="display: block; padding: 8px 10px; color: #333; text-decoration: none; border-radius: 4px;">
                <i class="fas fa-cog" style="margin-right: 8px;"></i>Settings
            </a>
            <a href="#" onclick="logout()" style="display: block; padding: 8px 10px; color: #FF6B6B; text-decoration: none; border-radius: 4px;">
                <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>Logout
            </a>
        </div>
    `;
    
    return menu;
}

// Setup responsive sidebar
function setupResponsiveSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Create mobile menu button
    if (window.innerWidth <= 768) {
        const menuButton = document.createElement('button');
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        menuButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #4A3B7A;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
            display: none;
        `;
        
        menuButton.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
        
        document.body.appendChild(menuButton);
        
        // Show menu button on mobile
        if (window.innerWidth <= 768) {
            menuButton.style.display = 'block';
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const menuButton = document.querySelector('button[style*="fas fa-bars"]');
        
        if (window.innerWidth <= 768) {
            if (menuButton) menuButton.style.display = 'block';
        } else {
            if (menuButton) menuButton.style.display = 'none';
            sidebar.classList.remove('open');
        }
    });
}

// Load user data
function loadUserData() {
    // Simulate loading user data
    if (!currentUser) {
        currentUser = {
            name: currentRole === 'admin' ? 'Admin User' : 
                  currentRole === 'staff' ? 'Staff Member' : 'Student User',
            email: `${currentRole}@edudesk.com`,
            role: currentRole
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Update dashboard for specific role
function updateDashboardForRole(role) {
    const welcomeText = document.querySelector('.welcome-section h1');
    if (welcomeText) {
        switch(role) {
            case 'admin':
                welcomeText.textContent = 'Admin Dashboard';
                break;
            case 'staff':
                welcomeText.textContent = 'Welcome to Staff Portal';
                break;
            default:
                welcomeText.textContent = 'Welcome to EduDesk';
        }
    }
}

// Load role-specific data
function loadRoleSpecificData(role) {
    // Simulate loading role-specific data
    setTimeout(() => {
        updateStatistics(role);
        updateRecentActivity(role);
    }, 500);
}

// Update statistics based on role
function updateStatistics(role) {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Add animation to stat numbers
    statCards.forEach(card => {
        const numberElement = card.querySelector('h3');
        if (numberElement) {
            animateNumber(numberElement);
        }
    });
}

// Animate numbers
function animateNumber(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    let currentValue = 0;
    const increment = Math.ceil(numericValue / 50);
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        element.textContent = finalValue.replace(numericValue.toString(), currentValue.toString());
    }, 30);
}

// Update recent activity
function updateRecentActivity(role) {
    // Add real-time updates simulation
    setInterval(() => {
        addNewActivity(role);
    }, 30000); // Add new activity every 30 seconds
}

// Add new activity item
function addNewActivity(role) {
    const activitiesContainer = document.querySelector('.activities-container');
    if (!activitiesContainer) return;
    
    const activities = getRandomActivity(role);
    const activityElement = document.createElement('div');
    activityElement.className = 'activity-item';
    activityElement.style.opacity = '0';
    activityElement.innerHTML = `
        <div style="display: flex; gap: 12px;">
            <div style="width: 8px; height: 8px; background: ${activities.color}; border-radius: 50%; margin-top: 6px; flex-shrink: 0;"></div>
            <div>
                <div class="activity-description">${activities.description}</div>
                <div class="activity-date">Just now</div>
            </div>
        </div>
    `;
    
    activitiesContainer.insertBefore(activityElement, activitiesContainer.firstChild);
    
    // Animate in
    setTimeout(() => {
        activityElement.style.transition = 'opacity 0.3s ease';
        activityElement.style.opacity = '1';
    }, 100);
    
    // Remove oldest activity if too many
    const activities_items = activitiesContainer.querySelectorAll('.activity-item');
    if (activities_items.length > 5) {
        activitiesContainer.removeChild(activities_items[activities_items.length - 1]);
    }
}

// Get random activity based on role
function getRandomActivity(role) {
    const activities = {
        student: [
            { description: 'New ticket submitted', color: '#4FACFE' },
            { description: 'Ticket status updated', color: '#FFA726' },
            { description: 'FAQ article viewed', color: '#4CAF50' }
        ],
        staff: [
            { description: 'Ticket resolved successfully', color: '#4CAF50' },
            { description: 'New ticket assigned', color: '#4FACFE' },
            { description: 'Response sent to student', color: '#FFA726' }
        ],
        admin: [
            { description: 'New user registered', color: '#4CAF50' },
            { description: 'System backup completed', color: '#4FACFE' },
            { description: 'Performance report generated', color: '#FFA726' }
        ]
    };
    
    const roleActivities = activities[role] || activities.student;
    return roleActivities[Math.floor(Math.random() * roleActivities.length)];
}

// Load section-specific data
function loadSectionData(sectionName) {
    // Simulate loading data for specific sections
    console.log(`Loading data for section: ${sectionName}`);
}

// Update page title
function updatePageTitle(sectionName) {
    const titles = {
        dashboard: 'Dashboard',
        tickets: 'My Tickets',
        'create-ticket': 'Create Ticket',
        'all-tickets': 'All Tickets',
        'assigned-tickets': 'Assigned Tickets',
        analytics: 'Analytics',
        'user-management': 'User Management',
        departments: 'Departments',
        'system-settings': 'System Settings',
        reports: 'Reports',
        profile: 'Profile',
        faq: 'FAQ',
        'knowledge-base': 'Knowledge Base'
    };
    
    document.title = `${titles[sectionName] || 'Dashboard'} - EduDesk`;
}

// Mark notification as read
function markAsRead(notificationId) {
    console.log(`Marking notification ${notificationId} as read`);
    // Update notification count
    const notificationBadge = document.querySelector('.icon-btn .fa-bell + span');
    if (notificationBadge) {
        let count = parseInt(notificationBadge.textContent);
        if (count > 0) {
            count--;
            notificationBadge.textContent = count;
            if (count === 0) {
                notificationBadge.style.display = 'none';
            }
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = '../index.html';
}

// Close panels when clicking outside
document.addEventListener('click', function(e) {
    const notificationPanel = document.getElementById('notification-panel');
    const profileMenu = document.getElementById('profile-menu');
    
    if (notificationPanel && !e.target.closest('.icon-btn') && !e.target.closest('#notification-panel')) {
        notificationPanel.style.display = 'none';
    }
    
    if (profileMenu && !e.target.closest('.icon-btn') && !e.target.closest('#profile-menu')) {
        profileMenu.style.display = 'none';
    }
});

// Export functions for global access
window.showSection = showSection;
window.logout = logout;
window.markAsRead = markAsRead;




// Handle ticket form submission
document.addEventListener("DOMContentLoaded", function() {
    const ticketForm = document.getElementById("ticketForm");
    if (ticketForm) {
        ticketForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            const subject = document.getElementById("ticketSubject").value;
            const category = document.getElementById("ticketCategory").value;
            const description = document.getElementById("ticketDescription").value;
            const attachment = document.getElementById("ticketAttachment").files[0];
            
            // Simulate ticket submission
            console.log("Submitting ticket:", { subject, category, description, attachment });
            
            // Display success message
            alert("Ticket submitted successfully!");
            
            // Clear form
            ticketForm.reset();
            
            // Optionally, navigate to My Tickets section
            showSection("tickets");
        });
    }
});





// Function to load and display My Tickets
function loadMyTickets() {
    const myTicketsList = document.getElementById("my-tickets-list");
    if (!myTicketsList) return;

    // Clear existing tickets
    myTicketsList.innerHTML = "";

    // Simulate fetching tickets (replace with actual API call)
    const tickets = [
        { id: "TK001", subject: "Fee Payment Issue", category: "Financial", status: "PENDING", description: "Unable to process online fee payment for this semester.", date: "2025-07-20T10:00:00Z" },
        { id: "TK002", subject: "Exam Hall Ticket", category: "Academic", status: "IN PROGRESS", description: "Cannot download hall ticket for upcoming examination.", date: "2025-07-19T14:30:00Z" },
        { id: "TK003", subject: "Document Verification", category: "Other", status: "RESOLVED", description: "Need help with document submission process.", date: "2025-07-17T09:15:00Z" }
    ];

    if (tickets.length === 0) {
        myTicketsList.innerHTML = "<p>No tickets found.</p>";
        return;
    }

    tickets.forEach(ticket => {
        const ticketItem = document.createElement("div");
        ticketItem.className = "ticket-item";
        ticketItem.innerHTML = `
            <div class="ticket-header">
                <h3>#${ticket.id} - ${ticket.subject}</h3>
                <span class="ticket-status ${ticket.status.toLowerCase().replace(' ', '-')}">${ticket.status}</span>
            </div>
            <p class="ticket-description">${ticket.description}</p>
            <div class="ticket-meta">
                <span>Category: ${ticket.category}</span>
                <span>Date: ${formatDate(ticket.date)}</span>
            </div>
        `;
        myTicketsList.appendChild(ticketItem);
    });
}

// Call loadMyTickets when the 'tickets' section is shown
const originalLoadSectionData = window.loadSectionData;
window.loadSectionData = function(sectionName) {
    originalLoadSectionData(sectionName);
    if (sectionName === 'tickets') {
        loadMyTickets();
    }
};

// Add CSS for ticket items
const style = document.createElement('style');
style.innerHTML = `
.ticket-item {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

.ticket-item .ticket-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.ticket-item .ticket-header h3 {
    font-size: 16px;
    color: #333;
    margin: 0;
}

.ticket-item .ticket-status {
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    color: white;
}

.ticket-item .ticket-status.pending {
    background-color: #FFA726;
}

.ticket-item .ticket-status.in-progress {
    background-color: #4FACFE;
}

.ticket-item .ticket-status.resolved {
    background-color: #4CAF50;
}

.ticket-item .ticket-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
}

.ticket-item .ticket-meta {
    font-size: 12px;
    color: #999;
    display: flex;
    justify-content: space-between;
}
`;
document.head.appendChild(style);


