'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:mapAttribute
 * @function
 * @description
 * # mapAttribute
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('mapAttribute', function () {
    return function (input, attribute) {
      return input.map(function(value) { return value[attribute]; });
    };
  });
