// Check authentication
if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('userRole') !== 'team-leader') {
    window.location.href = 'login.html';
}

// Sample data
let myProjects = [
    {
        id: 1,
        name: 'Website Redesign',
        description: 'Complete overhaul of company website with modern UI/UX',
        status: 'in-progress',
        deadline: '2026-02-15',
        progress: 65
    },
    {
        id: 2,
        name: 'Mobile App Development',
        description: 'Native mobile application for iOS and Android platforms',
        status: 'in-progress',
        deadline: '2026-03-20',
        progress: 40
    }
];

let tasks = [
    {
        id: 1,
        projectId: 1,
        projectName: 'Website Redesign',
        title: 'Design Homepage Mockup',
        description: 'Create wireframes and mockups for the new homepage design',
        assignedTo: 'John Smith',
        priority: 'high',
        status: 'in-progress',
        deadline: '2026-02-05',
        createdDate: '2026-01-25'
    },
    {
        id: 2,
        projectId: 1,
        projectName: 'Website Redesign',
        title: 'Implement Navigation Menu',
        description: 'Code responsive navigation menu with dropdown functionality',
        assignedTo: 'Jane Doe',
        priority: 'medium',
        status: 'pending',
        deadline: '2026-02-08',
        createdDate: '2026-01-26'
    },
    {
        id: 3,
        projectId: 2,
        projectName: 'Mobile App Development',
        title: 'Create Login Screen',
        description: 'Design and implement user authentication screen',
        assignedTo: 'Bob Wilson',
        priority: 'high',
        status: 'pending',
        deadline: '2026-02-10',
        createdDate: '2026-01-27'
    }
];

let teamMembers = [
    {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@company.com',
        tasks: 5,
        completed: 3
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane.doe@company.com',
        tasks: 4,
        completed: 2
    },
    {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob.wilson@company.com',
        tasks: 3,
        completed: 1
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupNavigation();
    setupEventListeners();
    updateStats();
    loadActiveProjects();
    loadPendingTasks();
    loadProjects();
    loadTasks();
    loadTeamMembers();
    loadProjectOptions();
    loadTeamMemberOptions();
    loadTeamPerformance();
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
            'my-projects': 'My Projects',
            'tasks': 'All Tasks',
            'team': 'Team Members',
            'reports': 'Reports & Analytics'
        };
        document.querySelector('.page-title').textContent = titles[section] || 'Dashboard';
    }
}

// Event Listeners
function setupEventListeners() {
    // Task search
    document.getElementById('taskSearch').addEventListener('input', function(e) {
        filterTasks(e.target.value, document.getElementById('taskFilter').value);
    });
    
    // Task filter
    document.getElementById('taskFilter').addEventListener('change', function(e) {
        filterTasks(document.getElementById('taskSearch').value, e.target.value);
    });
    
    // Create task form
    document.getElementById('createTaskForm').addEventListener('submit', handleCreateTask);
}

// Load Dashboard
function loadDashboard() {
    const userEmail = sessionStorage.getItem('userEmail');
    document.querySelector('.user-name').textContent = userEmail.split('@')[0];
}

// Update Stats
function updateStats() {
    const totalTasksCount = tasks.length;
    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
    
    document.getElementById('myProjects').textContent = myProjects.length;
    document.getElementById('totalTasks').textContent = totalTasksCount;
    document.getElementById('completedTasks').textContent = completedTasksCount;
    document.getElementById('teamSize').textContent = teamMembers.length;
}

// Load Active Projects
function loadActiveProjects() {
    const container = document.getElementById('activeProjectsList');
    const active = myProjects.filter(p => p.status !== 'completed');
    
    container.innerHTML = active.map(project => `
        <div class="project-list-item">
            <div class="project-list-info">
                <h4>${project.name}</h4>
                <div class="project-list-meta">
                    <span>Progress: ${project.progress}%</span>
                    <span>Due: ${formatDate(project.deadline)}</span>
                </div>
            </div>
            <div class="project-status status-${project.status}">
                ${project.status.replace('-', ' ')}
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-secondary); text-align: center;">No active projects</p>';
}

// Load Pending Tasks
function loadPendingTasks() {
    const container = document.getElementById('pendingTasksList');
    const pending = tasks.filter(t => t.status === 'pending').slice(0, 5);
    
    container.innerHTML = pending.map(task => `
        <div class="task-list-item priority-${task.priority}" onclick="viewTask(${task.id})">
            <div class="task-list-info">
                <h5>${task.title}</h5>
                <div class="task-list-meta">
                    <span>${task.assignedTo}</span> • 
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
            <div class="task-status status-${task.status}">
                ${task.status}
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-secondary); text-align: center;">No pending tasks</p>';
}

