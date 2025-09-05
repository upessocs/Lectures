AngularJS Data Binding
----------------------

---

Data binding in AngularJS is the synchronization between the model and the view.

---

Data Model
----------

AngularJS applications usually have a data model. The data model is a collection of data available for the application.

### Example

var app = angular.module('myApp', []);  
app.controller('myCtrl', function($scope) {  
  $scope.firstname = "John";  
  $scope.lastname = "Doe";  
});  

---

HTML View
---------

The HTML container where the AngularJS application is displayed, is called the view.

The view has access to the model, and there are several ways of displaying model data in the view.

You can use the `ng-bind` directive, which will bind the innerHTML of the element to the specified model property:

You can also use double braces `{{ }}` to display content from the model:

Or you can use the `ng-model` directive on HTML controls to bind the model to the view.

---

---

The `ng-model` Directive
------------------------

Use the `ng-model` directive to bind data from the model to the view on HTML controls (input, select, textarea)

The `ng-model` directive provides a two-way binding between the model and the view.

---

Two-way Binding
---------------

Data binding in AngularJS is the synchronization between the model and the view.

When data in the _model_ changes, the _view_ reflects the change, and when data in the _view_ changes, the _model_ is updated as well. This happens immediately and automatically, which makes sure that the model and the view is updated at all times.

### Example

<div ng-app="myApp" ng-controller="myCtrl">  
  Name: <input ng-model="firstname">  
  <h1>{{firstname}}</h1>  
</div>

<script>

var app = angular.module('myApp', []);  
app.controller('myCtrl', function($scope) {  
  $scope.firstname = "John";  
  $scope.lastname = "Doe";  
});

</script>

---

AngularJS Controller
--------------------

Applications in AngularJS are controlled by controllers. Read about controllers in the [AngularJS Controllers](https://www.w3schools.com/angular/angular_controllers.asp) chapter.

Because of the immediate synchronization of the model and the view, the controller can be completely separated from the view, and simply concentrate on the model data. Thanks to the data binding in AngularJS, the view will reflect any changes made in the controller.

### Example

<div ng-app="myApp" ng-controller="myCtrl">  
  <h1 ng-click="changeName()">{{firstname}}</h1>  
</div>

<script>

var app = angular.module('myApp', []);  
app.controller('myCtrl', function($scope) {  
  $scope.firstname = "John";  
  $scope.changeName = function() {  
    $scope.firstname = "Nelly";  
  }  
});  

</script>
