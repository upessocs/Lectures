
# Introduction to AngularJS Forms and Events

Welcome to Experiment 4! This lab is designed to help you understand how AngularJS handles forms, validation, and events. Forms are crucial for collecting user input in web applications, and AngularJS provides powerful tools to make form handling easier.

### Prerequisites
- Basic understanding of HTML forms
- Familiarity with JavaScript fundamentals
- Completion of previous AngularJS experiments (or basic understanding of controllers, modules, and data binding)

## Detailed Theory & Concepts

### 1. Two-Way Data Binding with `ng-model`
In traditional web development, you need to write code to both display data and update it when users interact with forms. AngularJS simplifies this with **two-way data binding** using `ng-model`.

- **What it does**: `ng-model` creates a connection between form elements (input, select, textarea) and AngularJS variables
- **Benefit**: When the user changes the form value, the variable updates automatically, and vice versa

### 2. Form Validation
AngularJS provides built-in validation and tracks the state of form elements:

- **`.$valid`**: Boolean indicating if all form validations pass
- **`.$dirty`**: Boolean indicating if the user has interacted with the field
- **`.$touched`**: Boolean indicating if the field has been focused and blurred
- **Built-in validators**:
  - `required`: Field must not be empty
  - `minlength`/`maxlength`: Text length constraints
  - `type="email"`: Validates email format
  - `ng-pattern`: Validates against a regular expression

### 3. Event Handling
AngularJS provides directives to handle user interactions:

- **`ng-click`**: Executes a function when an element is clicked
- **`ng-change`**: Executes a function when an input value changes
- **`ng-submit`**: Handles form submission with proper validation

## Step-by-Step Implementation Guide

### Part 1: User Registration Form

Let's create a detailed registration form with validation:

1. **Create the basic form structure**:
```html
<form name="regForm" novalidate ng-submit="register(regForm)">
  <!-- Form fields will go here -->
</form>
```
- `novalidate` disables browser default validation so we can use AngularJS validation
- `ng-submit` calls the register function when form is submitted

2. **Add name field with validation**:
```html
<label>Name
  <input type="text" name="name" ng-model="user.name" required ng-minlength="3">
</label>
<div class="error" ng-show="(regForm.name.$touched || submitted) && regForm.name.$error.required">
  Name is required.
</div>
<div class="error" ng-show="regForm.name.$error.minlength">
  Name must be at least 3 characters.
</div>
```

3. **Understanding the validation logic**:
- The error messages only show when:
  - The field is touched OR form was submitted AND
  - The specific validation error exists

4. **Complete the form with email and password fields** (similar pattern)

5. **Controller implementation**:
```javascript
$scope.register = function(form) {
  if (form.$valid) {
    // In real app, send data to server
    $scope.success = 'Registration successful for ' + $scope.user.name;
    $scope.user = {};
    form.$setPristine();  // Reset form state to pristine
    form.$setUntouched(); // Reset touched state
  } else {
    $scope.success = '';
    $scope.submitted = true; // Show validation messages
  }
};
```

### Part 2: Bill Payment Record (CRUD Application)

Let's create a simple bill tracking system:

1. **Initialize the data structure**:
```javascript
$scope.records = [
  { id: 1, name: 'Electricity', amount: 1200, date: '2025-07-01' },
  { id: 2, name: 'Internet', amount: 799, date: '2025-07-05' }
];
```

2. **Create the form to add new records**:
```html
<form name="billForm" ng-submit="addRecord(billForm)" novalidate>
  <label>Name: <input type="text" name="name" ng-model="newRecord.name" required></label>
  <label>Amount: <input type="number" name="amount" ng-model="newRecord.amount" required min="0"></label>
  <label>Date: <input type="date" name="date" ng-model="newRecord.date" required></label>
  <button type="submit" ng-disabled="billForm.$invalid">Add</button>
</form>
```
- `ng-disabled` prevents submission if form is invalid

3. **Implement the addRecord function**:
```javascript
$scope.addRecord = function(form) {
  if (form.$valid) {
    const newId = $scope.records.length ? 
                  Math.max.apply(null, $scope.records.map(r => r.id)) + 1 : 1;
    const clone = angular.copy($scope.newRecord);
    clone.id = newId;
    $scope.records.push(clone);
    $scope.newRecord = {};
    form.$setPristine();
    form.$setUntouched();
  }
};
```

