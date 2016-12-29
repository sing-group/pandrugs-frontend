'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:enumeration
 * @function
 * @description
 * # enumeration
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('enumeration', function () {
    return function (input) {
      var joined = input.join(', ');
      if (input.length > 1) {
        return joined.substring(0, joined.lastIndexOf(',')) + ' and' + joined.substring(joined.lastIndexOf(',') + 1, joined.length);
      } else  {
      return joined;
      }
    };
  });
