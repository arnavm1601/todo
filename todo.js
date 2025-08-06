let todoLists = document.querySelector(".todolists");
let listValue = document.querySelector(".todovalue");
let add = document.querySelector(".add");
let tasks = [];

// DOM Elements for Auth and Main App
const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');
const signInBtn = document.getElementById('signIn');
const signUpBtn = document.getElementById('signUp');

// DOM Elements for Timer
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');

// Timer variables
let timerInterval;
let timeInSeconds = 25 * 60;
let isTimerRunning = false;

// --- Auth and Session Management ---

document.addEventListener('DOMContentLoaded', () => {
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
        showMainApp(activeUser);
    } else {
        authContainer.classList.add('active');
        mainApp.style.display = 'none';
    }
});

signUpBtn.addEventListener('click', () => {
    authContainer.classList.add("right-panel-active");
});

signInBtn.addEventListener('click', () => {
    authContainer.classList.remove("right-panel-active");
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target['signup-username'].value;
    const password = e.target['signup-password'].value;
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        alert('Username already exists!');
    } else {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Account created successfully! Please sign in.');
        authContainer.classList.remove("right-panel-active");
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target['login-username'].value;
    const password = e.target['login-password'].value;
    let users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username] && users[username] === password) {
        localStorage.setItem('activeUser', username);
        showMainApp(username);
    } else {
        alert('Invalid username or password.');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('activeUser');
    mainApp.classList.remove('active');
    authContainer.classList.add('active');
    tasks = []; // Clear tasks for the next user
    todoLists.innerHTML = ''; // Clear the UI
});

function showMainApp(username) {
    authContainer.classList.remove('active');
    mainApp.classList.add('active');
    welcomeMessage.textContent = `Welcome, ${username}!`;
    loadTasksFromLocalStorage(username);
}

// --- To-Do App Logic (Integrated with user session) ---

add.addEventListener("click", () => {
    addTask(listValue.value);
});

listValue.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTask(listValue.value);
    }
});

function addTask(taskText) {
    if (taskText.trim() === "") return;
    let taskObj = { text: taskText, completed: false };
    tasks.push(taskObj);
    renderTask(taskObj);
    saveToLocalStorage();
    listValue.value = "";
}

function renderTask(taskObj) {
    let div = document.createElement('div');
    let chckbox = document.createElement('input');
    chckbox.type = "checkbox";
    chckbox.checked = taskObj.completed;
    chckbox.addEventListener("click", function () {
        taskObj.completed = chckbox.checked;
        span.style.textDecoration = taskObj.completed ? "line-through" : "none";
        saveToLocalStorage();
    });
    let span = document.createElement('span');
    span.textContent = taskObj.text;
    if (taskObj.completed) {
        span.style.textDecoration = "line-through";
    }
    let delte = document.createElement('button');
    delte.textContent = "✖️";
    delte.classList.add("delete-btn");
    delte.addEventListener("click", function () {
        div.remove();
        tasks = tasks.filter(t => t.text !== taskObj.text);
        saveToLocalStorage();
    });
    let update = document.createElement('button');
    update.textContent = "✏️";
    update.classList.add("edit-btn");
    update.addEventListener("click", function () {
        let newTask = prompt("Update your task:", taskObj.text);
        if (newTask !== null && newTask.trim() !== "") {
            taskObj.text = newTask;
            span.textContent = newTask;
            saveToLocalStorage();
        }
    });
    div.appendChild(chckbox);
    div.appendChild(span);
    div.appendChild(update);
    div.appendChild(delte);
    todoLists.appendChild(div);
}

function saveToLocalStorage() {
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
        localStorage.setItem(`tasks_${activeUser}`, JSON.stringify(tasks));
    }
}

function loadTasksFromLocalStorage(username) {
    let storedTasks = localStorage.getItem(`tasks_${username}`);
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(taskObj => renderTask(taskObj));
    }
}

// --- Timer Logic ---

startTimerBtn.addEventListener('click', () => {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
    }
});

pauseTimerBtn.addEventListener('click', () => {
    isTimerRunning = false;
    clearInterval(timerInterval);
});

resetTimerBtn.addEventListener('click', () => {
    isTimerRunning = false;
    clearInterval(timerInterval);
    timeInSeconds = 25 * 60;
    updateTimerDisplay();
});

function updateTimer() {
    if (timeInSeconds > 0) {
        timeInSeconds--;
        updateTimerDisplay();
    } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        alert("Time's up! Take a break.");
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}