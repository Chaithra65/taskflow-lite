import { saveTasks, loadTasks } from "./modules/storage.js";
import { validateTaskInput } from "./modules/validation.js";
import { renderTasks, updateCounter } from "./modules/render.js";

let tasks = loadTasks();
let currentFilter = "all";

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const errorMessage = document.getElementById("error-message");
const taskCounter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("theme-toggle");

function createTask(text) {
    return {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
}

function getFilteredTasks() {
    if (currentFilter === "active") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function refreshUI() {
    renderTasks(taskList, getFilteredTasks());
    updateCounter(taskCounter, tasks);
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const result = validateTaskInput(taskInput.value);

    if (!result.valid) {
        errorMessage.textContent = result.message;
        return;
    }

    tasks.push(createTask(taskInput.value));
    saveTasks(tasks);

    taskInput.value = "";
    errorMessage.textContent = "";

    refreshUI();
});

taskList.addEventListener("click", (e) => {
    const taskElement = e.target.closest(".task");

    if (!taskElement) return;

    const taskId = Number(taskElement.dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) return;

    if (e.target.type === "checkbox") {
        tasks[taskIndex].completed = e.target.checked;
        saveTasks(tasks);
        refreshUI();
    }

    if (e.target.classList.contains("delete-btn")) {
        const confirmDelete = confirm("Are you sure you want to delete this task?");

        if (confirmDelete) {
            tasks.splice(taskIndex, 1);
            saveTasks(tasks);
            refreshUI();
        }
    }

    if (e.target.classList.contains("edit-btn")) {
        const updatedText = prompt("Edit your task:", tasks[taskIndex].text);

        if (updatedText !== null) {
            const result = validateTaskInput(updatedText);

            if (!result.valid) {
                alert(result.message);
                return;
            }

            tasks[taskIndex].text = updatedText.trim();
            saveTasks(tasks);
            refreshUI();
        }
    }
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        refreshUI();
    });
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    themeToggle.textContent = document.body.classList.contains("dark")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
});

refreshUI();