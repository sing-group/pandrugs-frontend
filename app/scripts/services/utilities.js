'use strict';

/**
 * @ngdoc service
 * @name pandrugsFrontendApp.utilities
 * @description
 * # utilities
 * Value in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .value('utilities', {
    unique: function(array) {
      var result = [];

      array.forEach(function(elem){
        if (result.indexOf(elem) === -1) {
          result.push(elem);
        }
      });
      return result;
    }
  }
);
