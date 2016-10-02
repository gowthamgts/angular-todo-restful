var todoApp = angular.module("todoApp", ['ngRoute']);
todoApp.controller('todoCtrl', function($scope) {
  $scope.username = "";
  $scope.password = "";
  $scope.login = function() {
    console.log($scope.username);
    console.log($scope.password);
  }
});
todoApp.config(function($routeProvider){
  $routeProvider
  .when("/login", {
    templateUrl: "login.html"
  })
  .when("/signup", {
    templateUrl: "signup.html"
  })
  .otherwise({
    templateUrl: "main.html"
  })
})

todoApp.controller('loginCtrl', function($scope) {
  $scope.login = function() {
    if ($scope.username && $scope.password) {
      // send it to the server
    }
  }
})
