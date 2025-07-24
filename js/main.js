// Main JavaScript for EduDesk System

// Role selection functionality
function selectRole(role) {
    // Store selected role in localStorage
    localStorage.setItem('selectedRole', role);
    
    // Add visual feedback
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => card.style.transform = 'scale(0.95)');
    
    // Navigate to login page after brief animation
    setTimeout(() => {
        window.location.href = `pages/login.html?role=${role}`;
    }, 200);
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Initialize page based on role
function initializePage() {
    const role = getUrlParameter('role') || localStorage.getItem('selectedRole') || 'student';
    
    // Update page content based on role
    updateRoleContent(role);
}

// Update content based on selected role
function updateRoleContent(role) {
    const roleTitle = document.getElementById('roleTitle');
    const signupLink = document.getElementById('signupLink');
    const loginLink = document.getElementById('loginLink');
    const studentIdGroup = document.getElementById('studentIdGroup');
    const departmentGroup = document.getElementById('departmentGroup');
    
    if (roleTitle) {
        switch(role) {
            case 'admin':
                roleTitle.textContent = 'Admin Login';
                break;
            case 'staff':
                roleTitle.textContent = 'Staff Login';
                break;
            default:
                roleTitle.textContent = 'Student Login';
        }
    }
    
    // Update signup/login links with role parameter
    if (signupLink) {
        signupLink.href = `signup.html?role=${role}`;
    }
    
    if (loginLink) {
        loginLink.href = `login.html?role=${role}`;
    }
    
    // Show/hide fields based on role in signup form
    if (studentIdGroup && departmentGroup) {
        if (role === 'student') {
            studentIdGroup.style.display = 'block';
            departmentGroup.style.display = 'none';
            document.getElementById('studentId').required = true;
        } else {
            studentIdGroup.style.display = 'none';
            departmentGroup.style.display = 'block';
            document.getElementById('department').required = true;
        }
    }
}

// Dashboard functionality
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Navigation functionality
function navigateTo(page) {
    const role = localStorage.getItem('selectedRole') || 'student';
    
    switch(page) {
        case 'dashboard':
            window.location.href = `dashboard-${role}.html`;
            break;
        case 'tickets':
            window.location.href = `tickets-${role}.html`;
            break;
        case 'profile':
            window.location.href = `profile.html`;
            break;
        case 'settings':
            window.location.href = `settings.html`;
            break;
        default:
            window.location.href = `${page}.html`;
    }
}

// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('selectedRole');
        localStorage.removeItem('userToken');
        window.location.href = '../index.html';
    }
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (searchInput && searchInput.value.trim()) {
        // Implement search functionality here
        console.log('Searching for:', searchInput.value);
        // This would typically make an API call to search for tickets, users, etc.
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    // Add search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Add mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
});

// Utility functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
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

