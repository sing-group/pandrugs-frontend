'use strict';

/**
 * @ngdoc filter
 * @name pandrugsdbFrontendApp.filter:titlecase
 * @function
 * @description
 * # titlecase
 * Filter in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
	.filter('titlecase', function () {
		return function (input) {			
			var lowercase = input.toLowerCase();
			var tokens = lowercase.split(' ');
			var titlecase = '';			
			for (var i = 0; i < tokens.length; i++ ) {
	if (tokens[i].length > 0) {
		titlecase += tokens[i].charAt(0).toUpperCase() + tokens[i].substring(1)+ ' ';
	}
			}
			return titlecase.trim();
		};
	});
