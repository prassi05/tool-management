// User credentials database
const users = {
    manager: {
        email: 'manager@company.com',
        password: 'manager123',
        role: 'manager',
        dashboard: 'manager-dashboard.html'
    },
    teamLeader: {
        email: 'leader@company.com',
        password: 'leader123',
        role: 'team-leader',
        dashboard: 'team-leader-dashboard.html'
    },
    teamMember: {
        email: 'member@company.com',
        password: 'member123',
        role: 'team-member',
        dashboard: 'team-member-dashboard.html'
    }
};

// Get elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const roleSelect = document.getElementById('role');
const errorModal = document.getElementById('errorModal');
const successModal = document.getElementById('successModal');
const errorMessage = document.getElementById('errorMessage');

// Handle form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;
    
    // Validate inputs
    if (!email || !password || !role) {
        showErrorModal('Please fill in all fields.');
        return;
    }
    
    // Authenticate user
    let authenticated = false;
    let userFound = null;
    
    for (let key in users) {
        const user = users[key];
        if (user.email === email && user.password === password && user.role === role) {
            authenticated = true;
            userFound = user;
            break;
        }
    }
    
    if (authenticated && userFound) {
        // Store user session
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        // Show success modal
        showSuccessModal();
        
        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = userFound.dashboard;
        }, 2000);
    } else {
        // Determine specific error message
        let errorMsg = 'Invalid credentials or role mismatch. Please try again.';
        
        const userExists = Object.values(users).find(u => u.email === email);
        if (userExists) {
            if (userExists.password !== password) {
                errorMsg = 'Incorrect password. Please check your password and try again.';
            } else if (userExists.role !== role) {
                errorMsg = 'Wrong role selected. Please select the correct role for your account.';
            }
        } else {
            errorMsg = 'Email address not found. Please check your email and try again.';
        }
        
        showErrorModal(errorMsg);
    }
});

// Show error modal
function showErrorModal(message) {
    errorMessage.textContent = message;
    errorModal.classList.add('show');
}

// Show success modal
function showSuccessModal() {
    successModal.classList.add('show');
}

// Close error modal
window.closeErrorModal = function() {
    errorModal.classList.remove('show');
}

// Close modal when clicking overlay
errorModal.addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('modal-overlay')) {
        closeErrorModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && errorModal.classList.contains('show')) {
        closeErrorModal();
    }
});

// Check if user is already logged in
window.addEventListener('load', function() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userRole = sessionStorage.getItem('userRole');
    
    if (isLoggedIn === 'true' && userRole) {
        // Redirect to appropriate dashboard
        const roleMapping = {
            'manager': 'manager-dashboard.html',
            'team-leader': 'team-leader-dashboard.html',
            'team-member': 'team-member-dashboard.html'
        };
        
        if (roleMapping[userRole]) {
            window.location.href = roleMapping[userRole];
        }
    }
});

// Add smooth focus effects
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.01)';
        this.style.transition = 'all 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});

// Clear inputs after error
function clearForm() {
    emailInput.value = '';
    passwordInput.value = '';
    roleSelect.value = '';
}