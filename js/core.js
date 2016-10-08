var CONSTS = {
  "api": "http://localhost:3000"
}

// Toastr config
toastr.options = {
  "closeButton": false,
  "newestOnTop": false,
  "progressBar": true,
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

var todoApp = angular.module("todoApp", ['ngRoute', 'ng-token-auth', 'ipCookie']);
todoApp.config(function($routeProvider){
  $routeProvider
  .when("/login", {
    templateUrl: "login.html"
  })
  .when("/signup", {
    templateUrl: "signup.html"
  })
  .when("/index", {
    templateUrl: "main.html"
  })
  .when("/logout", {
    templateUrl: "logout.html"
  })
  .otherwise({
    templateUrl: "main.html"
  })
})

todoApp.config(function($authProvider){
  $authProvider.configure({
      apiUrl: CONSTS.api,
      storage: 'localStorage'
  });
});

todoApp.controller('loginCtrl', function($scope, $rootScope, $auth, $location){
  $scope.submitLogin = function(){
    $auth.submitLogin($scope.loginForm)
    .then(function(resp) {
      if (resp.uid != undefined && resp.signedIn == true) {
        toastr.success("Successfully logged in!");
      }
    })
    .catch(function(resp) {
      toastr.error("Oops! " + resp.errors.join('<br/>'));
    });
  };

  $rootScope.$on('auth:login-success', function(ev, user) {
      $rootScope.user = user;
      $rootScope.isLoggedIn = true;
      $location.path('/index')
  });
});

todoApp.controller('signupCtrl', function($scope, $auth) {
  $scope.submitRegistration = function() {
    $auth.submitRegistration($scope.registrationForm)
    .then(function(resp) {
      if (resp.status == 200) {
        toastr.success("Signup successful. Please login now!");
      }
    })
    .catch(function(resp) {
      toastr.error("Oops! " + resp.data.errors.full_messages.join('<br/>'));
    });
  };
});

todoApp.controller('todoCtrl', function($scope, $http, $rootScope, $auth) {
  $http.get(CONSTS.api + '/')
  .then(function(response) {
    if (angular.isArray(response.data)) {
      $scope.todoLists = response.data;
    } else {
      toastr.error("Oops! Cannot get the TodoLists!");
    }
  });
});

todoApp.controller('logoutCtrl', function($auth) {
  $auth.signOut()
  .then(function(resp) {
    if (resp.status == 200) {
      toastr.success("Successullly logged out!");
    }
  })
  .catch(function(resp) {
    toastr.error("Oops! " + resp.data.errors.full_messages.join('<br/>'));
  });
});
