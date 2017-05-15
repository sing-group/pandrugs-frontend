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
