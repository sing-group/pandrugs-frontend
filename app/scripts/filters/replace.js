'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:replace
 * @function
 * @description
 * # replace
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('replace', function () {
    return function (input, from, to) {
      return input.split(from).join(to);
    };
  });
