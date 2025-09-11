# AngularJS Forms and Filters

## 1. Introduction

AngularJS (1.x) is a JavaScript framework that extends HTML with new attributes and bindings. Two important features are:

* **Forms & Validation** (with `ng-form`, `ng-model`, validation directives).
* **Filters** (for formatting and transforming data in the view).

---

## 2. AngularJS Forms

### 2.1 `ng-form`

* `ng-form` is used to **group input controls** and handle validation.
* It behaves like the normal HTML `<form>` but works seamlessly with AngularJS’s **validation states** (`$dirty`, `$pristine`, `$valid`, `$invalid`).
| **State**       | **Meaning**                                 | **When True?**                                                                 | **Example Use Case**                                    |
|:----|:----|:----|:----|
| **`$pristine`** | Input has **not been touched/changed** yet. | Initially true, becomes false once the user changes the field.                 | Show a "hint" only before user types something.         |
| **`$dirty`**    | Input has been **modified by the user**.    | Becomes true when user changes the value in the field.                         | Show warnings/errors only **after** user starts typing. |
| **`$valid`**    | Input value passes **all validations**.     | True if all validation rules (e.g., `required`, `ng-minlength`) are satisfied. | Enable the "Submit" button only when form is valid.     |
| **`$invalid`**  | Input value **fails validation**.           | True if any validation rule is broken.                                         | Show red error messages for invalid fields.             |



### 2.2 Common Directives for Forms

| Directive      | Purpose                                                   |
|:----|:----|
| `ng-model`     | Binds input field to a scope variable.                    |
| `required`     | Marks a field as required.                                |
| `ng-minlength` | Validates minimum length.                                 |
| `ng-maxlength` | Validates maximum length.                                 |
| `ng-pattern`   | Validates against a regex pattern.                        |
| `novalidate`   | Disables native HTML5 validation, lets Angular handle it. |
| `ng-disabled`  | Disables a button or input conditionally.                 |

---

### 2.3 Example: Form with Validation

```html
<!DOCTYPE html>
<html ng-app="formApp">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="FormController">

  <h2>Registration Form</h2>

  <form name="userForm" ng-submit="submitForm()" novalidate>

    <!-- Username -->
    <label>Username:</label>
    <input type="text" name="username" ng-model="user.username" required ng-minlength="3" />
    <span style="color:red" ng-show="userForm.username.$dirty && userForm.username.$error.required">* Required</span>
    <span style="color:red" ng-show="userForm.username.$error.minlength">* Minimum 3 characters</span>
    <br><br>

    <!-- Email -->
    <label>Email:</label>
    <input type="email" name="email" ng-model="user.email" required />
    <span style="color:red" ng-show="userForm.email.$error.required">* Required</span>
    <span style="color:red" ng-show="userForm.email.$error.email">* Invalid email</span>
    <br><br>

    <!-- Password -->
    <label>Password:</label>
    <input type="password" name="password" ng-model="user.password" ng-minlength="6" required />
    <span style="color:red" ng-show="userForm.password.$error.required">* Required</span>
    <span style="color:red" ng-show="userForm.password.$error.minlength">* Minimum 6 characters</span>
    <br><br>

    <!-- Submit -->
    <button type="submit" ng-disabled="userForm.$invalid">Register</button>

  </form>

  <p><b>Form Data:</b> {{ user | json }}</p>

  <script>
    angular.module('formApp', [])
      .controller('FormController', function($scope) {
        $scope.user = {};
        $scope.submitForm = function() {
          if ($scope.userForm.$valid) {
            alert("Form Submitted Successfully!");
          }
        };
      });
  </script>
</body>
</html>
```

**How it works**:

* The form is bound to `$scope.user`.
* AngularJS updates form states (`$dirty`, `$valid`, `$invalid`) automatically.
* Submit button is **disabled** until the form is valid.

---

## 3. AngularJS Filters

### 3.1 What are Filters?

* Filters format or transform data before displaying.
* They can be applied in templates, controllers, or services.

**Syntax:**

```html
{{ expression | filterName:parameter1:parameter2 }}
```

---

### 3.2 Common Built-in Filters

