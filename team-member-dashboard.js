// Check authentication
if (sessionStorage.getItem('isLoggedIn') !== 'true' || sessionStorage.getItem('userRole') !== 'team-member') {
    window.location.href = 'login.html';
}

// Sample data
let myTasks = [
    {
        id: 1,
        projectName: 'Website Redesign',
        title: 'Design Homepage Mockup',
        description: 'Create wireframes and mockups for the new homepage design with modern UI/UX principles',
        priority: 'high',
        status: 'in-progress',
        deadline: '2026-02-05',
        createdDate: '2026-01-25',
        comments: []
    },
    {
        id: 2,
        projectName: 'Website Redesign',
        title: 'Implement Navigation Menu',
        description: 'Code responsive navigation menu with dropdown functionality and mobile optimization',
        priority: 'medium',
        status: 'pending',
        deadline: '2026-02-08',
        createdDate: '2026-01-26',
        comments: []
    },
    {
        id: 3,
        projectName: 'Mobile App Development',
        title: 'Create Login Screen',
        description: 'Design and implement user authentication screen with social login options',
        priority: 'high',
        status: 'pending',
        deadline: '2026-02-10',
        createdDate: '2026-01-27',
        comments: []
    },
    {
        id: 4,
        projectName: 'Website Redesign',
        title: 'Optimize Images',
        description: 'Compress and optimize all website images for faster loading',
        priority: 'low',
        status: 'completed',
        deadline: '2026-02-01',
        createdDate: '2026-01-22',
        completedDate: '2026-01-30',
        comments: []
    }
];

let currentTaskId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupNavigation();
    setupEventListeners();
    updateStats();
    loadPriorityTasks();
    loadRecentActivity();
    loadMyTasks();
    loadCompletedTasks();
    renderCalendar();
    loadUpcomingDeadlines();
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
            'my-tasks': 'My Tasks',
            'completed': 'Completed Tasks',
            'calendar': 'Task Calendar'
        };
        document.querySelector('.page-title').textContent = titles[section] || 'Dashboard';
    }
}

// Event Listeners
function setupEventListeners() {
    // Task search
    const taskSearch = document.getElementById('taskSearch');
    if (taskSearch) {
        taskSearch.addEventListener('input', function(e) {
            filterTasks(
                e.target.value,
                document.getElementById('taskFilter').value,
                document.getElementById('priorityFilter').value
            );
        });
    }
    
    // Task filter
    const taskFilter = document.getElementById('taskFilter');
    if (taskFilter) {
        taskFilter.addEventListener('change', function(e) {
            filterTasks(
                document.getElementById('taskSearch').value,
                e.target.value,
                document.getElementById('priorityFilter').value
            );
        });
    }
    
    // Priority filter
    const priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter) {
        priorityFilter.addEventListener('change', function(e) {
            filterTasks(
                document.getElementById('taskSearch').value,
                document.getElementById('taskFilter').value,
                e.target.value
            );
        });
    }
    
    // Update status form
    const updateStatusForm = document.getElementById('updateStatusForm');
    if (updateStatusForm) {
        updateStatusForm.addEventListener('submit', handleUpdateStatus);
    }
    
    // Add comment form
    const addCommentForm = document.getElementById('addCommentForm');
    if (addCommentForm) {
        addCommentForm.addEventListener('submit', handleAddComment);
    }
}

// Load Dashboard
function loadDashboard() {
    const userEmail = sessionStorage.getItem('userEmail');
    document.querySelector('.user-name').textContent = userEmail.split('@')[0];
}

// Update Stats
function updateStats() {
    const total = myTasks.length;
    const inProgress = myTasks.filter(t => t.status === 'in-progress').length;
    const completed = myTasks.filter(t => t.status === 'completed').length;
    const pending = myTasks.filter(t => t.status === 'pending').length;
    
    // Due today
    const today = new Date().toISOString().split('T')[0];
    const dueToday = myTasks.filter(t => t.deadline === today && t.status !== 'completed').length;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('dueToday').textContent = dueToday;
    
    // Completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const completionRateEl = document.getElementById('completionRate');
    if (completionRateEl) {
        completionRateEl.textContent = `${completionRate}%`;
    }
}

