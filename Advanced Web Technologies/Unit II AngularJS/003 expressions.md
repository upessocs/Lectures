
---

AngularJS Expressions
---------------------

---

AngularJS binds data to HTML using **Expressions**.

---
# AngularJS Expressions

---

AngularJS Expressions
---------------------

AngularJS expressions can be written inside double braces: `{{ _expression_ }}`.

AngularJS expressions can also be written inside a directive: `ng-bind="_expression_"`.

AngularJS will resolve the expression, and return the result exactly where the expression is written.

**AngularJS expressions** are much like **JavaScript expressions:** They can contain literals, operators, and variables.

Example {{ 5 + 5 }} or {{ firstName + " " + lastName }}

### Example
```html
<!DOCTYPE html>  
<html>  
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>  
<body>

<div ng-app="">  
  <p>My first expression: {{ 5 + 5 }}</p>  
</div>

</body>  
</html>
```


If you remove the `ng-app` directive, HTML will display the expression as it is, without solving it:

### Example
```html
<!DOCTYPE html>  
<html>  
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>  
<body>

<div>  
  <p>My first expression: {{ 5 + 5 }}</p>  
</div>

</body>  
</html>
```


You can write expressions wherever you like, AngularJS will simply resolve the expression and return the result.

Example: Let AngularJS change the value of CSS properties.

Change the color of the input box below, by changing its value:

### Example
```html
<div ng-app="" ng-init="myCol='lightblue'">

<input style="background-color:{{myCol}}" ng-model="myCol">

</div>
```



---

AngularJS Numbers
-----------------

AngularJS numbers are like JavaScript numbers:

### Example
```html
<div ng-app="" ng-init="quantity=1;cost=5">

<p>Total in dollar: {{ quantity \* cost }}</p>

</div>
```


Same example using `ng-bind`:

### Example
```html
<div ng-app="" ng-init="quantity=1;cost=5">

<p>Total in dollar: <span ng-bind="quantity \* cost"></span></p>

</div>
```


Using `ng-init` is not very common. You will learn a better way to initialize data in the chapter about controllers.

---

AngularJS Strings
-----------------

AngularJS strings are like JavaScript strings:

### Example
```html
<div ng-app="" ng-init="firstName='John';lastName='Doe'">

<p>The name is {{ firstName + " " + lastName }}</p>

</div>
```


Same example using `ng-bind`:

### Example
```html
<div ng-app="" ng-init="firstName='John';lastName='Doe'">

<p>The name is <span ng-bind="firstName + ' ' + lastName"></span></p>

</div>
```


---

AngularJS Objects
-----------------

AngularJS objects are like JavaScript objects:

### Example
```html
<div ng-app="" ng-init="person={firstName:'John',lastName:'Doe'}">

<p>The name is {{ person.lastName }}</p>

</div>
```


Same example using `ng-bind`:

### Example
```html
<div ng-app="" ng-init="person={firstName:'John',lastName:'Doe'}">

<p>The name is <span ng-bind="person.lastName"></span></p>

</div>
```


---

AngularJS Arrays
----------------

AngularJS arrays are like JavaScript arrays:

### Example
```html
<div ng-app="" ng-init="points=[1,15,19,2,40]">

<p>The third result is {{ points[2] }}</p>

</div>
```


Same example using `ng-bind`:

### Example
```html
<div ng-app="" ng-init="points=[1,15,19,2,40]">

<p>The third result is <span ng-bind="points[2]"></span></p>

</div>
```


---

AngularJS Expressions vs. JavaScript Expressions
------------------------------------------------

Like JavaScript expressions, AngularJS expressions can contain literals, operators, and variables.

Unlike JavaScript expressions, AngularJS expressions can be written inside HTML.

AngularJS expressions do not support conditionals, loops, and exceptions, while JavaScript expressions do.

AngularJS expressions support filters, while JavaScript expressions do not.


---
# AngularJS Modules

AngularJS Modules
-----------------

---

An AngularJS module defines an application.

The module is a container for the different parts of an application.

The module is a container for the application controllers.

Controllers always belong to a module.

---

Creating a Module
-----------------

A module is created by using the AngularJS function `angular.module`
```html
<div ng-app="myApp">...</div>

<script>var app = angular.module("myApp", []); </script>
```
The "myApp" parameter refers to an HTML element in which the application will run.

Now you can add controllers, directives, filters, and more, to your AngularJS application.

---

Adding a Controller
-------------------

Add a controller to your application, and refer to the controller with the `ng-controller` directive:

### Example
```html
<div ng-app="**myApp**" ng-controller=**"myCtrl"**>  
{{ firstName + " " + lastName }}  
</div>

<script>

var app = angular.module(**"myApp"**, []);

app.controller(**"myCtrl"**, function($scope) {  
  $scope.firstName = "John";  
  $scope.lastName = "Doe";  
});

</script>
```





---

Adding a Directive
------------------

AngularJS has a set of built-in directives which you can use to add functionality to your application.

For a full reference, visit our [AngularJS directive reference](https://www.w3schools.com/angular/angular_ref_directives.asp).

In addition you can use the module to add your own directives to your applications:

### Example
```html
<div ng-app="myApp" w3-test-directive></div>

<script>  
var app = angular.module("myApp", []);

app.directive("w3TestDirective", function() {  
  return {  
    template : "I was made in a directive constructor!"  
  };  
});

</script>
```


You will learn more about directives later in this tutorial.

---

Modules and Controllers in Files
--------------------------------

It is common in AngularJS applications to put the module and the controllers in JavaScript files.

In this example, "myApp.js" contains an application module definition, while "myCtrl.js" contains the controller:

### Example
```html
<!DOCTYPE html>  
<html>  
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>  
<body>

<div ng-app="**myApp**" ng-controller="**myCtrl**">  
{{ firstName + " " + lastName }}  
</div>

<script src="**myApp.js**"></script>  
<script src="**myCtrl.js**"></script>

</body>  
</html>
```


### myApp.js
```js
var app = angular.module(**"myApp"**, []);

The [] parameter in the module definition can be used to define dependent modules.

Without the [] parameter, you are not _creating_ a new module, but _retrieving_ an existing one.

### myCtrl.js

app.controller(**"myCtrl"**, function($scope) {  
  $scope.firstName = "John";  
  $scope.lastName= "Doe";  
});
```
---

Functions can Pollute the Global Namespace
------------------------------------------

Global functions should be avoided in JavaScript. They can easily be overwritten or destroyed by other scripts.

AngularJS modules reduces this problem, by keeping all functions local to the module.

---

When to Load the Library
------------------------

While it is common in HTML applications to place scripts at the end of the `<body>` element, it is recommended that you load the AngularJS library either in the `<head>` or at the start of the `<body>`.

This is because calls to `angular.module` can only be compiled after the library has been loaded.

### Example
```html
<!DOCTYPE html>  
<html>  
<body>  
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>

<div ng-app="myApp" ng-controller="myCtrl">  
{{ firstName + " " + lastName }}  
</div>

<script>  
var app = angular.module("myApp", []);  
app.controller("myCtrl", function($scope) {  
  $scope.firstName = "John";  
  $scope.lastName = "Doe";  
});  
</script>

</body>  
</html>
```


  