| Filter                    | Usage                        | Example                    |                               |
|:----|:----|:----|:----|
| `currency`                | Formats a number as currency | `{{ 2500                  pipe currency:"₹" }}` → ₹2,500.00 |
| `date`                    | Formats a date               | `{{ today                 pipe date:"dd/MM/yyyy" }}`        |
| `filter`                  | Filters arrays               | `ng-repeat="item in items pipe filter\:searchText"`         |
| `json`                    | Displays JSON                | `{{ obj                   pipe json }}`                     |
| `limitTo`                 | Limits number of items       | `{{ text                  pipe limitTo:10 }}`               |
| `lowercase` / `uppercase` | Converts text case           | `{{ "Hello"               pipe uppercase }}`                |
| `number`                  | Formats number with decimals | `{{ 12345.678             pipe number:2 }}` → 12,345.68     |
| `orderBy`                 | Orders an array              | `ng-repeat="item in items pipe orderBy:'name'"`             |

---

### 3.3 Example: Filters in Action

```html
<!DOCTYPE html>
<html ng-app="filterApp">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="FilterController">

  <h2>AngularJS Filters Demo</h2>

  <!-- Currency -->
  <p>Price: {{ 1500 | currency:"₹" }}</p>

  <!-- Date -->
  <p>Today: {{ today | date:"fullDate" }}</p>

  <!-- Uppercase/Lowercase -->
  <p>{{ "angularjs filters" | uppercase }}</p>

  <!-- LimitTo -->
  <p>Message Preview: {{ longMessage | limitTo:20 }}...</p>

  <!-- Filter & OrderBy with ng-repeat -->
  <h3>Student List</h3>
  <input type="text" ng-model="searchText" placeholder="Search by name...">
  <ul>
    <li ng-repeat="student in students | filter:searchText | orderBy:'age'">
      {{ student.name | uppercase }} - {{ student.age }} years
    </li>
  </ul>

  <script>
    angular.module('filterApp', [])
      .controller('FilterController', function($scope) {
        $scope.today = new Date();
        $scope.longMessage = "AngularJS makes it easy to format and display data with filters.";
        $scope.students = [
          { name: 'Alice', age: 22 },
          { name: 'Bob', age: 20 },
          { name: 'Charlie', age: 23 }
        ];
      });
  </script>
</body>
</html>
```

**How it works**:

* `currency` formats numbers.
* `date` formats date objects.
* `uppercase/lowercase` change case.
* `filter` + `orderBy` allow searching & sorting lists.

---

# 4. Summary

* **Forms (`ng-form`)**:

  * Enable validation (`required`, `ng-minlength`, etc.).
  * Use `$valid`, `$invalid`, `$dirty` to track form state.
  * `ng-model` binds form inputs to scope variables.

* **Filters**:

  * Transform and format data before display.
  * Common ones: `currency`, `date`, `uppercase/lowercase`, `filter`, `orderBy`.
  * Combine multiple filters in expressions.

---


## Practice Examples

## 1. Capitalize First Letter of Each Word

### Use Case: Formatting names, titles, or sentences neatly.

```html
<!DOCTYPE html>
<html ng-app="customFilterApp1">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="MainCtrl">

  <h2>Capitalize Filter Example</h2>
  <p>Original: {{ text }}</p>
  <p>Formatted: {{ text | capitalize }}</p>

  <script>
    angular.module('customFilterApp1', [])
      .controller('MainCtrl', function($scope) {
        $scope.text = "angularjs custom filters are useful";
      })
      .filter('capitalize', function() {
        return function(input) {
          if (!input) return '';
          return input.replace(/\b\w/g, function(char) {
            return char.toUpperCase();
          });
        };
      });
  </script>
</body>
</html>
```

Converts `"angularjs custom filters are useful"` → `"Angularjs Custom Filters Are Useful"`.

---

## 2. Mask Sensitive Data (like Credit Card)

### Use Case: Hide part of sensitive info for display.

```html
<!DOCTYPE html>
<html ng-app="customFilterApp2">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="MainCtrl">

  <h2>Mask Credit Card Filter</h2>
  <p>Original: {{ card }}</p>
  <p>Masked: {{ card | maskCard }}</p>

  <script>
    angular.module('customFilterApp2', [])
      .controller('MainCtrl', function($scope) {
        $scope.card = "1234567812345678";
      })
      .filter('maskCard', function() {
        return function(input) {
          if (!input) return '';
          return input.replace(/\d(?=\d{4})/g, "*");
        };
      });
  </script>
</body>
</html>
```

