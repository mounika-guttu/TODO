// Load tasks and theme from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let editTaskId = null;

// DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearAllBtn = document.getElementById('clear-all-btn');
const themeToggle = document.getElementById('theme-toggle');
const editModal = document.getElementById('edit-modal');
const editTaskInput = document.getElementById('edit-task-input');
const saveTaskBtn = document.getElementById('save-task-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const toast = document.getElementById('toast');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    renderTasks();
    updateTaskCount();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.innerHTML = document.body.classList.contains('dark')
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Load theme from local storage
function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Add task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
        tasks.push({ id: Date.now(), text: taskText, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
        showToast('Task added!');
    }
});

// Handle Enter key for adding tasks
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTaskBtn.click();
});

// Render tasks based on current filter
function renderTasks() {
    taskList.innerHTML = '';
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} aria-label="Mark task as completed">
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" aria-label="Edit task"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" aria-label="Delete task"><i class="fas fa-trash"></i></button>
            </div>
        `;

        // Checkbox toggle
        li.querySelector('input').addEventListener('change', () => {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            showToast(task.completed ? 'Task completed!' : 'Task marked as pending!');
        });

        // Edit task
        li.querySelector('.edit-btn').addEventListener('click', () => {
            editTaskId = task.id;
            editTaskInput.value = task.text;
            editModal.style.display = 'flex';
        });

        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
            renderTasks();
            showToast('Task deleted!');
        });

        taskList.appendChild(li);
    });

    updateTaskCount();
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task count
function updateTaskCount() {
    taskCount.textContent = tasks.filter(task => !task.completed).length;
}

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        saveTasks();
        renderTasks();
        showToast('All tasks cleared!');
    }
});

// Filter tasks
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Edit modal handlers
saveTaskBtn.addEventListener('click', () => {
    const newText = editTaskInput.value.trim();
    if (newText) {
        tasks = tasks.map(task =>
            task.id === editTaskId ? { ...task, text: newText } : task
        );
        saveTasks();
        renderTasks();
        editModal.style.display = 'none';
        showToast('Task updated!');
    }
});

cancelEditBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}