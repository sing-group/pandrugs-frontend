'use strict';

/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
  .controller('HeaderCtrl', ['user', '$scope', '$location', function (user, $scope, $location) {
    
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.getCurrentUser = function() {
      return user.getCurrentUser();
    };

    $scope.logout = function() {
      user.logout();
      $location.path("/");
    }

  }]);
