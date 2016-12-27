'use strict';

/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
.controller('HelpCtrl', ['$scope', '$location', '$http', '$sce', '$timeout', '$anchorScroll',
    function ($scope, $location, $http, $sce, $timeout, $anchorScroll) {

      var helpSubdir = 'help';

    $http.get(helpSubdir+'/help.md').success(function(markdown) {
      var converter = new Markdown.Converter();
      $scope.helpcontents = $sce.trustAsHtml(converter.makeHtml(markdown));

        //fix help images base url
        $timeout(function(){
          $('#helpcontents img').each(function (elem) {
            if (! /^http.*/.test($(this).attr('src') )) {
              $(this).attr('src', helpSubdir+'/'+$(this).attr('src'));
            }
          });
        });

        //after render (wait to markdown is in the DOM)
        $timeout(function() {
          if($location.hash()) {
            $anchorScroll();
          }
        });

    });
}]);
