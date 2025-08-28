### Front End Development using AngularJS (1.x)

**Note:** This tutorial covers AngularJS (version 1.x), a distinct framework from the modern Angular (versions 2+). The core concepts of data-binding and MVC are foundational to understanding modern front-end frameworks.

---

### Lecture Hour 1: Introduction & Core Concepts

**Objective:** Understand the role of AngularJS and build your first "Hello World" app.

**1. Role of AngularJS in Web Development**
- **What it is:** A structural JavaScript-based open-source front-end web application framework.
- **The Problem it Solves:** Traditional websites (using jQuery) manipulate the DOM directly, leading to messy, hard-to-maintain "spaghetti code." AngularJS helps you build **Single-Page Applications (SPAs)** where content is updated dynamically without full page reloads.
- **Key Benefits:**
    *   **MVC Architecture:** Organizes code into logical parts (Model, View, Controller).
    *   **Data Binding:** Automatically synchronizes data between the model (JavaScript) and view (HTML).
    *   **Directives:** Extends HTML with custom attributes and elements, making it more expressive.
    *   **Dependency Injection:** Makes components reusable, manageable, and easy to test.

**2. Basic Architecture & Core Concepts**
- **The AngularJS Application (`ng-app`)**: The root element of the application. It auto-bootstraps the app.
- **The View (HTML)**: The DOM, which is the user interface.
- **The Model:** The data shown to the user and with which the user interacts.
- **The Controller (`ng-controller`)**: The JavaScript function that builds the model and contains the application logic. It's the glue between the View and the Model.
- **Data Binding (`ng-model`, `{{ }}`):** The magic that connects the Model and the View.