4. **Display records in a table**:
```html
<tr ng-repeat="r in records">
  <td>{{r.id}}</td>
  <td>{{r.name}}</td>
  <td class="right">{{r.amount | currency : '₹'}}</td>
  <td>{{r.date}}</td>
  <td><button ng-click="remove(r)">Delete</button></td>
</tr>
```
- `ng-repeat` creates a table row for each record
- `currency` filter formats the amount as currency

5. **Implement delete functionality**:
```javascript
$scope.remove = function(r) {
  const idx = $scope.records.indexOf(r);
  if (idx > -1) $scope.records.splice(idx, 1);
};
```

6. **Calculate the total amount**:
```javascript
$scope.total = function() {
  return $scope.records.reduce((s, r) => s + Number(r.amount || 0), 0);
};
```

## Detailed Step-by-Step Instructions

### Setup:
1. Create a folder named `exp4`
2. Create three files: `app.js`, `registration.html`, and `bill-payment.html`
3. Copy the provided code into the respective files

### Testing the Registration Form:
1. Open `registration.html` in a web browser (served through a web server)
2. Try submitting the form without filling any fields - you should see validation messages
3. Test each validation rule:
   - Enter a 2-character name and see the error message
   - Enter an invalid email format
   - Enter a short password
4. Fill the form correctly and submit - you should see a success message
5. Notice how the form resets after successful submission

### Testing the Bill Payment App:
1. Open `bill-payment.html` in a browser
2. Try to add a record with missing fields - the Add button should be disabled
3. Add several valid records
4. Test the delete functionality by removing some records
5. Notice how the total amount updates automatically when you add or remove records

## Common Issues and Debugging Tips

1. **Form validation not working**:
   - Check that you've included `novalidate` in your form tag
   - Ensure all input fields have the `name` attribute

2. **Controller functions not being called**:
   - Verify your controller is properly defined in `app.js`
   - Check that the HTML file references the correct controller using `ng-controller`

3. **Data not displaying**:
   - Use AngularJS's `{{}}` syntax to output variables for debugging
   - Check browser console for JavaScript errors

## Enhanced Assessment Tasks

### Task 1: Edit Records in Bill Payment App
Extend the bill payment app to allow editing records:

1. Add an "Edit" button next to each record
2. When clicked, populate the form with the record's data
3. Change the Add button to say "Update" during editing
4. After updating, change back to "Add" mode

### Task 2: Persist Data with localStorage
Make the bill records persist across page refreshes:

1. In the controller, check if records exist in localStorage on initialization
2. Save records to localStorage whenever they change
3. Implement functions to load and save records:
```javascript
// Save to localStorage
localStorage.setItem('billRecords', JSON.stringify($scope.records));

// Load from localStorage
var savedRecords = localStorage.getItem('billRecords');
if (savedRecords) {
  $scope.records = JSON.parse(savedRecords);
}
```

## Learning Outcomes

By completing this experiment, you will understand:

1. How to create forms with AngularJS and implement validation
2. How to use two-way data binding with `ng-model`
3. How to handle user events with AngularJS directives
4. How to create a simple CRUD (Create, Read, Update, Delete) application
5. How to use AngularJS filters to format data

## Further Exploration

1. Try adding custom validation using `ng-pattern` with regular expressions
2. Experiment with different input types (checkbox, radio, select)
3. Add sorting and filtering capabilities to the bill records table
4. Create a custom filter to format dates in a more user-friendly way

