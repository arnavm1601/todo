let todoLists = document.querySelector(".todolists");
let listValue = document.querySelector(".todovalue");
let add = document.querySelector(".add");

let tasks = [];

window.onload = function () {
    loadTasksFromLocalStorage();
};

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
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "10px";
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
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    let storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        tasks.forEach(taskObj => renderTask(taskObj));
    }
}