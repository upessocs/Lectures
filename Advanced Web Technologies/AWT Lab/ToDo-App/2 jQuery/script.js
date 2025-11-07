
// jQuery To-Do with localStorage persistence
// Vanilla: document.getElementById -> jQuery: $("#id")
// Vanilla: addEventListener("click", fn) -> jQuery: .on("click", fn)
// Vanilla: createElement/appendChild -> jQuery: $("<li>") / .append()

(function ($) {
  const STORAGE_KEY = "tasks-jquery";
  let tasks = [];

  function load() {
    try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch (e) { tasks = []; }
    render();
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    const $list = $("#taskList").empty();
    tasks.forEach((t, i) => {
      const $li = $("<li>");
      const $span = $("<span>").addClass("task").text(t.text);
      if (t.done) $span.addClass("completed");

      const $done = $("<button>").text("Done").on("click", () => toggleComplete(i));
      const $del = $("<button>").text("Delete").on("click", () => deleteTask(i));

      $li.append($span, $done, $del);
      $list.append($li);
    });
  }

  function addTask() {
    const text = $("#taskInput").val().trim();
    if (!text) return;
    tasks.push({ text, done: false });
    $("#taskInput").val("");
    save(); render();
  }

  function deleteTask(i) { tasks.splice(i, 1); save(); render(); }
  function toggleComplete(i) { tasks[i].done = !tasks[i].done; save(); render(); }

  $("#addBtn").on("click", addTask);
  $("#taskInput").on("keydown", (e) => { if (e.key === "Enter") addTask(); });

  load();
})(jQuery);
