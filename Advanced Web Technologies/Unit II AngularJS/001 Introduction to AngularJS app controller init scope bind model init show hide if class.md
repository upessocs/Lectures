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


## Final `index.html` should look like

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
</head>
<body ng-app="myHelloWorldApp">
    <!-- Create a view -->
    <div ng-controller="HelloWorldController">
        <h1> {{ message }}</h1>
    </div>   

    <script>
        // Create a module. The array [] is for dependencies (none for now).
        var app = angular.module('myHelloWorldApp', []);

        // Create a controller. The $scope is the application model.
        app.controller('HelloWorldController', function($scope) {
        // $scope is the glue (model) between the controller and the view.
            $scope.message = "Hello, World!";
        });
    </script>
    </body>
</html>
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
## Understanding `ng-show/ng-hide`, `ng-if`, and `ng-class` Directives (Pending)


```html
<!DOCTYPE html>
<html ng-app="directivesApp">
<head>
    <title>AngularJS Directives - ng-show, ng-hide, ng-if, ng-class</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .section { margin: 20px 0; padding: 15px; border: 2px solid #ddd; border-radius: 5px; }
        .demo-box { padding: 15px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
        
        /* Styles for ng-class examples */
        .highlight { background-color: yellow; font-weight: bold; }
        .completed { text-decoration: line-through; color: #888; }
        .error { background-color: #ffebee; border-color: #f44336; color: #d32f2f; }
        .success { background-color: #e8f5e8; border-color: #4caf50; color: #2e7d32; }
        .warning { background-color: #fff3e0; border-color: #ff9800; color: #ef6c00; }
        .large-text { font-size: 18px; }
        .rotated { transform: rotate(5deg); display: inline-block; }
        
        /* Toggle styles */
        .visible-true { background: #e8f5e8; }
        .visible-false { background: #ffebee; }
        
        /* DOM inspection helpers */
        .dom-info { background: #f8f9fa; padding: 10px; border-left: 4px solid #6c757d; margin: 10px 0; }
        .dom-highlight { background: #fff3cd; border: 2px dashed #ffc107; }
    </style>
</head>
<body ng-controller="DirectivesController">
    <div class="container">
        <h1>AngularJS Directives Deep Dive</h1>
        
        <!-- Section 1: ng-show vs ng-hide -->
        <div class="section">
            <h2>1. ng-show vs ng-hide</h2>
            <p>These directives use CSS display property to show/hide elements.</p>
            
            <label>
                <input type="checkbox" ng-model="isVisible"> Toggle Visibility
            </label>
            
            <div class="demo-box" ng-show="isVisible" ng-class="{'visible-true': isVisible, 'visible-false': !isVisible}">
                <strong>ng-show="isVisible"</strong> - This element is shown when isVisible is true.
                <br>Element remains in DOM but has <code>display: none</code> when hidden.
            </div>
            
            <div class="demo-box" ng-hide="isVisible" ng-class="{'visible-true': !isVisible, 'visible-false': isVisible}">
                <strong>ng-hide="isVisible"</strong> - This element is shown when isVisible is false (opposite of ng-show).
            </div>
            
            <div class="dom-info">
                <strong>DOM Inspection:</strong> Both elements remain in the DOM. Check with F12 developer tools!
            </div>
        </div>

        <!-- Section 2: ng-if -->
        <div class="section">
            <h2>2. ng-if - Conditional DOM Manipulation</h2>
            <p>ng-if completely removes and recreates the element from the DOM.</p>
            
            <label>
                <input type="checkbox" ng-model="useNgIf"> Toggle ng-if (watch DOM changes)
            </label>
            
            <div class="demo-box dom-highlight" ng-if="useNgIf">
                <strong>ng-if="useNgIf"</strong> - This element is completely removed from DOM when false.
                <br>When shown again, it's recreated with a new scope.
                <br>Current time: {{ currentTime | date:'hh:mm:ss:sss' }}
            </div>
            
            <div class="dom-info">
                <strong>Important:</strong> ng-if creates a child scope! Watch how the time doesn't update continuously when hidden.
            </div>
        </div>

        <!-- Section 3: Performance Comparison -->
        <div class="section">
            <h2>3. Performance Comparison</h2>
            
            <label>
                <input type="checkbox" ng-model="showHeavyContent"> Show Heavy Content
            </label>
            
            <!-- ng-show version -->
            <div class="demo-box" ng-show="showHeavyContent">
                <strong>ng-show</strong> - This content is always in DOM, just hidden.
                <br>Heavy computation: {{ heavyComputation() }}
            </div>
            
            <!-- ng-if version -->
            <div class="demo-box" ng-if="showHeavyContent">
                <strong>ng-if</strong> - This content is only in DOM when needed.
                <br>Heavy computation: {{ heavyComputation() }}
            </div>
            
            <div class="dom-info">
                <strong>Performance Tip:</strong> Use ng-if for expensive components that don't need to run when hidden.
            </div>
        </div>

        <!-- Section 4: ng-class Basic Usage -->
        <div class="section">
            <h2>4. ng-class - Dynamic CSS Classes</h2>
            
            <h3>4.1 Boolean Conditions</h3>
            <label>
                <input type="checkbox" ng-model="isImportant"> Mark as Important
            </label>
            <label>
                <input type="checkbox" ng-model="isDone"> Mark as Completed
            </label>
            
            <div class="demo-box" ng-class="{highlight: isImportant, completed: isDone}">
                This element's classes change based on checkboxes.
                <br>Current classes: {{ isImportant ? 'highlight ' : '' }}{{ isDone ? 'completed' : '' }}
            </div>

            <h3>4.2 Multiple Conditions with Different Classes</h3>
            <select ng-model="status" ng-options="s for s in statusOptions"></select>
            
            <div class="demo-box" ng-class="{
                'success': status === 'success',
                'error': status === 'error', 
                'warning': status === 'warning'
            }">
                Status: {{ status }}
                <br>Applied class: {{ status }}
            </div>
        </div>

        <!-- Section 5: Advanced ng-class -->
        <div class="section">
            <h2>5. Advanced ng-class Usage</h2>
            
            <h3>5.1 Using Controller Methods</h3>
            <input type="number" ng-model="score" placeholder="Enter score (0-100)" min="0" max="100">
            
            <div class="demo-box" ng-class="getScoreClass(score)">
                Score: {{ score }}
                <br>Class determined by: {{ getScoreClass(score) }}
            </div>

            <h3>5.2 Array Syntax</h3>
            <label>
                <input type="checkbox" ng-model="useLargeText"> Large Text
            </label>
            <label>
                <input type="checkbox" ng-model="useRotation"> Rotated
            </label>
            
            <div class="demo-box" ng-class="[useLargeText ? 'large-text' : '', useRotation ? 'rotated' : '']">
                This uses array syntax for multiple conditional classes.
            </div>
        </div>

        <!-- Debug Section -->
        <div class="section">
            <h2>Current Scope State</h2>
            <pre>{{ {
                isVisible: isVisible,
                useNgIf: useNgIf,
                showHeavyContent: showHeavyContent,
                isImportant: isImportant,
                isDone: isDone,
                status: status,
                score: score,
                useLargeText: useLargeText,
                useRotation: useRotation
            } | json }}</pre>
        </div>
    </div>

    <script>
        angular.module('directivesApp', [])
        .controller('DirectivesController', function($scope) {
            // Initial values
            $scope.isVisible = true;
            $scope.useNgIf = true;
            $scope.showHeavyContent = false;
            $scope.isImportant = false;
            $scope.isDone = false;
            $scope.status = 'success';
            $scope.statusOptions = ['success', 'error', 'warning'];
            $scope.score = 85;
            $scope.useLargeText = false;
            $scope.useRotation = false;
            
            // Current time for demo
            $scope.currentTime = new Date();
            setInterval(function() {
                $scope.$apply(function() {
                    $scope.currentTime = new Date();
                });
            }, 100);
            
            // Heavy computation for performance demo
            $scope.heavyComputation = function() {
                // Simulate heavy computation
                let result = 0;
                for (let i = 0; i < 1000000; i++) {
                    result += Math.sqrt(i) * Math.random();
                }
                return result.toFixed(2);
            };
            
            // Method for ng-class
            $scope.getScoreClass = function(score) {
                if (score >= 90) return 'success';
                if (score >= 70) return 'warning';
                return 'error';
            };
        });
    </script>
</body>
</html>
```