// Load Projects
function loadProjects() {
    const container = document.getElementById('projectsGrid');
    
    container.innerHTML = myProjects.map(project => `
        <div class="project-card">
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
                    <i class="fas fa-calendar"></i>
                    <span>Due: ${formatDate(project.deadline)}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tasks"></i>
                    <span>${tasks.filter(t => t.projectId === project.id).length} tasks</span>
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

// Load Tasks
function loadTasks() {
    const container = document.getElementById('tasksGrid');
    
    container.innerHTML = tasks.map(task => `
        <div class="task-card priority-${task.priority}" onclick="viewTask(${task.id})">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${task.title}</h3>
                </div>
                <span class="task-status status-${task.status}">
                    ${task.status}
                </span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-meta-item">
                    <i class="fas fa-folder"></i>
                    <span>${task.projectName}</span>
                </div>
                <div class="task-meta-item">
                    <i class="fas fa-user"></i>
                    <span>${task.assignedTo}</span>
                </div>
                <div class="task-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>Due: ${formatDate(task.deadline)}</span>
                </div>
                <div class="task-meta-item">
                    <i class="fas fa-flag"></i>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Tasks
function filterTasks(search, status) {
    let filtered = tasks;
    
    if (search) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.assignedTo.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    if (status && status !== 'all') {
        filtered = filtered.filter(t => t.status === status);
    }
    
    const container = document.getElementById('tasksGrid');
    container.innerHTML = filtered.map(task => `
        <div class="task-card priority-${task.priority}" onclick="viewTask(${task.id})">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${task.title}</h3>
                </div>
                <span class="task-status status-${task.status}">
                    ${task.status}
                </span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-meta-item">
                    <i class="fas fa-folder"></i>
                    <span>${task.projectName}</span>
                </div>
                <div class="task-meta-item">
                    <i class="fas fa-user"></i>
                    <span>${task.assignedTo}</span>
                </div>
                <div class="task-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>Due: ${formatDate(task.deadline)}</span>
                </div>
                <div class="task-meta-item">
                    <i class="fas fa-flag"></i>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Team Members
function loadTeamMembers() {
    const container = document.getElementById('teamMembersGrid');
    
    container.innerHTML = teamMembers.map(member => `
        <div class="member-card">
            <div class="member-avatar">${member.name.charAt(0)}</div>
            <h3 class="member-name">${member.name}</h3>
            <p class="member-email">${member.email}</p>
            <div class="member-stats">
                <div class="member-stat">
                    <div class="member-stat-value">${member.tasks}</div>
                    <div class="member-stat-label">Tasks</div>
                </div>
                <div class="member-stat">
                    <div class="member-stat-value">${member.completed}</div>
                    <div class="member-stat-label">Completed</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Project Options
function loadProjectOptions() {
    const select = document.getElementById('taskProject');
    select.innerHTML = '<option value="">Select Project</option>' + 
        myProjects.map(project => `<option value="${project.id}">${project.name}</option>`).join('');
}

// Load Team Member Options
function loadTeamMemberOptions() {
    const select = document.getElementById('taskAssignee');
    select.innerHTML = '<option value="">Select Team Member</option>' + 
        teamMembers.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
}

// Create Task Modal
function openCreateTaskModal() {
    document.getElementById('createTaskModal').classList.add('show');
    document.getElementById('createTaskForm').reset();
}

function closeCreateTaskModal() {
    document.getElementById('createTaskModal').classList.remove('show');
}

// Handle Create Task
function handleCreateTask(e) {
    e.preventDefault();
    
    const projectId = parseInt(document.getElementById('taskProject').value);
    const project = myProjects.find(p => p.id === projectId);
    
    const newTask = {
        id: tasks.length + 1,
        projectId: projectId,
        projectName: project ? project.name : '',
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        assignedTo: document.getElementById('taskAssignee').value,
        priority: document.getElementById('taskPriority').value,
        deadline: document.getElementById('taskDeadline').value,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0]
    };
    
    tasks.unshift(newTask);
    closeCreateTaskModal();
    loadTasks();
    loadPendingTasks();
    updateStats();
    showToast('Task created successfully!');
}

// View Task
function viewTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const modal = document.getElementById('viewTaskModal');
    document.getElementById('viewTaskTitle').textContent = task.title;
    
    const content = document.getElementById('taskDetailsContent');
    content.innerHTML = `
        <div class="detail-section">
            <h3>Task Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Project</span>
                    <span class="detail-value">${task.projectName}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">
                        <span class="task-status status-${task.status}">
                            ${task.status}
                        </span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Priority</span>
                    <span class="detail-value">
                        <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Assigned To</span>
                    <span class="detail-value">${task.assignedTo}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Deadline</span>
                    <span class="detail-value">${formatDate(task.deadline)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Created</span>
                    <span class="detail-value">${formatDate(task.createdDate)}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${task.description}</p>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeViewTaskModal() {
    document.getElementById('viewTaskModal').classList.remove('show');
}

// Team Performance
function loadTeamPerformance() {
    const performanceData = teamMembers.map(member => ({
        name: member.name,
        completion: member.tasks > 0 ? Math.round((member.completed / member.tasks) * 100) : 0
    }));
    
    const container = document.getElementById('teamPerformanceList');
    container.innerHTML = performanceData.map(data => `
        <div class="performance-item">
            <span class="performance-name">${data.name}</span>
            <span class="performance-score">${data.completion}%</span>
        </div>
    `).join('');
}

// Chart
let taskChart;

function initializeChart() {
    const ctx = document.getElementById('taskChart');
    if (!ctx) return;
    
    const statusCounts = {
        'Pending': tasks.filter(t => t.status === 'pending').length,
        'In Progress': tasks.filter(t => t.status === 'in-progress').length,
        'Completed': tasks.filter(t => t.status === 'completed').length
    };
    
    taskChart = new Chart(ctx, {
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