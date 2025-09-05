

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
