var CONSTS = {
  api: "/api",
  sessionExpiryMessage: "Your session was expired. Please login again!",
  debugmode: false
}

toastr.options = {
  "closeButton": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

var todoApp = angular.module("todoApp", ['ngRoute', 'ng-token-auth', 'ipCookie', 'ngResource']);
todoApp.config(function($routeProvider){
  $routeProvider
  .when("/login", {
    templateUrl: "login.html"
  })
  .when("/signup", {
    templateUrl: "signup.html"
  })
  .when("/index", {
    templateUrl: "_main.html"
  })
  .when("/logout", {
    templateUrl: "logout.html"
  })
  .otherwise({
    templateUrl: "_main.html"
  })
})

todoApp.config(function($authProvider){
  $authProvider.configure({
      apiUrl: CONSTS.api,
      storage: 'localStorage'
  });
});

angular.module('todoApp').factory('TodoItem', function($resource) {
  return $resource(CONSTS.api + '/todos/:id', { id: '@id' }, {
      update: {
        method: 'PUT'
      }
    });
});

todoApp.controller('loginCtrl', function($scope, $rootScope, $auth, $location){
  $(".nav").find(".active").removeClass("active");
  $("#loginNav").addClass("active");
  $scope.navigateToSignup = function() {
    $location.path('/signup');
  };
  $scope.submitLogin = function(){
    $auth.submitLogin($scope.loginForm)
    .then(function(resp) {
      if (resp.uid != undefined && resp.signedIn == true) {
        toastr.success("Successfully logged in!");
        $("#publicNav").hide();
        $("#userNav").show();
        $(".nav").find(".active").removeClass("active");
        $("#homeNav").show().find("li").addClass("active");
      }
    })
    .catch(function(resp) {
      toastr.error("Oops! " + resp.errors.join('<br/>'));
    });
  };

  $rootScope.$on('auth:login-success', function(ev, user) {
      $location.path('/index')
  });
});

todoApp.controller('signupCtrl', function($scope, $auth, $location) {
  $(".nav").find(".active").removeClass("active");
  $("#signupNav").addClass("active");
  $scope.navigateToLogin = function() {
    $location.path('/login');
  };
  $scope.submitRegistration = function() {
    $auth.submitRegistration($scope.registrationForm)
    .then(function(resp) {
      if (resp.status == 200) {
        toastr.success("Signup successful. Please login now!");
        $location.path("/login");
      }
    })
    .catch(function(resp) {
      toastr.error("Oops! " + resp.data.errors.full_messages.join('<br/>'));
    });
  };
});

todoApp.controller('todoCtrl', function($scope, $http, $auth, $location, $rootScope, $resource, TodoItem) {
  if (CONSTS.debugmode) {
    console.log($auth.retrieveData('auth_headers'));
  }

  if ($auth.retrieveData('auth_headers') == null) {
    toastr.error(CONSTS.sessionExpiryMessage);
    $location.path('/login');
  } else {
    $("#publicNav").hide();
    $("#userNav").show();
    $(".nav").find(".active").removeClass("active");
    $("#homeNav").show().find("li").addClass("active");
  }

  $scope.todoLists = TodoItem.query();

  $scope.addTodo = function(todoItem) {
    if (todoItem) {
      newItem = new TodoItem();
      newItem.name = todoItem.name;
      newItem.completed = false;
      $scope.todoLists.push(TodoItem.save(newItem));
      $scope.todoItem = "";
    }
  }

  $scope.toggleCompletion = function(todoItem) {
    updateItem = new TodoItem();
    updateItem = todoItem;
    if (todoItem.completed) {
      updateItem.completed = false;
    } else {
      updateItem.completed = true;
    }
    updateItem.$update();
  }

  $scope.removeTodo = function(todoItem) {
    var index = $scope.todoLists.indexOf(todoItem);
    if (index >= 0) {
      $scope.todoLists.splice(index, 1);
      removeItem = new TodoItem();
      removeItem = todoItem;
      removeItem.$delete();
    }
  }
});

todoApp.controller('logoutCtrl', function($auth, $rootScope, $location) {
  $auth.signOut()
  .then(function(resp) {
    if (resp.status == 200) {
      toastr.success("Successullly logged out!");
      $("#publicNav").show();
      $("#userNav").hide();
      $location.path('/login')
    }
  })
});
