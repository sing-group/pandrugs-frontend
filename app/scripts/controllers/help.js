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
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the pandrugsFrontendApp
 */
angular.module('pandrugsFrontendApp')
  .controller('HelpCtrl', ['$scope', '$location', '$http', '$sce', '$timeout', '$anchorScroll',
    function ($scope, $location, $http, $sce, $timeout, $anchorScroll) {

      var helpSubdir = 'help';
      $scope.helpcontents = '<h3>Loading help<img width=\"50px\" src=\"images/spinner.gif\"></h3>';

      $timeout(function () {
        $http.get(helpSubdir + '/help.md').then(function (response) {
          var markdown = response.data;

          var converter = new Markdown.Converter(); // jshint ignore:line
          $scope.helpcontents = $sce.trustAsHtml(converter.makeHtml(markdown));

          // arrange images

          $timeout(function () {
            $('#helpcontents img').each(function () { // jshint ignore:line
              if (!/^http.*/.test($(this).attr('src'))) { // jshint ignore:line
                // fix help images base url
                $(this).attr('src', helpSubdir + '/' + $(this).attr('src')); // jshint ignore:line

                // images max-width
                $(this).attr('style', 'max-width:600px'); // jshint ignore:line

                // add link to see image in original size
                $(this).wrap('<a href=\"' + $(this).attr('src') + '\"></a>'); // jshint ignore:line
              }
            });
          });

          //after render (wait to markdown is in the DOM)
          $timeout(function () {
            if ($location.hash()) {
              $anchorScroll();
            }
          });
        });
      }, 50);
    }]);
