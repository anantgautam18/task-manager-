let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

const titleInput = document.getElementById('task-title');
const priorityInput = document.getElementById('task-priority');
const dateInput = document.getElementById('task-date');
const addBtn = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');
const sortSelect = document.getElementById('sort-tasks');

function renderTasks() {
  taskList.innerHTML = '';

  let filtered = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (sortSelect.value === 'priority') {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else {
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-details">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">Priority: ${task.priority} | Due: ${task.dueDate || 'N/A'}</div>
      </div>
      <div class="task-actions">
        <button onclick="toggleComplete(${index})">✔️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const title = titleInput.value.trim();
  const priority = priorityInput.value;
  const dueDate = dateInput.value;

  if (title) {
    tasks.push({ title, priority, dueDate, completed: false });
    titleInput.value = '';
    dateInput.value = '';
    renderTasks();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTasks();
  });
});

sortSelect.addEventListener('change', renderTasks);
addBtn.addEventListener('click', addTask);
renderTasks();