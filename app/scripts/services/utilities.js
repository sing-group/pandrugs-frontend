'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.utilities
 * @description
 * # utilities
 * Value in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .value('utilities', {
    unique: function(array) {
      var result = [];

      array.forEach(function(elem){
        if (result.indexOf(elem)==-1) {
          result.push(elem);
        }
      });
      return result;
    }
  }
);
