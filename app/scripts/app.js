/*
 * PanDrugs Frontend
 *
 * Copyright (C) 2015 - 2017 Fátima Al-Shahrour, Elena Piñeiro,
 * Daniel Glez-Peña and Miguel Reboiro-Jato
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 */
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
    //var server = 'http://www.pandrugs.org';
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
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'UserCtrl'
      })
      .when('/query/', {
        templateUrl: 'views/query.html',
        controller: 'QueryCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data):/);

  }])
  .run(function($rootScope, $location, $anchorScroll){
    $rootScope.keys = Object.keys;

    //when the route is changed scroll to the proper element.
    $rootScope.$on('$routeChangeSuccess', function() {
      if($location.hash()) {
        $anchorScroll();
      }
    });
  });
