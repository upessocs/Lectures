
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


<a style="padding:1em;border-radius:.2em;color:white;background-color:orange;font-weight:900;" href="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js" download="angular.min.js"> Download Angular for offline testing </a> 
