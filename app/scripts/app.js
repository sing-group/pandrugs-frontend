'use strict';

/**
 * @ngdoc overview
 * @name pandrugsFrontendApp
 * @description
 * # pandrugsFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('pandrugsFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'smart-table',
    'highcharts-ng',
    'smartArea',
    'listGroup',
    'angular-loading-bar',
    'ngSanitize'
  ])
  .constant('BACKEND', (function() {
    // Service logic
    // ...
    //var server = 'http://pandrugs.bioinfo.cnio.es';
    //var server = 'http://sing.ei.uvigo.es';
    //var server = 'http://mrjato.sing-group.org:8080'; // development: test server
    //var server = 'http://0.0.0.0:9000'; // development: via grunt reverse proxy to local backend
    var server = ''; // the server is in this machine (e.g.: docker distribution)
    var app = server + '/pandrugs-backend/';

    return {
      SERVER: server,
      APP: app,
      API: app + 'api/'
    };
  })())
  .config(['databaseProvider', '$routeProvider', '$compileProvider', function (databaseProvider, $routeProvider, $compileProvider) {
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
      .when('/help/', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'UserCtrl'
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
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);

  }])
  .run(function($rootScope, $location, $anchorScroll){
    $rootScope.keys = Object.keys;

    //when the route is changed scroll to the proper element.
    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      if($location.hash()) $anchorScroll();
    });
  });