Shows `"1234567812345678"` → `"************5678"`.

---

## 3. Word Count Filter

### Use Case: Useful in blogs, essays, or comment sections.

```html
<!DOCTYPE html>
<html ng-app="customFilterApp3">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="MainCtrl">

  <h2>Word Count Filter</h2>
  <p>Text: "{{ message }}"</p>
  <p>Word Count: {{ message | wordCount }}</p>

  <script>
    angular.module('customFilterApp3', [])
      .controller('MainCtrl', function($scope) {
        $scope.message = "AngularJS makes filters simple to use";
      })
      .filter('wordCount', function() {
        return function(input) {
          if (!input) return 0;
          return input.trim().split(/\s+/).length;
        };
      });
  </script>
</body>
</html>
```

`"AngularJS makes filters simple to use"` → Word Count: `6`.

---

## 4. Range Filter (Filter Array by Number Range)

### Use Case: Filtering data like prices, ages, or ratings.

```html
<!DOCTYPE html>
<html ng-app="customFilterApp4">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="MainCtrl">

  <h2>Range Filter Example</h2>
  <p>All Ages: {{ ages }}</p>
  <p>Ages Between 18 and 30: {{ ages | range:18:30 }}</p>

  <script>
    angular.module('customFilterApp4', [])
      .controller('MainCtrl', function($scope) {
        $scope.ages = [12, 18, 21, 25, 30, 35, 40];
      })
      .filter('range', function() {
        return function(input, min, max) {
          if (!angular.isArray(input)) return input;
          return input.filter(function(num) {
            return num >= min && num <= max;
          });
        };
      });
  </script>
</body>
</html>
```

`[12, 18, 21, 25, 30, 35, 40]` → `[18, 21, 25, 30]`.

---

## 5. Percentage Filter

### Use Case: Display values as percentages in reports.

```html
<!DOCTYPE html>
<html ng-app="customFilterApp5">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="MainCtrl">

  <h2>Percentage Filter</h2>
  <p>Decimal: {{ score }}</p>
  <p>Percentage: {{ score | percentage:2 }}</p>

  <script>
    angular.module('customFilterApp5', [])
      .controller('MainCtrl', function($scope) {
        $scope.score = 0.8574;
      })
      .filter('percentage', function() {
        return function(input, decimals) {
          if (!input) return '0%';
          decimals = decimals || 0;
          return (input * 100).toFixed(decimals) + '%';
        };
      });
  </script>
</body>
</html>
```

`0.8574` → `"85.74%"`.

---

# Summary of Use Cases

1. **Capitalize** → Neatly format names/titles.
2. **MaskCard** → Protect sensitive data.
3. **WordCount** → Show stats in blog/comments.
4. **Range** → Filter lists like ages, prices.
5. **Percentage** → Display scores/reports cleanly.

---

# Chaining Filters

In AngularJS, you can **chain multiple filters** by separating them with the pipe symbol `|`.
The output of one filter becomes the input of the next.



### Example: Chaining Filters

```html
<!DOCTYPE html>
<html ng-app="chainApp">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.3/angular.min.js"></script>
</head>
<body ng-controller="MainCtrl">

  <h2>Chaining Filters Example</h2>

  <p>Original: {{ message }}</p>
  <p>Chained: {{ message | uppercase | limitTo:15 }}</p>
  <p>Price: {{ price | currency:"₹" | limitTo:6 }}</p>
  <p>Date: {{ today | date:"fullDate" | uppercase }}</p>

  <script>
    angular.module('chainApp', [])
      .controller('MainCtrl', function($scope) {
        $scope.message = "AngularJS chaining filters is powerful";
        $scope.price = 123456.789;
        $scope.today = new Date();
      });
  </script>
</body>
</html>
```


### What Happens Here

* `{{ message | uppercase | limitTo:15 }}`
  → Converts to uppercase, then trims to 15 characters.
* `{{ price | currency:"₹" | limitTo:6 }}`
  → Formats number as currency, then shortens the string.
* `{{ today | date:"fullDate" | uppercase }}`
  → Formats date, then makes it uppercase.

