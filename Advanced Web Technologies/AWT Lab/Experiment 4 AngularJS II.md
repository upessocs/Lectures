
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

