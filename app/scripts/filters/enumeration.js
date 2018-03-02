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
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:enumeration
 * @function
 * @description
 * # enumeration
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('enumeration', function () {
    return function (input, join, last) {
      join = join === undefined ? ', ' : join;
      last = last === undefined ? ' and ' : last;

      var joined = input.join(join);
      if (input.length > 1) {
        var joinIndex = joined.lastIndexOf(join);

        return joined.substring(0, joinIndex) + last + joined.substring(joinIndex + join.length, joined.length);
      } else  {
      return joined;
      }
    };
  });
