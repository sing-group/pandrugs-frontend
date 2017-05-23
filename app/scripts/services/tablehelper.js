'use strict';

/**
 * @ngdoc service
 * @name pandrugsFrontendApp.TableHelper
 * @description
 * # TableHelper
 * Service in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .service('TableHelper', ['$filter', function ($filter) {

    this.paginate = function (tableState, paginationOptions, geneDrugGroups) {
      if (tableState.pagination.number === paginationOptions[paginationOptions.length - 1]) {
        tableState.pagination.start = 0;
        tableState.pagination.number = geneDrugGroups.length;
      }

      tableState.pagination.numberOfPages = Math.ceil(geneDrugGroups.length / tableState.pagination.number);
      // show only current page

      return geneDrugGroups.slice(tableState.pagination.start, tableState.pagination.start + tableState.pagination.number);
    };

    this.sort = function (tableState, geneDrugOrGroup) {
      var absDScoreSort = function (gd) {
        return Math.abs(gd.dScore);
      };
      var dScoreSort = function (gd) {
        return gd.dScore;
      };
      var gScoreSort = function (gd) {
        return gd.gScore;
      };

      if (tableState.sort.predicate === 'dScore') {
        return $filter('orderBy')(geneDrugOrGroup, [dScoreSort, gScoreSort], tableState.sort.reverse);
      } else if (tableState.sort.predicate === 'gScore') {
        return $filter('orderBy')(geneDrugOrGroup, [gScoreSort, dScoreSort], tableState.sort.reverse);
      } else if (tableState.sort.predicate) {
        return $filter('orderBy')(geneDrugOrGroup, tableState.sort.predicate, tableState.sort.reverse);
      } else {
        return $filter('orderBy')(geneDrugOrGroup, [absDScoreSort, gScoreSort], true);
      }
    };
  }]);
