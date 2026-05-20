function escapeHTML(str) {
    return str.replace(/[&<>"']/g, (tag) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[tag]));
}

export function renderTasks(taskList, tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <li class="empty-state">
                <h2>No tasks found</h2>
                <p>Add your first task to get started!</p>
            </li>
        `;
        return;
    }

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task ${task.completed ? "completed" : ""}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <label>
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <span>${escapeHTML(task.text)}</span>
            </label>

            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

export function updateCounter(counter, tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    counter.textContent = `${total} total | ${active} active | ${completed} completed`;
}