## Key Differences Explained:

### ng-show vs ng-hide
- **ng-show**: Shows element when expression is `true` (uses `display: block`/`inline`)
- **ng-hide**: Shows element when expression is `false` (uses `display: none`)
- **Both**: Keep element in DOM, just change CSS display property
- **Use when**: You need to preserve element state or frequently toggle visibility

### ng-if
- **Completely removes** element from DOM when expression is `false`
- **Creates new scope** each time it's re-added to DOM
- **Better performance** for elements that are rarely shown or are computationally expensive
- **Use when**: You have heavy components or want to completely remove unused elements

### ng-class
- **Dynamically applies** CSS classes based on expressions
- **Three syntax options**:
  1. **Object syntax**: `{classname: expression, classname2: expression2}`
  2. **Array syntax**: `[expression1, expression2]` 
  3. **String syntax**: `"class1 class2"` (for simple cases)










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



# Understanding `ng-click` Directive in AngularJS

`ng-click` is one of the most commonly used AngularJS directives that allows you to execute functions or expressions when an element is clicked. It's essential for handling user interactions.

## Basic Example usage of `ng-click`

```html
<!DOCTYPE html>
<html ng-app="clickApp">
<head>
    <title>ng-click Examples</title>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .btn { padding: 10px 15px; margin: 5px; border: none; cursor: pointer; border-radius: 4px; }
        .primary { background: #007bff; color: white; }
        .danger { background: #dc3545; color: white; }
        .success { background: #28a745; color: white; }
        .counter { font-size: 24px; margin: 20px 0; padding: 10px; background: #f8f9fa; }
        .message { padding: 10px; margin: 10px 0; border: 1px solid #ddd; }
    </style>
</head>
<body ng-controller="ClickController">
    <div class="container">
        <h1>ng-click Directive Experiments</h1>

        <!-- Experiment 1: Basic Function Call -->
        <div class="section">
            <h2>1. Basic Function Call</h2>
            <button class="btn primary" ng-click="sayHello()">
                Click me to say hello!
            </button>
            <div class="message" ng-show="helloMessage">
                {{ helloMessage }}
            </div>
        </div>

        <!-- Experiment 2: Counter with Click -->
        <div class="section">
            <h2>2. Click Counter</h2>
            <div class="counter">
                Count: {{ clickCount }}
            </div>
            <button class="btn primary" ng-click="incrementCounter()">
                Increment (+1)
            </button>
            <button class="btn danger" ng-click="decrementCounter()">
                Decrement (-1)
            </button>
            <button class="btn success" ng-click="resetCounter()">
                Reset to 0
            </button>
        </div>

        <!-- Experiment 3: Direct Expression Evaluation -->
        <div class="section">
            <h2>3. Direct Expression Evaluation</h2>
            <button class="btn primary" ng-click="showAlert = !showAlert">
                Toggle Alert Message
            </button>
            <div class="message" ng-show="showAlert" style="background: #fff3cd; border-color: #ffeaa7;">
                This alert is shown by directly toggling a variable in ng-click!
            </div>
        </div>

        <!-- Experiment 4: Passing Parameters -->
        <div class="section">
            <h2>4. Passing Parameters to Functions</h2>
            <div>
                <button class="btn primary" ng-click="showUser('Alice', 25)">
                    Show Alice
                </button>
                <button class="btn primary" ng-click="showUser('Bob', 30)">
                    Show Bob
                </button>
                <button class="btn primary" ng-click="showUser('Charlie', 35)">
                    Show Charlie
                </button>
            </div>
            <div class="message" ng-if="currentUser">
                Selected: {{ currentUser.name }} (Age: {{ currentUser.age }})
            </div>
        </div>

        <!-- Experiment 5: Event Object and DOM Manipulation -->
        <div class="section">
            <h2>5. Accessing Event Object</h2>
            <button class="btn primary" ng-click="handleClick($event)">
                Click me and check console!
            </button>
            <div class="message">
                Last click position: X={{ clickX }}, Y={{ clickY }}
            </div>
        </div>

        <!-- Experiment 6: Toggle UI State -->
        <div class="section">
            <h2>6. Toggle UI Elements</h2>
            <button class="btn primary" ng-click="isExpanded = !isExpanded">
                {{ isExpanded ? 'Collapse' : 'Expand' }} Details
            </button>
            <div class="message" ng-show="isExpanded">
                <h3>Detailed Information</h3>
                <p>This content is shown/hidden using ng-click with a toggle variable.</p>
                <p>Current time: {{ currentTime | date:'medium' }}</p>
            </div>
        </div>

        <!-- Experiment 7: Multiple Actions -->
        <div class="section">
            <h2>7. Multiple Actions in One Click</h2>
            <button class="btn primary" ng-click="updateMultiple()">
                Perform Multiple Actions
            </button>
            <div class="message">
                <p>Action Count: {{ actionCount }}</p>
                <p>Last Action: {{ lastAction }}</p>
                <p>Timestamp: {{ lastTimestamp | date:'mediumTime' }}</p>
            </div>
        </div>

    </div>

    <script>
        angular.module('clickApp', [])
        .controller('ClickController', function($scope) {
            // Experiment 1
            $scope.helloMessage = '';
            $scope.sayHello = function() {
                $scope.helloMessage = 'Hello from AngularJS! Current time: ' + new Date().toLocaleTimeString();
            };

            // Experiment 2
            $scope.clickCount = 0;
            $scope.incrementCounter = function() {
                $scope.clickCount++;
            };
            $scope.decrementCounter = function() {
                $scope.clickCount--;
            };
            $scope.resetCounter = function() {
                $scope.clickCount = 0;
            };

            // Experiment 3
            $scope.showAlert = false;

            // Experiment 4
            $scope.currentUser = null;
            $scope.showUser = function(name, age) {
                $scope.currentUser = {
                    name: name,
                    age: age
                };
            };

            // Experiment 5
            $scope.clickX = 0;
            $scope.clickY = 0;
            $scope.handleClick = function(event) {
                $scope.clickX = event.clientX;
                $scope.clickY = event.clientY;
                console.log('Click event:', event);
                console.log('Button clicked at:', event.clientX, event.clientY);
            };

            // Experiment 6
            $scope.isExpanded = false;
            $scope.currentTime = new Date();

            // Experiment 7
            $scope.actionCount = 0;
            $scope.lastAction = '';
            $scope.lastTimestamp = null;
            $scope.updateMultiple = function() {
                $scope.actionCount++;
                $scope.lastAction = 'Multiple actions performed';
                $scope.lastTimestamp = new Date();
                $scope.currentTime = new Date(); // Also update experiment 6
            };

            // Update time every second for experiment 6
            setInterval(function() {
                $scope.$apply(function() {
                    $scope.currentTime = new Date();
                });
            }, 1000);
        });
    </script>
</body>
</html>
```

