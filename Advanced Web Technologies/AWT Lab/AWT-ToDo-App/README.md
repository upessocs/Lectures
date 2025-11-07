
# To-Do App Hands-On Lab

Vanilla JavaScript → jQuery → AngularJS → React → Vue
With LocalStorage Persistence

## 1. Overview

This lab demonstrates how the same simple To-Do application can be implemented in five different ways:

* **Vanilla JavaScript**
* **jQuery**
* **AngularJS (1.x)**
* **React (18, JSX via Babel)**
* **Vue (3, Composition API)**

Each version implements the same core functionality:

* Add a task
* Mark as completed
* Delete task
* Auto-save tasks to `localStorage` for persistence
* Load saved tasks on page reload

The goal is to show how different web-development approaches handle DOM updates, data binding, and state management.

You can open any folder’s `index.html` directly in a browser. Internet connectivity is required for CDN libraries.

---

## 2. Basic To-Do List Components

Every version uses the same minimal structure:

1. **Input Field** Where the user types a new task.

2. **Add Button** Triggers addition of the task.

3. **List Container (`<ul>`)** Displays all tasks.

4. **List Items (`<li>`)** containing:
   * Task text
   * "Done" button to toggle completion
   * "Delete" button to remove from list
   * Optional strike-through styling when completed

5. **localStorage**
   * Saves tasks between reloads.
   * Each framework uses its own storage key:
   * `tasks-vanilla`, `tasks-jquery`, `tasks-angular`, `tasks-react`, `tasks-vue`.

---

## 3. Required Functions

Regardless of framework, the following logical operations are needed:

### 3.1 `load()`

Loads tasks from `localStorage` (if available) when the app starts.

### 3.2 `save()`

Writes current tasks into `localStorage`.

### 3.3 `addTask()`

* Reads input text
* Validates it
* Appends to the task list
* Clears the input
* Saves + re-renders (except Angular/React/Vue where re-rendering is automatic)

### 3.4 `toggleComplete(index)`

Marks a task done or undone.

### 3.5 `deleteTask(index)`

Removes the task permanently.

---

## 4. Framework-by-Framework Explanation

This project demonstrates how the **same logic** is implemented using progressively more advanced abstraction layers.

---

## 4.1 Vanilla JavaScript

Folder: `VanillaJS/`

* Direct DOM access using
  `document.getElementById()`, `createElement()`, `appendChild()`, and `addEventListener()`.
* Full manual control of UI updates.
* You must explicitly re-render on every change.
* Good for understanding the bare-metal DOM API.

Here, `render()` rebuilds the entire list each time tasks change.

---

## 4.2 jQuery

Folder: `jQuery/`

jQuery simplifies common operations:

* `$("#id")` instead of `document.getElementById`
* `.on("click", handler)` for events
* `$("<li>")` for element creation
* Chaining of operations
  Example: `$("#taskList").empty().append(li)`

Still requires manual DOM updates like Vanilla JS, but shorter and easier to read.

The script includes comments comparing jQuery and Vanilla JS versions.

---

## 4.3 AngularJS (1.x)

Folder: `AngularJS/`

AngularJS introduces declarative data binding:

* `ng-model` connects input fields to scope variables
* `ng-repeat` renders lists automatically
* No manual DOM creation
* `$watch` and automatic dirty-checking keep UI synchronized with data

Instead of re-rendering manually, Angular updates the DOM when `$scope.tasks` changes.

---

## 4.4 React (18, JSX via Babel)

Folder: `React/`

React uses:

* Component-based UI
* State stored in `useState`
* `useEffect` for persistence side effects
* Declarative rendering based on state
* JSX for UI templates (compiled via Babel in browser)

React never manipulates the DOM manually; it recalculates the UI based on state and updates efficiently through its virtual DOM.

---

## 4.5 Vue (3, Composition API)

Folder: `Vue/`

Vue provides reactive state with clearer syntax than AngularJS:

* `ref()` for reactive variables
* Template-driven DOM
* `v-for`, `v-model`, `v-on` (`@click`)
* Watchers keep `localStorage` updated

Vue is more concise compared to AngularJS and React for simple apps.

---

## 5. File Structure

```
ToDo-App/
  README.md
  1 VanillaJS/
    index.html
    style.css
    script.js
  2 jQuery/
    index.html
    style.css
    script.js
  3 AngularJS/
    index.html
    style.css
    script.js
  4 React/
    index.html
    style.css
    script.js
  5 Vue/
    index.html
    style.css
    script.js
```

Each folder is self-contained and runnable.

---

## 6. How to Run

1. Open any folder.
2. Double-click `index.html` to open it in a browser.

> CDN scripts are loaded online, so an active internet connection is required.

There is no backend, no build process, and no server needed.

---

## 7. What to Compare While Learning

1. How each method handles:

   * DOM creation
   * Event binding
   * State management
   * Re-rendering
   * Data persistence

2. How much code is required in each approach.

3. Which framework suits which type of project:

   * Vanilla/ jQuery → small widgets
   * AngularJS → older legacy enterprise apps
   * React → modern component-based apps
   * Vue → simple, elegant reactive approach

