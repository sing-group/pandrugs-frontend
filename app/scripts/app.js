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
		'ngStorage',
		'smart-table',
		'highcharts-ng',
		'smartArea',
		'angular-loading-bar'
	])
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
	.run(function($rootScope){
		$rootScope.keys = Object.keys;
	});
