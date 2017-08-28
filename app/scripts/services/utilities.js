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
