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
  .config(['databaseProvider', '$routeProvider', function (databaseProvider, $routeProvider) {
    databaseProvider.useMock(false);
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
      .when('/queryMenu', {
        templateUrl: 'views/querymenu.html',
        controller: 'QuerymenuCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
