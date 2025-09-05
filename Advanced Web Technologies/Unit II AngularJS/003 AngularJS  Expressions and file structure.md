
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

<p>Total in dollar: {{ quantity * cost }}</p>

</div>
```


Same example using `ng-bind`:

### Example
```html
<div ng-app="" ng-init="quantity=1;cost=5">

<p>Total in dollar: <span ng-bind="quantity * cost"></span></p>

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

# AngularJS Project Organization and file structure

Modules and Controllers in Files
--------------------------------

It is common in AngularJS applications to put the module and the controllers in JavaScript files.

In this example, "myApp.js" contains an application module definition, while "myCtrl.js" contains the controller:

### Example
```html
<!DOCTYPE html>  
<html>  
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
  </head>
  <body>
    <div ng-app="myApp" ng-controller="myCtrl">  
      {{ firstName + " " + lastName }}  
    </div>
    <script src="myApp.js"></script>  
    <script src="myCtrl.js"></script>
  </body>  
</html>
```


### myApp.js
```js
var app = angular.module("myApp", []);
```
//The [] parameter in the module definition can be used to define dependent modules.
//Without the [] parameter, you are not _creating_ a new module, but _retrieving_ an existing one.


### myCtrl.js
```js
app.controller(**"myCtrl"**, function($scope) {  
  $scope.firstName = "John";  
  $scope.lastName= "Doe";  
});
```
---

Functions can Pollute the Global Namespace
------------------------------------------

> Global functions should be avoided in JavaScript. They can easily be overwritten or destroyed by other scripts.

> AngularJS modules reduces this problem, by keeping all functions local to the module.


<a style="padding:1em;border-radius:.2em;color:white;background-color:orange;font-weight:900;" href="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js" download="angular.min.js"> Download Angular for offline testing </a> 


  