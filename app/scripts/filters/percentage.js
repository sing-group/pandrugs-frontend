'use strict';

/**
 * @ngdoc filter
 * @name pandrugsdbFrontendApp.filter:percentage
 * @function
 * @description
 * # percentage
 * Filter in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }]);
