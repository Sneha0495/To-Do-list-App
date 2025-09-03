const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const datePicker = document.getElementById("datePicker");
const selectedDateTitle = document.getElementById("selectedDateTitle");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("calendarTasks")) || {};
let selectedDate = new Date().toISOString().split("T")[0];

// Initialize calendar with today's date
datePicker.value = selectedDate;
updateTaskView();

// Change date event
datePicker.addEventListener("change", () => {
  selectedDate = datePicker.value;
  updateTaskView();
});

// Add task button
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

// Add a new task for the selected date
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  if (!tasks[selectedDate]) tasks[selectedDate] = [];
  tasks[selectedDate].push({ text, completed: false });
  saveTasks();
  taskInput.value = "";
  updateTaskView();
}

// Render tasks for the selected date
function updateTaskView() {
  taskList.innerHTML = "";
  selectedDateTitle.textContent = `Tasks for ${formatDate(selectedDate)}`;

  if (!tasks[selectedDate] || tasks[selectedDate].length === 0) {
    taskList.innerHTML = "<li>No tasks for this date.</li>";
    return;
  }

  tasks[selectedDate].forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      tasks[selectedDate][index].completed = checkbox.checked;
      saveTasks();
      updateTaskView();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => {
      tasks[selectedDate].splice(index, 1);
      saveTasks();
      updateTaskView();
    });

    li.appendChild(left);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("calendarTasks", JSON.stringify(tasks));
}

// Format date to a readable format
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
