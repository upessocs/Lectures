AngularJS ng-model Directive
----------------------------

---

The ng-model directive binds the value of HTML controls (input, select, textarea) to application data.

---

The ng-model Directive
----------------------

With the `ng-model` directive you can bind the value of an input field to a variable created in AngularJS.

### Example

<div ng-app="myApp" ng-controller="myCtrl">  
  Name: <input ng-model="name">  
</div>

<script>  
var app = angular.module('myApp', []);  
app.controller('myCtrl', function($scope) {  
  $scope.name = "John Doe";  
});  
</script>



---

Two-Way Binding
---------------

The binding goes both ways. If the user changes the value inside the input field, the AngularJS property will also change its value:

### Example

<div ng-app="myApp" ng-controller="myCtrl">  
  Name: <input ng-model="name">  
  <h1>You entered: {{name}}</h1>  
</div>  



---

---

Validate User Input
-------------------

The `ng-model` directive can provide type validation for application data (number, e-mail, required):

### Example

<form ng-app="" name="myForm">  
  Email:  
  <input type="email" name="myAddress" ng-model="text">  
  <span ng-show="myForm.myAddress.$error.email">Not a valid e-mail address</span>  
</form>  



In the example above, the span will be displayed only if the expression in the `ng-show` attribute returns `true`.

If the property in the `ng-model` attribute does not exist, AngularJS will create one for you.

---

Application Status
------------------

The `ng-model` directive can provide status for application data (valid, dirty, touched, error):

### Example

<form ng-app="" name="myForm" ng-init="myText = 'post@myweb.com'">  
  Email:  
  <input type="email" name="myAddress" ng-model="myText" required>  
  <h1>Status</h1>  
  {{myForm.myAddress.$valid}}  
  {{myForm.myAddress.$dirty}}  
  {{myForm.myAddress.$touched}}  
</form>  



---

CSS Classes
-----------

The `ng-model` directive provides CSS classes for HTML elements, depending on their status:

### Example

<style>  

input.ng-invalid {  background-color: lightblue;}  

</style>  
<body>

<form ng-app="" name="myForm">  
  Enter your name:  
  <input name="myName" ng-model="myText" required>  
</form>



The `ng-model` directive adds/removes the following classes, according to the status of the form field:

*   ng-empty
*   ng-not-empty
*   ng-touched
*   ng-untouched
*   ng-valid
*   ng-invalid
*   ng-dirty
*   ng-pending
*   ng-pristine

  

[★ +1](https://profile.w3schools.com/log-in?redirect_url=https%3A%2F%2Fwww.w3schools.com%2Fangular%2Fangular_model.asp "Your W3Schools Profile")

Track your progress - it's free!

   [![Get Certified](W3Schools.com/img_academy_up_angular_300.png)](https://www.w3schools.com/academy/index.php)