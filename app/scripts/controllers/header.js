'use strict';

/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
  .controller('HeaderCtrl', function ($scope) {
    $scope.isActive = function (viewLocation) {      
      return viewLocation === $location.path();
    };
  });
