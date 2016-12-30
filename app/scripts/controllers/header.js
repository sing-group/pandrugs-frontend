'use strict';

/**
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the pandrugsFrontendApp
 */
angular.module('pandrugsFrontendApp')
  .controller('HeaderCtrl', ['user', '$scope', '$location', 'BACKEND', function (user, $scope, $location, BACKEND) {

    $scope.BACKEND = BACKEND;

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.getCurrentUser = function() {
      return user.getCurrentUser();
    };

    $scope.logout = function() {
      user.logout();
      $location.path('/');
    };

  }]);
