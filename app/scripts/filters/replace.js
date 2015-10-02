'use strict';

/**
 * @ngdoc filter
 * @name pandrugsdbFrontendApp.filter:replace
 * @function
 * @description
 * # replace
 * Filter in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .filter('replace', function () {
    return function (input, from, to) {
      return input.replace(from, to);
    };
  });
