// Check authentication
if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('userRole') !== 'manager') {
    window.location.href = 'login.html';
}

// Sample data
let projects = [
    {
        id: 1,
        name: 'Website Redesign',
        description: 'Complete overhaul of company website with modern UI/UX',
        priority: 'high',
        status: 'in-progress',
        deadline: '2026-02-15',
        teamLeader: 'Sarah Johnson',
        progress: 65,
        createdDate: '2026-01-10'
    },
    {
        id: 2,
        name: 'Mobile App Development',
        description: 'Native mobile application for iOS and Android platforms',
        priority: 'high',
        status: 'in-progress',
        deadline: '2026-03-20',
        teamLeader: 'Michael Chen',
        progress: 40,
        createdDate: '2026-01-15'
    },
    {
        id: 3,
        name: 'Database Migration',
        description: 'Migrate legacy database to new cloud infrastructure',
        priority: 'medium',
        status: 'not-started',
        deadline: '2026-02-28',
        teamLeader: 'Emily Davis',
        progress: 0,
        createdDate: '2026-01-20'
    }
];

let teamLeaders = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        projects: 2,
        tasks: 15
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        projects: 1,
        tasks: 8
    },
    {
        id: 3,
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        projects: 1,
        tasks: 6
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupNavigation();
    setupEventListeners();
    updateStats();
    loadRecentProjects();
    loadProjects();
    loadTeamLeaders();
    loadTeamLeaderOptions();
    renderCalendar();
    loadUpcomingDeadlines();
    loadPerformanceData();
    initializeChart();
});

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update page title
        const titles = {
            'overview': 'Dashboard Overview',
            'projects': 'All Projects',
            'team-leaders': 'Team Leaders',
            'reports': 'Reports & Analytics',
            'calendar': 'Project Calendar'
        };
        document.querySelector('.page-title').textContent = titles[section] || 'Dashboard';
    }
}

// Event Listeners
function setupEventListeners() {
    // Project search
    document.getElementById('projectSearch').addEventListener('input', function(e) {
        filterProjects(e.target.value, document.getElementById('projectFilter').value);
    });
    
    // Project filter
    document.getElementById('projectFilter').addEventListener('change', function(e) {
        filterProjects(document.getElementById('projectSearch').value, e.target.value);
    });
    
    // Leader search
    document.getElementById('leaderSearch').addEventListener('input', function(e) {
        filterTeamLeaders(e.target.value);
    });
    
    // Create project form
    document.getElementById('createProjectForm').addEventListener('submit', handleCreateProject);
}

// Load Dashboard
function loadDashboard() {
    const userEmail = sessionStorage.getItem('userEmail');
    document.querySelector('.user-name').textContent = userEmail.split('@')[0];
}

// Update Stats
function updateStats() {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const inProgress = projects.filter(p => p.status === 'in-progress').length;
    
    document.getElementById('totalProjects').textContent = total;
    document.getElementById('completedProjects').textContent = completed;
    document.getElementById('inProgressProjects').textContent = inProgress;
    document.getElementById('totalTeamLeaders').textContent = teamLeaders.length;
}

// Load Recent Projects
function loadRecentProjects() {
    const container = document.getElementById('recentProjectsList');
    const recent = projects.slice(0, 3);
    
    container.innerHTML = recent.map(project => `
        <div class="project-list-item" onclick="viewProject(${project.id})">
            <div class="project-list-info">
                <h4>${project.name}</h4>
                <div class="project-list-meta">
                    <span class="priority-badge priority-${project.priority}">${project.priority}</span>
                    <span>Due: ${formatDate(project.deadline)}</span>
                </div>
            </div>
            <div class="project-status status-${project.status}">
                ${project.status.replace('-', ' ')}
            </div>
        </div>
    `).join('');
}

