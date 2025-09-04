
# Experiment 4: Angular Forms and Events

**Objectives**

1. Create a user registration form and perform input validation using AngularJS.
2. Create an application for Bill Payment Record using AngularJS (simple CRUD in-memory).

**Theory & Concepts introduced**

* `ng-model`, `ng-submit`, `ng-disabled`, form `.$valid`, `.$dirty`, `.$touched`.
* Built-in validators: `required`, `minlength`, `maxlength`, `type=email`, `ng-pattern`.
* Two-way data binding.
* Handling events with `ng-click`, `ng-change`.

**Files to create**
`exp4/registration.html`
`exp4/bill-payment.html`
`exp4/app.js` (shared for simple apps)



### 1. The Magic of `ng-model` (Two-Way Data Binding)

Think of `ng-model` as a super-powered bridge between your HTML form and your JavaScript code.

*   **What it does:** It creates a live, two-way connection between an HTML input element (like a text box, checkbox, etc.) and a variable in your AngularJS controller.
*   **"Two-Way" means:**
    1.  **View to Model:** When a user types into an input field, the connected variable in your JavaScript automatically updates.
    2.  **Model to View:** If your JavaScript code changes the value of that variable, the text in the input field on the screen automatically updates to match.

**Analogy:** Imagine a Google Docs document. When you (the "view") type text, the document's data (the "model") is saved. If someone else edits the document from another computer, your screen ("view") updates instantly. That's two-way binding.

**Example:**
```html
<input type="text" ng-model="user.name">
<p>Hello, {{user.name}}!</p>
```
As you type in the input box, the `<p>` tag updates in real-time. No extra code needed!

---

### 2. Form Submission with `ng-submit`

This directive is a smarter way to handle form submissions compared to the standard HTML `onsubmit`.

*   **What it does:** It calls a function in your controller when the form is submitted.
*   **Why it's better:** It integrates perfectly with AngularJS's form validation. It will *prevent* the form from being submitted if the form is invalid, which is the behavior you almost always want.

**Example:**
```html
<form name="myForm" ng-submit="submitForm()">
  <input type="text" ng-model="user.email" required>
  <button type="submit">Save</button>
</form>
```
If the input is empty (and `required` fails), `submitForm()` will not be called, and the page won't reload.

---

### 3. Controlling Buttons with `ng-disabled`

This directive lets you easily enable or disable an HTML element (like a submit button) based on a condition.

*   **What it does:** It takes an expression. If the expression is `true`, the element is disabled (user can't click it). If `false`, it's enabled.
*   **Common Use:** Disabling the submit button until the entire form is valid. This gives users a clear visual cue that they need to fix errors.

**Example:**
```html
<button type="submit" ng-disabled="myForm.$invalid">Submit</button>
```
This button is greyed out and unclickable until all validations in the form named `myForm` pass.

---

### 4. Form Properties: `.$valid`, `.$dirty`, `.$touched`

AngularJS automatically gives your form and its input fields special properties to track their state. This is incredibly powerful for validation feedback.

*   **`formName.$valid` / `inputName.$valid`**
    *   **`true`** if ALL validation rules (e.g., `required`, `minlength`) on the form/field pass.
    *   **`false`** if ANY rule fails.

*   **`inputName.$dirty`**
    *   **`true`** if the user has **changed** the value of the input field (even just typing one character and deleting it).
    *   **`false`** if the field still has its original value (it's "pristine").

*   **`inputName.$touched`**
    *   **`true`** if the user has **focused on the field and then blurred away from it** (clicked/tabbed into it and then clicked/tabbed out).
    *   This is the best state to use for showing error messages. You don't want to show an error for an empty field the user hasn't even interacted with yet.

**Why these matter:** You use these properties to decide *when* to show error messages.
```html
<div class="error" ng-if="myForm.email.$touched && myForm.email.$invalid">
    Please enter a valid email.
</div>
```
This error message only shows up if the user has interacted with the field (`$touched`) and made it invalid.

---

### 5. Built-in Validators

These are attributes you add to your HTML inputs to define rules.

*   **`required`:** The field must not be empty.
*   **`minlength="5"`:** The input text must be at least 5 characters long.
*   **`maxlength="10"`:** The input text must be no more than 10 characters long.
*   **`type="email"`:** The input text must match a general email pattern (e.g., `name@domain.com`).
*   **`ng-pattern="/^[a-zA-Z]+$/"`:** The most powerful validator. It takes a Regular Expression to define a custom pattern (e.g., letters only, a specific phone number format, etc.).

AngularJS checks these rules and updates the `.$error` object on the field. For example, if a `required` field is empty, `myField.$error.required` will be `true`.

---

### 6. Handling Events: `ng-click` & `ng-change`

These directives are how you tell AngularJS to run your JavaScript functions in response to user actions.

*   **`ng-click`:**
    *   The most common event handler.
    *   Executes a function when an element is clicked.
    *   Used for buttons, links, divs, etc.
    *   **Example:**
        ```html
        <button ng-click="deleteItem(item)">Delete</button>
        ```

*   **`ng-change`:** (More specific)
    *   Executes a function when the value of an input element **changes**.
    *   It's like `ng-model` with an action attached.
    *   **Example:**
        ```html
        <input type="text" ng-model="searchQuery" ng-change="filterList()">
        ```
        As the user types in the search box, the `filterList()` function is called repeatedly, allowing you to create a live search feature.

### Summary Table

| Concept | What it does | Example Use |
| :--- | :--- | :--- |
| **`ng-model`** | Creates a live link between input field and JS data. | `<input ng-model="user.name">` |
| **`ng-submit`** | Handles form submission, respects validation. | `<form ng-submit="login()">` |
| **`ng-disabled`** | Enables/Disables an element based on a condition. | `<button ng-disabled="isInvalid">` |
| **`form.$valid`** | Is the entire form valid? (True/False) | `ng-if="myForm.$valid"` |
| **`field.$dirty`** | Has the user changed the field? | Show errors only if `$dirty` |
| **`field.$touched`** | Has the user focused and left the field? | **Best for showing errors.** |
| **`ng-click`** | Run function when element is clicked. | `<button ng-click="save()">` |
| **`ng-change`** | Run function when input value changes. | Live search on typing. |


