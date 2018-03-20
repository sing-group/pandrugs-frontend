/*
 * PanDrugs Frontend
 *
 * Copyright (C) 2015 - 2017 Fátima Al-Shahrour, Elena Piñeiro,
 * Daniel Glez-Peña and Miguel Reboiro-Jato
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 */
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
      var btcSort = function (gd) {
        return !gd.isBestCandidate();
      };

      var interactionSort = function (gd) {

        if (gd.target === 'target' && gd.indirect === null) {
          return 1; // target
        }
        if (gd.target === 'target' && gd.indirect !== null) {
          return 0; // pathway member
        }
        if (gd.target === 'marker') {
          return -1; // biomarker
        }
      };

      /*
      <img ng-if="geneDrug.target === 'marker'" src="images/query/biomarker.png"/>
      <img ng-if="geneDrug.target === 'target' && geneDrug.indirect === null" src="images/query/direct-target.png"/>
      <img ng-if="geneDrug.target === 'target' && geneDrug.indirect !== null" src="images/query/pathway-member.png"/>*/

      if (tableState.sort.predicate === 'dScore') {
        return $filter('orderBy')(geneDrugOrGroup, [dScoreSort, gScoreSort], tableState.sort.reverse);
      } else if (tableState.sort.predicate === 'gScore') {
        return $filter('orderBy')(geneDrugOrGroup, [gScoreSort, dScoreSort], tableState.sort.reverse);
      } else if (tableState.sort.predicate === 'interaction') {
        return $filter('orderBy')(geneDrugOrGroup, [interactionSort, absDScoreSort, gScoreSort], tableState.sort.reverse);
      } else if (tableState.sort.predicate === 'btc') {
        return $filter('orderBy')(geneDrugOrGroup, [btcSort, function() { -1* absDScoreSort}, function() {-1*gScoreSort}], tableState.sort.reverse);
      } else if (tableState.sort.predicate) {
        return $filter('orderBy')(geneDrugOrGroup, tableState.sort.predicate, tableState.sort.reverse);
      } else {
        return $filter('orderBy')(geneDrugOrGroup, [absDScoreSort, gScoreSort], true);
      }
    };
  }]);