**3. Creating a Simple Application: "Hello World"**
- **Step 1: Include the AngularJS Script**
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    </head>
    <body>
        <!-- Our app will go here -->
    </body>
    </html>
    ```
- **Step 2: Define the AngularJS App (`ng-app`)**
    ```html
    <body ng-app="myHelloWorldApp">
    ```
- **Step 3: Create a Module (in a `<script>` tag)**
    ```javascript
    <script>
        // Create a module. The array [] is for dependencies (none for now).
        var app = angular.module('myHelloWorldApp', []);
    </script>
    ```
- **Step 4: Create a Controller (`ng-controller`)**
    ```html
    <div ng-controller="HelloWorldController">
        <!-- Our view will go here -->
    </div>
    ```
    ```javascript
    app.controller('HelloWorldController', function($scope) {
        // $scope is the glue (model) between the controller and the view.
        $scope.message = "Hello, World!";
    });
    ```
- **Step 5: Bind Data in the View (`{{ }}`)**
    ```html
    <div ng-controller="HelloWorldController">
        <h1>{{ message }}</h1> <!-- This will display "Hello, World!" -->
    </div>
    ```

---

### Lecture Hour 2: Directives & Data Binding

**Objective:** Master built-in directives and the powerful concept of two-way data binding.

**1. Built-in Directives**
Directives are markers on a DOM element (e.g., an attribute, element name, comment) that tell AngularJS's HTML compiler to attach a specified behavior to that DOM element.
- **`ng-model`:** Binds the value of an HTML form element (input, select, textarea) to a property on the `$scope`. Establishes **two-way data binding**.
- **`ng-bind`:** Similar to `{{ }}`, but binds the innerText of an element. Often used to avoid a "flicker" of un-rendered `{{ }}` on slow-loading pages.
    ```html
    <p>Your name: <input type="text" ng-model="user.name"></p>
    <h1>Hello, <span ng-bind="user.name"></span>!</h1>
    <!-- This does the same as: <h1>Hello, {{ user.name }}!</h1> -->
    ```
- **`ng-repeat`:** Instantiates a template once per item from a collection (array).
    ```html
    <ul>
        <li ng-repeat="item in shoppingList">{{ item.name }} - ${{ item.price }}</li>
    </ul>
    ```
    ```javascript
    $scope.shoppingList = [
        { name: 'Milk', price: 2.50 },
        { name: 'Bread', price: 3.00 }
    ];
    ```
- **`ng-show`/`ng-hide`:** Shows or hides an element based on a boolean expression.
- **`ng-if`:** Removes or recreates an element in the DOM based on an expression. Unlike `ng-show`, it destroys the element's scope.
- **`ng-class`:** Dynamically applies CSS classes.

**2. Two-Way Data Binding - Deep Dive**
- **What it is:** A change in the model is immediately reflected in the view, and any change in the view (e.g., user typing) is immediately reflected in the model.
- **The "Hello, `{{user.name}}`" example above is the classic demonstration.** Type in the input box and watch the `<h1>` update in real-time.

---

### Lecture Hour 3: Controllers & Scope

**Objective:** Understand the role of controllers and the `$scope` object in managing application state and logic.

**1. Controllers (`ng-controller`)**
- Purpose: To set up the initial state of the `$scope` object and add behavior (functions) to it.
- They are JavaScript constructor functions.
- **Best Practice:** Keep controllers simple. Don't put DOM manipulation code in controllers; use directives for that. Don't manage data persistence; use services for that.

**2. The `$scope` Object**
- It is the "glue" (the model) between the controller and the view.
- Properties and methods attached to `$scope` become available in the HTML view.
- **Example: Adding Behavior**
    ```javascript
    app.controller('CartController', function($scope) {
        $scope.items = ['Apple', 'Banana', 'Orange'];

        // A function on the scope
        $scope.addItem = function(newItem) {
            if (newItem) {
                $scope.items.push(newItem);
                $scope.newItem = ''; // Clear the input field
            }
        };
    });
    ```
    ```html
    <div ng-controller="CartController">
        <ul>
            <li ng-repeat="item in items">{{ item }}</li>
        </ul>
        <input type="text" ng-model="newItem" placeholder="Add a new item">
        <button ng-click="addItem(newItem)">Add</button>
    </div>
    ```
- **`ng-click`:** This is another crucial directive used to call a function on the `$scope` when an element is clicked.

---

### Lecture Hour 4: Filters*

**Objective:** Use filters to format data in the view without changing the underlying model.

**1. Basic Usage of Filters**
- Filters format the value of an expression for display to the user. They can be used in templates, controllers, or services.
- Syntax: `{{ expression | filterName:argument1:argument2... }}`
- **Common Built-in Filters:**
    *   **`currency`:** Format a number as a currency. `{{ 123.456 | currency }}` -> `$123.46`
    *   **`date`:** Format a date to a string. `{{ today | date:'fullDate' }}`
    *   **`filter`:** Select a subset of items from an array. Powerful for search functionality.
    *   **`json`:** Format an object as a JSON string. Great for debugging.
    *   **`limitTo`:** Limits an array/string to a specified number of elements/characters.
    *   **`lowercase` / `uppercase`**
    *   **`orderBy`:** Orders an array by an expression. `item in items | orderBy:'price'`

**2. Chaining Filters**
You can chain multiple filters together.
```html
<!-- Search for items, then order them by price, then format the price -->
<li ng-repeat="item in items | filter:searchText | orderBy:'price'">
    {{ item.name }} - {{ item.price | currency }}
