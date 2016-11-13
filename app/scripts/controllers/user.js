'use strict';

/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
  .controller('UserCtrl', ['user', '$scope', '$location',
                          function (user, $scope, $location) {

    $scope.doLogin = function() {
      user.login(
        $scope.login,
        $scope.password,
        function() { $location.path('/')},
        function() {alert("error");}
      );
    }

    $scope.currentUser = function() {
      return user.getCurrentUser();
    }

    $scope.logout = function() {
      user.logout();
    }

  }]);
