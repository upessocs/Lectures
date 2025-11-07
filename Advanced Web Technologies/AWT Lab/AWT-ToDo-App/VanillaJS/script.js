
// Vanilla JS To-Do with localStorage persistence
(function () {
  const STORAGE_KEY = "tasks-vanilla";
  const input = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const list = document.getElementById("taskList");

  let tasks = [];

  function load() {
    try {
      tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (e) { tasks = []; }
    render();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    list.innerHTML = "";
    tasks.forEach((t, i) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.className = "task";
      span.textContent = t.text;
      if (t.done) span.classList.add("completed");

      const doneBtn = document.createElement("button");
      doneBtn.textContent = "Done";
      doneBtn.addEventListener("click", () => toggleComplete(i));

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => deleteTask(i));

      li.appendChild(span);
      li.appendChild(doneBtn);
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text, done: false });
    input.value = "";
    save();
    render();
  }

  function deleteTask(i) {
    tasks.splice(i, 1);
    save();
    render();
  }

  function toggleComplete(i) {
    tasks[i].done = !tasks[i].done;
    save();
    render();
  }

  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") addTask(); });

  load();
})();
