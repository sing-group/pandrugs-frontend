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
 * @name pandrugsFrontendApp.filter:enumerationWithLink
 * @function
 * @description
 * # enumeration
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('enumerationWithLink', function (enumerationFilter) {
    return function (input, url, openInBlank, urlToken) {
      var wrapped = input.map(function (value) {
        var effectiveURL = url;

        if (urlToken !== undefined) {
          var regexp = new RegExp(urlToken, 'g');
          effectiveURL = url.replace(regexp, value);
        }

        var html = '<a href="' + effectiveURL + '"';
        if (openInBlank === true) {
          html += ' target="_blank"';
        }
        html += '>' + value + '</a>';

        return html;
      });

      return enumerationFilter(wrapped);
    };
  });