// Load Priority Tasks
function loadPriorityTasks() {
    const container = document.getElementById('priorityTasksList');
    const highPriority = myTasks
        .filter(t => t.priority === 'high' && t.status !== 'completed')
        .slice(0, 5);
    
    container.innerHTML = highPriority.map(task => `
        <div class="task-list-item priority-${task.priority}" onclick="viewTask(${task.id})">
            <div class="task-list-info">
                <h5>${task.title}</h5>
                <div class="task-list-meta">
                    <span>${task.projectName}</span> • 
                    <span>Due: ${formatDate(task.deadline)}</span>
                </div>
            </div>
            <div class="task-status status-${task.status}">
                ${task.status.replace('-', ' ')}
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-secondary); text-align: center;">No high priority tasks</p>';
}

// Load Recent Activity
function loadRecentActivity() {
    const container = document.getElementById('activityList');
    const recentTasks = myTasks.slice(0, 5);
    
    const activities = recentTasks.map(task => {
        let action = 'Task assigned';
        let icon = 'fa-plus';
        
        if (task.status === 'in-progress') {
            action = 'Started working on';
            icon = 'fa-play';
        } else if (task.status === 'completed') {
            action = 'Completed';
            icon = 'fa-check';
        }
        
        return {
            title: `${action} "${task.title}"`,
            time: getRelativeTime(task.createdDate),
            icon: icon
        };
    });
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-secondary); text-align: center;">No recent activity</p>';
}

// Load My Tasks
function loadMyTasks() {
    const container = document.getElementById('tasksGrid');
    const activeTasks = myTasks.filter(t => t.status !== 'completed');
    
    container.innerHTML = activeTasks.map(task => `
        <div class="task-card priority-${task.priority}" onclick="viewTask(${task.id})">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${task.title}</h3>
                </div>
                <span class="task-status status-${task.status}">
                    ${task.status.replace('-', ' ')}
                </span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-meta-item">
                    <i class="fas fa-folder"></i>
                    <span>${task.projectName}</span>
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
    `).join('') || '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">No active tasks</p>';
}

// Filter Tasks
function filterTasks(search, status, priority) {
    let filtered = myTasks.filter(t => t.status !== 'completed');
    
    if (search) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.projectName.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    if (status && status !== 'all') {
        filtered = filtered.filter(t => t.status === status);
    }
    
    if (priority && priority !== 'all') {
        filtered = filtered.filter(t => t.priority === priority);
    }
    
    const container = document.getElementById('tasksGrid');
    container.innerHTML = filtered.map(task => `
        <div class="task-card priority-${task.priority}" onclick="viewTask(${task.id})">
            <div class="task-header">
                <div>
                    <h3 class="task-title">${task.title}</h3>
                </div>
                <span class="task-status status-${task.status}">
                    ${task.status.replace('-', ' ')}
                </span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-meta-item">
                    <i class="fas fa-folder"></i>
                    <span>${task.projectName}</span>
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
    `).join('') || '<p style="color: var(--text-secondary); text-align: center; padding: 40px;">No tasks found</p>';
}

// Load Completed Tasks
function loadCompletedTasks() {
    const container = document.getElementById('completedTasksList');
    const completed = myTasks.filter(t => t.status === 'completed');
    
    container.innerHTML = completed.map(task => `
        <div class="completed-task-item">
            <div class="completed-task-info">
                <h5>${task.title}</h5>
                <div class="completed-task-meta">
                    <span>${task.projectName}</span> • 
                    <span>Completed: ${formatDate(task.completedDate || task.deadline)}</span>
                </div>
            </div>
            <span class="completed-badge">
                <i class="fas fa-check"></i> Completed
            </span>
        </div>
    `).join('') || '<p style="color: var(--text-secondary); text-align: center;">No completed tasks yet</p>';
}

// View Task
function viewTask(taskId) {
    const task = myTasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentTaskId = taskId;
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
                            ${task.status.replace('-', ' ')}
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
                    <span class="detail-label">Deadline</span>
                    <span class="detail-value">${formatDate(task.deadline)}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Description</h3>
            <p style="color: var(--text-secondary); line-height: 1.6;">${task.description}</p>
        </div>
        
        <div class="detail-section">
            <h3>Comments & Updates</h3>
            <div style="color: var(--text-secondary);">
                ${task.comments.length > 0 ? 
                    task.comments.map(comment => `
                        <div style="padding: 12px; background: #f9fafb; border-radius: 8px; margin-bottom: 10px;">
                            <div style="font-weight: 600; margin-bottom: 5px;">${comment.text}</div>
                            <div style="font-size: 12px;">${formatDate(comment.date)}</div>
                        </div>
                    `).join('') : 
                    'No comments yet'
                }
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeViewTaskModal() {
    document.getElementById('viewTaskModal').classList.remove('show');
    currentTaskId = null;
}

// Update Task Status
function updateTaskStatus() {
    if (!currentTaskId) return;
    
    const task = myTasks.find(t => t.id === currentTaskId);
    if (!task) return;
    
    document.getElementById('newStatus').value = task.status;
    document.getElementById('updateStatusModal').classList.add('show');
}

function closeUpdateStatusModal() {
    document.getElementById('updateStatusModal').classList.remove('show');
}

function handleUpdateStatus(e) {
    e.preventDefault();
    
    const newStatus = document.getElementById('newStatus').value;
    const task = myTasks.find(t => t.id === currentTaskId);
    
    if (task) {
        task.status = newStatus;
        if (newStatus === 'completed') {
            task.completedDate = new Date().toISOString().split('T')[0];
        }
        
        closeUpdateStatusModal();
        closeViewTaskModal();
        updateStats();
        loadMyTasks();
        loadPriorityTasks();
        loadCompletedTasks();
        loadRecentActivity();
        showToast('Task status updated successfully!');
    }
}

// Add Comment
function addComment() {
    if (!currentTaskId) return;
    document.getElementById('addCommentModal').classList.add('show');
}

function closeAddCommentModal() {
    document.getElementById('addCommentModal').classList.remove('show');
    document.getElementById('addCommentForm').reset();
}

function handleAddComment(e) {
    e.preventDefault();
    
    const commentText = document.getElementById('commentText').value;
    const task = myTasks.find(t => t.id === currentTaskId);
    
    if (task) {
        task.comments.push({
            text: commentText,
            date: new Date().toISOString().split('T')[0]
        });
        
        closeAddCommentModal();
        viewTask(currentTaskId); // Refresh task view
        showToast('Comment added successfully!');
    }
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
        const hasDeadline = myTasks.some(t => t.deadline === dateStr && t.status !== 'completed');
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
    const upcoming = myTasks
        .filter(t => new Date(t.deadline) >= today && t.status !== 'completed')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    const container = document.getElementById('upcomingDeadlines');
    container.innerHTML = upcoming.map(task => `
        <div class="deadline-item">
            <div class="deadline-task">${task.title}</div>
            <div class="deadline-date">
                <i class="fas fa-calendar"></i> ${formatDate(task.deadline)}
            </div>
        </div>
    `).join('') || '<p style="color: var(--text-secondary);">No upcoming deadlines</p>';
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

function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}