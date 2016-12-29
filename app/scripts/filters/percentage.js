'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:percentage
 * @function
 * @description
 * # percentage
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }]);
