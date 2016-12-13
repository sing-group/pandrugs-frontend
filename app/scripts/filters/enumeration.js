'use strict';

/**
 * @ngdoc filter
 * @name pandrugsdbFrontendApp.filter:enumeration
 * @function
 * @description
 * # enumeration
 * Filter in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
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
