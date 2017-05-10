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

          /* jshint ignore:start */

          var converter = new Markdown.Converter();
          $scope.helpcontents = $sce.trustAsHtml(converter.makeHtml(markdown));

          // arrange images

          $timeout(function () {
            $('#helpcontents img').each(function () {
              if (!/^http.*/.test($(this).attr('src'))) {
                // fix help images base url
                $(this).attr('src', helpSubdir + '/' + $(this).attr('src'));

                // images max-width
                $(this).attr('style', 'max-width:600px');

                // add link to see image in original size
                $(this).wrap('<a href=\"' + $(this).attr('src') + '\"></a>');
              }
            });
          });

          //after render (wait to markdown is in the DOM)
          $timeout(function () {
            if ($location.hash()) {
              $anchorScroll();
            }
          });

          /* jshint ignore:end */
        });
      }, 50);
    }]);