</li>
<input type="text" ng-model="searchText" placeholder="Search items...">
```

---

### Lecture Hour 5: Angular Forms & Events*

**Objective:** Handle form submission and user events effectively.

**1. Angular Forms and `ng-submit`**
- Angular provides properties on a form to check its state (`$valid`, `$invalid`, `$pristine`, `$dirty`).
- Using `ng-submit` is preferred over `ng-click` on the submit button, as it also handles the `Enter` key correctly.
    ```html
    <form name="userForm" ng-submit="submitForm()" novalidate>
        <input type="text" name="username" ng-model="user.username" required>
        <button type="submit">Submit</button>
    </form>
    <p>Form is valid: {{ userForm.$valid }}</p>
    ```
    ```javascript
    $scope.submitForm = function() {
        if ($scope.userForm.$valid) {
            // Form is valid, proceed to save data (e.g., using a service)
            console.log('Form submitted!', $scope.user);
        }
    };
    ```

**2. Events**
- Angular has directives for most common DOM events.
- **`ng-click`:** Click event.
- **`ng-change`:** Fires when the input value changes. `<input ng-model="email" ng-change="checkEmail()">`
- **`ng-keyup` / `ng-keydown`:** Keyboard events. `<input ng-keyup="onKey($event)">`. The `$event` object contains details about the event.

---

### Lecture Hour 6: Form Validation

**Objective:** Implement robust client-side form validation using Angular's built-in features.

**1. Using HTML5 Attributes & Angular States**
- Angular works seamlessly with standard HTML5 validation attributes like `required`, `type="email"`, `type="number"`, `min`, `max`, etc.
- The `novalidate` attribute on the `<form>` tag disables the browser's default validation so Angular can handle it.
- **Form & Input Field States:** Angular adds CSS classes (`.ng-valid`, `.ng-invalid`, `.ng-pristine`, `.ng-dirty`) and properties to the form and input fields.
    *   **`$valid` / `$invalid`:** Based on the rules (e.g., `required`, `type="email"`).
    *   **`$pristine` / `$dirty`:** Has the user interacted with the field? `$pristine` means no interaction.

**2. Providing User Feedback**
- You can use these states to show/hide error messages and style fields.
    ```html
    <form name="loginForm" novalidate>
        <input type="email" name="userEmail" ng-model="user.email" required>
        <span ng-if="loginForm.userEmail.$dirty && loginForm.userEmail.$invalid">
            <span ng-if="loginForm.userEmail.$error.required">Email is required.</span>
            <span ng-if="loginForm.userEmail.$error.email">Please enter a valid email address.</span>
        </span>

        <button type="submit" ng-disabled="loginForm.$invalid">Submit</button>
    </form>
    ```
- **`ng-disabled`:** This directive is perfect for disabling the submit button until the entire form is valid.

---

### Lecture Hour 7: Custom Directives (Introduction)

**Objective:** Understand the purpose of custom directives and create a basic one.

**1. Why Create Custom Directives?**
- To create reusable UI components (e.g., a custom calendar, a tab panel, a reusable button).
- To manipulate the DOM in a clean, testable way (which shouldn't be done in controllers).

**2. Creating a Basic Directive**
- Let's create a simple directive that highlights its text in blue.
    ```javascript
    app.directive('myHighlight', function() {
        return {
            restrict: 'A', // Restrict to an Attribute (E for Element, C for Class)
            link: function(scope, element, attrs) {
                // The 'link' function is where you put DOM manipulation code.
                element.css('color', 'blue');
                element.css('font-weight', 'bold');
            }
        };
    });
    ```
    ```html
    <!-- Usage as an attribute -->
    <p my-highlight>This text will be blue and bold!</p>
    ```
- **Explanation:** The directive returns a **Directive Definition Object**. The `link` function is called to "link" the directive to the DOM. The `element` is a jQuery-lite (jqLite) object that wraps the DOM element.

---

### Lecture Hour 8: Debugging AngularJS Applications

**Objective:** Use browser developer tools to inspect and debug an AngularJS app.

**1. The Batarang Chrome Extension (Historical)**
- This was a dedicated Chrome extension for debugging AngularJS. It is now deprecated and unsupported. **Do not rely on it.**

**2. Using Native Browser DevTools**
- **Inspecting Scope:** The best way is to use the console. Select an element in the "Elements" panel and type `angular.element($0).scope()` in the console. `$0` refers to the currently selected element. This will print the associated `$scope` object, allowing you to inspect its properties.
- **`console.log()`:** Your best friend. Use it liberally in controllers to output the `$scope` or other variables. `console.log($scope);`
- **Debuggers:** Use the `debugger;` statement in your controller code. When the browser's DevTools are open, it will pause execution at that point, allowing you to step through code and inspect variables.
    ```javascript
    app.controller('MyController', function($scope) {
        $scope.user = { name: 'John' };
        debugger; // Execution will pause here if DevTools is open
        console.log('User is:', $scope.user);
    });
    ```
- **Reading Errors:** AngularJS error messages are often very descriptive. Read them carefully in the console. They usually point to the exact file and line number where the problem occurred (e.g., an undefined variable or a missing dependency).

---

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