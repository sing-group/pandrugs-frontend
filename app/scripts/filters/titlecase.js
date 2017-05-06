'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:titlecase
 * @function
 * @description
 * # titlecase
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
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
