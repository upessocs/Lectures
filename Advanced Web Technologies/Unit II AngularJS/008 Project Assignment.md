
### Lecture Hour 9: Mini-Project & Recap

**Objective:** Consolidate all learned concepts by building a small, functional application.

**Project: Simple Task Manager**
Build an app that allows a user to:

1.  See a list of tasks.
2.  Add a new task.
3.  Mark a task as completed.
4.  Delete a task.
5.  Filter tasks (All, Active, Completed).

**Step-by-Step Guide:**
1.  **Setup:** Create the HTML file, include Angular, and create the module `taskManagerApp`.
2.  **Controller & Model:** Create a `TaskController` with a `$scope.tasks` array and a `$scope.newTask` object.
3.  **View & `ng-repeat`:** Use `ng-repeat` to display the list of tasks. Each task should have a description and a "completed" state. Use `ng-class` to strikethrough completed tasks.
    ```html
    <li ng-repeat="task in tasks" ng-class="{ 'completed': task.done }">
        <input type="checkbox" ng-model="task.done"> {{ task.description }}
    </li>
    ```
4.  **Add Task Function:** Create `$scope.addTask = function() { ... }` that pushes `$scope.newTask` into the `$scope.tasks` array. Bind it to a form with `ng-submit`.
5.  **Delete Task Function:** Create `$scope.deleteTask = function(taskToDelete) { ... }` that removes the task from the array. Add a delete button next to each task with `ng-click="deleteTask(task)"`.
6.  **Filtering:** Create a `$scope.statusFilter` object. Use Angular's `filter` filter to show only active or completed tasks based on a selection.
    ```html
    <select ng-model="statusFilter">
        <option value="">All</option>
        <option value="false">Active</option>
        <option value="true">Completed</option>
    </select>
    <li ng-repeat="task in tasks | filter: { done: statusFilter }">...</li>
    ```

**Recap of All Concepts Used:**
- Module, Controller, `$scope`
- Directives: `ng-app`, `ng-controller`, `ng-repeat`, `ng-model`, `ng-click`, `ng-submit`, `ng-class`
- Filters: `filter`
- Form handling and functions
- Data binding (`{{ }}`, `ng-model`)

<a style="padding:1em;border-radius:.2em;color:white;background-color:orange;font-weight:900;" href="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js" download="angular.min.js"> Download Angular for offline testing </a> 