## Key Features of `ng-click`:

### 1. **Function Execution**
```html
<button ng-click="myFunction()">Click me</button>
```
Calls the `myFunction()` method defined in your controller.

### 2. **Direct Expression Evaluation**
```html
<button ng-click="isVisible = !isVisible">Toggle</button>
```
Can directly modify scope variables without needing a separate function.

### 3. **Passing Parameters**
```html
<button ng-click="deleteItem(item.id)">Delete</button>
```
Pass data from the view to the controller function.

### 4. **Accessing Event Object**
```html
<button ng-click="handleClick($event)">Click</button>
```
`$event` gives you access to the native DOM event object.

### 5. **Multiple Expressions**
```html
<button ng-click="function1(); function2()">Multiple actions</button>
```
Execute multiple expressions separated by semicolons.

## Best Practices:

1. **Keep click handlers simple** - delegate complex logic to services
2. **Use descriptive function names** for better code readability
3. **Avoid complex expressions** in `ng-click` - use controller methods instead
4. **Consider accessibility** - ensure clickable elements are keyboard accessible

## Common Use Cases:

- Form submissions
- Toggle UI states (show/hide elements)
- Increment/decrement counters
- Navigation actions
- Data manipulation (add/remove items from lists)
- Modal dialog triggers



<a style="padding:1em;border-radius:.2em;color:white;background-color:orange;font-weight:900;" href="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js" download="angular.min.js"> Download Angular for offline testing </a> 