- [AngularJS documentation for more details on form handling and validation:](https://docs.angularjs.org/guide/forms)

---
---

### exp4/app.js

```javascript
angular.module('exp4App', [])
  .controller('RegController', function($scope) {
    $scope.user = {};

    $scope.register = function(form) {
      if (form.$valid) {
        // In real app, send data to server
        $scope.success = 'Registration successful for ' + $scope.user.name;
        $scope.user = {};
        form.$setPristine();
        form.$setUntouched();
      } else {
        $scope.success = '';
        $scope.submitted = true;
      }
    };
  })
  .controller('BillController', function($scope) {
    $scope.records = [
      { id: 1, name: 'Electricity', amount: 1200, date: '2025-07-01' },
      { id: 2, name: 'Internet', amount: 799, date: '2025-07-05' }
    ];

    $scope.newRecord = {};

    $scope.addRecord = function(form) {
      if (form.$valid) {
        const newId = $scope.records.length ? Math.max.apply(null, $scope.records.map(r => r.id)) + 1 : 1;
        const clone = angular.copy($scope.newRecord);
        clone.id = newId;
        $scope.records.push(clone);
        $scope.newRecord = {};
        form.$setPristine();
        form.$setUntouched();
      }
    };

    $scope.remove = function(r) {
      const idx = $scope.records.indexOf(r);
      if (idx > -1) $scope.records.splice(idx, 1);
    };

    $scope.total = function() {
      return $scope.records.reduce((s, r) => s + Number(r.amount || 0), 0);
    };
  });
```

---

### exp4/registration.html

```html
<!doctype html>
<html ng-app="exp4App">
<head>
  <meta charset="utf-8">
  <title>Experiment 4 - Registration Form</title>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
  <script src="app.js"></script>
  <style>
    .error { color: #d9534f; }
    .success { color: #28a745; }
    label { display:block; margin-top:8px; }
  </style>
</head>
<body ng-controller="RegController">
  <h1>User Registration</h1>
  <form name="regForm" novalidate ng-submit="register(regForm)">

    <label>Name
      <input type="text" name="name" ng-model="user.name" required ng-minlength="3">
    </label>
    <div class="error" ng-show="(regForm.name.$touched || submitted) && regForm.name.$error.required">Name is required.</div>
    <div class="error" ng-show="regForm.name.$error.minlength">Name must be at least 3 characters.</div>

    <label>Email
      <input type="email" name="email" ng-model="user.email" required>
    </label>
    <div class="error" ng-show="(regForm.email.$touched || submitted) && regForm.email.$error.required">Email is required.</div>
    <div class="error" ng-show="regForm.email.$error.email">Enter a valid email.</div>

    <label>Password
      <input type="password" name="pwd" ng-model="user.pwd" required ng-minlength="6">
    </label>
    <div class="error" ng-show="(regForm.pwd.$touched || submitted) && regForm.pwd.$error.required">Password is required.</div>
    <div class="error" ng-show="regForm.pwd.$error.minlength">Password must be at least 6 characters.</div>

    <button type="submit">Register</button>
  </form>

  <p class="success" ng-if="success">{{success}}</p>
</body>
</html>
```

---

### exp4/bill-payment.html

```html
<!doctype html>
<html ng-app="exp4App">
<head>
  <meta charset="utf-8">
  <title>Bill Payment Record</title>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
  <script src="app.js"></script>
  <style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    .right { text-align: right; }
  </style>
</head>
<body ng-controller="BillController">
  <h1>Bill Payment Record</h1>

  <form name="billForm" ng-submit="addRecord(billForm)" novalidate>
    <label>Name: <input type="text" name="name" ng-model="newRecord.name" required></label>
    <label>Amount: <input type="number" name="amount" ng-model="newRecord.amount" required min="0"></label>
    <label>Date: <input type="date" name="date" ng-model="newRecord.date" required></label>
    <button type="submit" ng-disabled="billForm.$invalid">Add</button>
  </form>

  <h2>Records</h2>
  <table>
    <thead>
      <tr><th>ID</th><th>Name</th><th class="right">Amount</th><th>Date</th><th>Action</th></tr>
    </thead>
    <tbody>
      <tr ng-repeat="r in records">
        <td>{{r.id}}</td>
        <td>{{r.name}}</td>
        <td class="right">{{r.amount | currency : '₹'}}</td>
        <td>{{r.date}}</td>
        <td><button ng-click="remove(r)">Delete</button></td>
      </tr>
    </tbody>
  </table>

  <p>Total: {{ total() | currency : '₹' }}</p>
</body>
</html>
```

---

### Step-by-step Instructions (Exp 4)

1. Create `exp4` folder and add `app.js`, `registration.html`, and `bill-payment.html` as above.
2. Serve using a static server and open the registration page. Try submitting invalid values to see validation messages.
3. Open the bill payment page. Add several records and delete some. Check that the total updates.

**Hints**

* Use `form.$setPristine()` and `form.$setUntouched()` to reset validation states after successful submit.
* Date input type may behave differently across browsers; use a polyfill or plain text input for older browsers.
* For persistence across page reloads, save `records` to `localStorage` and load them on controller init (extra exercise).

**Assessment**

* Extend the bill payment app to allow editing a record in-place.
* Save and load records from `localStorage` so data persists.

