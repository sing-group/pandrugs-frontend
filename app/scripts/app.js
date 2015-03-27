'use strict';

/**
 * @ngdoc overview
 * @name pandrugsdbFrontendApp
 * @description
 * # pandrugsdbFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('pandrugsdbFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'smart-table',
    'highcharts-ng'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/query', {
        templateUrl: 'views/query.html',
        controller: 'QueryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).controller('HeaderCtrl', function ($scope, $location) {    
    $scope.isActive = function (viewLocation) {      
      return viewLocation === $location.path();
    };
  });
