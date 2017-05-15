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
    },
    uniqueIgnoreCase: function(array) {
      var uniqueElems = [];
      var upperElems = [];

      array.forEach(function(elem){
        var elemUpper = elem.toUpperCase();

        if (upperElems.indexOf(elemUpper) === -1) {
          uniqueElems.push(elem);
          upperElems.push(elemUpper);
        }
      });

      return uniqueElems;
    },
    parseGenes: function(genes, unique) {
      genes = genes.split('\n')
        .filter(function(item){
          return item.trim().length > 0;
        })
        .map(function(item){
          return item.replace(/\s.*/, '');
        })
        .map(function(item) {
          return item.trim().toUpperCase();
        });

      return unique === undefined || unique === true ? this.uniqueIgnoreCase(genes) : genes;
    },
    removeEmptyValues: function(array) {
      return array.filter(function(item) {
        return item !== undefined && item !== null && (typeof item !== 'string' || item.trim() !== '');
      });
    }
  }
);