// Load Projects
function loadProjects() {
    const container = document.getElementById('projectsGrid');
    
    container.innerHTML = projects.map(project => `
        <div class="project-card" onclick="viewProject(${project.id})">
            <div class="project-header">
                <div>
                    <h3 class="project-title">${project.name}</h3>
                </div>
                <span class="project-status status-${project.status}">
                    ${project.status.replace('-', ' ')}
                </span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <div class="meta-item">
                    <i class="fas fa-user-tie"></i>
                    <span>${project.teamLeader}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>Due: ${formatDate(project.deadline)}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-flag"></i>
                    <span class="priority-badge priority-${project.priority}">${project.priority}</span>
                </div>
            </div>
            <div class="project-progress">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${project.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Projects
function filterProjects(search, status) {
    let filtered = projects;
    
    if (search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    if (status && status !== 'all') {
        filtered = filtered.filter(p => p.status === status);
    }
    
    const container = document.getElementById('projectsGrid');
    container.innerHTML = filtered.map(project => `
        <div class="project-card" onclick="viewProject(${project.id})">
            <div class="project-header">
                <div>
                    <h3 class="project-title">${project.name}</h3>
                </div>
                <span class="project-status status-${project.status}">
                    ${project.status.replace('-', ' ')}
                </span>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <div class="meta-item">
                    <i class="fas fa-user-tie"></i>
                    <span>${project.teamLeader}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>Due: ${formatDate(project.deadline)}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-flag"></i>
                    <span class="priority-badge priority-${project.priority}">${project.priority}</span>
                </div>
            </div>
            <div class="project-progress">
                <div class="progress-label">
                    <span>Progress</span>
                    <span>${project.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Team Leaders
function loadTeamLeaders() {
    const container = document.getElementById('teamLeadersGrid');
    
    container.innerHTML = teamLeaders.map(leader => `
        <div class="leader-card">
            <div class="leader-avatar">${leader.name.charAt(0)}</div>
            <h3 class="leader-name">${leader.name}</h3>
            <p class="leader-email">${leader.email}</p>
            <div class="leader-stats">
                <div class="leader-stat">
                    <div class="leader-stat-value">${leader.projects}</div>
                    <div class="leader-stat-label">Projects</div>
                </div>
                <div class="leader-stat">
                    <div class="leader-stat-value">${leader.tasks}</div>
                    <div class="leader-stat-label">Tasks</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Team Leaders
function filterTeamLeaders(search) {
    let filtered = teamLeaders;
    
    if (search) {
        filtered = filtered.filter(leader => 
            leader.name.toLowerCase().includes(search.toLowerCase()) ||
            leader.email.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    const container = document.getElementById('teamLeadersGrid');
    container.innerHTML = filtered.map(leader => `
        <div class="leader-card">
            <div class="leader-avatar">${leader.name.charAt(0)}</div>
            <h3 class="leader-name">${leader.name}</h3>
            <p class="leader-email">${leader.email}</p>
            <div class="leader-stats">
                <div class="leader-stat">
                    <div class="leader-stat-value">${leader.projects}</div>
                    <div class="leader-stat-label">Projects</div>
                </div>
                <div class="leader-stat">
                    <div class="leader-stat-value">${leader.tasks}</div>
                    <div class="leader-stat-label">Tasks</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Team Leader Options
function loadTeamLeaderOptions() {
    const select = document.getElementById('projectTeamLeader');
    select.innerHTML = '<option value="">Select Team Leader</option>' + 
        teamLeaders.map(leader => `<option value="${leader.name}">${leader.name}</option>`).join('');
}

// Create Project Modal
function openCreateProjectModal() {
    document.getElementById('createProjectModal').classList.add('show');
    document.getElementById('createProjectForm').reset();
}

function closeCreateProjectModal() {
    document.getElementById('createProjectModal').classList.remove('show');
}

// Handle Create Project
function handleCreateProject(e) {
    e.preventDefault();
    
    const newProject = {
        id: projects.length + 1,
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        priority: document.getElementById('projectPriority').value,
        deadline: document.getElementById('projectDeadline').value,
        teamLeader: document.getElementById('projectTeamLeader').value,
        status: 'not-started',
        progress: 0,
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    projects.unshift(newProject);
    closeCreateProjectModal();
    loadProjects();
    loadRecentProjects();
    updateStats();
    showToast('Project created successfully!');
}

// View Project
function viewProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('viewProjectModal');
    document.getElementById('viewProjectTitle').textContent = project.name;
    
    const content = document.getElementById('projectDetailsContent');
    content.innerHTML = `
        <div class="detail-section">
            <h3>Project Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">
                        <span class="project-status status-${project.status}">
                            ${project.status.replace('-', ' ')}
                        </span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Priority</span>
                    <span class="detail-value">
                        <span class="priority-badge priority-${project.priority}">${project.priority}</span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Team Leader</span>
                    <span class="detail-value">${project.teamLeader}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Deadline</span>
                    <span class="detail-value">${formatDate(project.deadline)}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${project.description}</p>
        </div>
        
        <div class="detail-section">
            <h3>Progress</h3>
            <div class="project-progress">
                <div class="progress-label">
                    <span>Overall Progress</span>
                    <span>${project.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeViewProjectModal() {
    document.getElementById('viewProjectModal').classList.remove('show');
}

// Calendar
let currentDate = new Date();

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('calendarMonth').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // Day headers
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day header';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });
    
    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        grid.appendChild(emptyDay);
    }
    
    // Days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;
        
        // Check if current day
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add('current');
        }
        
        // Check if has deadline
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasDeadline = projects.some(p => p.deadline === dateStr);
        if (hasDeadline) {
            dayCell.classList.add('has-deadline');
        }
        
        grid.appendChild(dayCell);
    }
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Load Upcoming Deadlines
function loadUpcomingDeadlines() {
    const today = new Date();
    const upcoming = projects
        .filter(p => new Date(p.deadline) >= today)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    const container = document.getElementById('upcomingDeadlines');
    container.innerHTML = upcoming.map(project => `
        <div class="deadline-item">
            <div class="deadline-project">${project.name}</div>
            <div class="deadline-date">
                <i class="fas fa-calendar"></i> ${formatDate(project.deadline)}
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-secondary);">No upcoming deadlines</p>';
}

// Performance Data
function loadPerformanceData() {
    const performanceData = teamLeaders.map(leader => ({
        name: leader.name,
        score: Math.floor(Math.random() * 30) + 70
    }));
    
    const container = document.getElementById('performanceList');
    container.innerHTML = performanceData.map(data => `
        <div class="performance-item">
            <span class="performance-name">${data.name}</span>
            <span class="performance-score">${data.score}%</span>
        </div>
    `).join('');
}

// Chart
let projectChart;

function initializeChart() {
    const ctx = document.getElementById('projectChart');
    if (!ctx) return;
    
    const statusCounts = {
        'Not Started': projects.filter(p => p.status === 'not-started').length,
        'In Progress': projects.filter(p => p.status === 'in-progress').length,
        'Completed': projects.filter(p => p.status === 'completed').length
    };
    
    projectChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#6b7280',
                    '#f59e0b',
                    '#10b981'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}