
// AngularJS 1.x To-Do with localStorage persistence
// Compared to jQuery/Vanilla: we mutate data, template updates UI automatically.
(function () {
  var app = angular.module("todoApp", []);

  app.controller("TodoCtrl", ["$scope", function ($scope) {
    var STORAGE_KEY = "tasks-angular";
    function load() {
      try { $scope.tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
      catch (e) { $scope.tasks = []; }
    }
    function save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify($scope.tasks));
    }

    $scope.tasks = [];
    $scope.newTask = "";

    $scope.addTask = function () {
      if (!$scope.newTask) return;
      $scope.tasks.push({ text: $scope.newTask, done: false });
      $scope.newTask = "";
      save();
    };
    $scope.remove = function (i) { $scope.tasks.splice(i, 1); save(); };
    $scope.toggle = function (i) { $scope.tasks[i].done = !$scope.tasks[i].done; save(); };

    // Keep storage in sync if tasks change elsewhere
    $scope.$watch("tasks", save, true);

    load();
  }]);
})();
