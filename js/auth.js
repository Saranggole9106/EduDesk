// Authentication JavaScript for EduDesk System

// Import Supabase client
import { supabase } from './config.js'

// Password toggle functionality
function togglePassword(fieldId = 'password') {
    const passwordField = document.getElementById(fieldId);
    const toggleButton = passwordField.parentElement.querySelector('.toggle-password i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleButton.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        toggleButton.className = 'fas fa-eye';
    }
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

function validateForm(formData, isSignup = false) {
    const errors = [];
    
    // Email validation
    if (!validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Password validation
    if (isSignup && !validatePassword(formData.password)) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
    }
    
    // Confirm password validation (signup only)
    if (isSignup && formData.password !== formData.confirmPassword) {
        errors.push('Passwords do not match');
    }
    
    // Required fields validation
    if (isSignup) {
        if (!formData.firstName.trim()) errors.push('First name is required');
        if (!formData.lastName.trim()) errors.push('Last name is required');
        
        const role = getUrlParameter('role') || 'student';
        if (role === 'student' && !formData.studentId.trim()) {
            errors.push('Student ID is required');
        }
        if (role !== 'student' && !formData.department) {
            errors.push('Department is required');
        }
    }
    
    return errors;
}

// Handle signup form submission
async function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const signupData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        studentId: formData.get('studentId'),
        department: formData.get('department'),
        password: formData.get('password'),
        role: getUrlParameter('role') || 'student'
    };
    
    // Validate form
    const errors = validateForm(signupData, true);
    
    if (!signupData.terms) {
        errors.push('You must agree to the Terms of Service and Privacy Policy');
    }
    
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitButton.disabled = true;
    
    try {
        // Sign up with Supabase
        const { user, error } = await supabase.auth.signUp({
            email: signupData.email,
            password: signupData.password,
        });

        if (error) throw error;

        // Add user profile to Supabase
        const { data, error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    user_id: user.id,
                    first_name: signupData.firstName,
                    last_name: signupData.lastName,
                    student_id: signupData.studentId,
                    department: signupData.department,
                    role: signupData.role
                }
            ]);

        if (profileError) throw profileError;

        showSuccess('Account created successfully! Please check your email for verification.');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = `login.html?role=${signupData.role}`;
        }, 2000);
    } catch (error) {
        showErrors([error.message]);
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on',
        role: getUrlParameter('role') || 'student'
    };
    
    // Validate form
    const errors = validateForm(loginData, false);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitButton.disabled = true;
    
    try {
        // Sign in with Supabase
        const { user, error } = await supabase.auth.signInWithPassword({
            email: loginData.email,
            password: loginData.password,
        });

        if (error) throw error;

        // Get user profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (profileError) throw profileError;

        // Verify role matches
        if (profile.role !== loginData.role) {
            throw new Error(`Invalid role. Please login using the correct portal for ${profile.role}s.`);
        }

        // Store session
        localStorage.setItem('userSession', JSON.stringify({
            token: user.access_token,
            user: profile
        }));

        // Redirect to dashboard
        window.location.href = `dashboard-${loginData.role}.html`;
    } catch (error) {
        showErrors([error.message]);
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Check authentication status
async function checkAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error checking auth status:', error.message);
        return null;
    }
    return session;
}

// Initialize authentication page
async function initAuthPage() {
    const session = await checkAuth();
    if (session) {
        // If already logged in, redirect to appropriate dashboard
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
            
        if (profile) {
            window.location.href = `dashboard-${profile.role}.html`;
            return;
        }
    }

    const role = getUrlParameter('role') || localStorage.getItem('selectedRole') || 'student';
    updateRoleContent(role);
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
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
                roleTitle.textContent = roleTitle.textContent.includes('Login') ? 'Admin Login' : 'Admin Registration';
                break;
            case 'staff':
                roleTitle.textContent = roleTitle.textContent.includes('Login') ? 'Staff Login' : 'Staff Registration';
                break;
            default:
                roleTitle.textContent = roleTitle.textContent.includes('Login') ? 'Student Login' : 'Student Registration';
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
            document.getElementById('department').required = false;
        } else {
            studentIdGroup.style.display = 'none';
            departmentGroup.style.display = 'block';
            document.getElementById('studentId').required = false;
            document.getElementById('department').required = true;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuthPage);

// Add CSS for message styling
const messageStyles = `
<style>
.error-messages, .success-messages {
    margin-bottom: 20px;
}

.message {
    padding: 15px;
    border-radius: 10px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
}

.message.error {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
}

.message.success {
    background: #efe;
    border: 1px solid #cfc;
    color: #3c3;
}

.message i {
    font-size: 1.2rem;
    margin-top: 2px;
}

.message div p {
    margin: 0;
    font-size: 0.9rem;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', messageStyles);

// Show error messages
function showErrors(errors) {
    removeExistingMessages();
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-messages';
    errorContainer.innerHTML = `
        <div class="message error">
            <i class="fas fa-exclamation-circle"></i>
            <div>
                ${errors.map(error => `<p>${error}</p>`).join('')}
            </div>
        </div>
    `;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(errorContainer, form.firstChild);
}

// Show success message
function showSuccess(message) {
    removeExistingMessages();
    
    const successContainer = document.createElement('div');
    successContainer.className = 'success-messages';
    successContainer.innerHTML = `
        <div class="message success">
            <i class="fas fa-check-circle"></i>
            <div>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(successContainer, form.firstChild);
}

// Remove existing messages
function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.error-messages, .success-messages');
    existingMessages.forEach(msg => msg.remove());
}

// Get URL parameter function (duplicate from main.js for standalone use)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Logout function
async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error.message);
        return;
    }
    localStorage.removeItem('userSession');
    window.location.href = '../index.html';
}

