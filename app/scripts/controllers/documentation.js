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


var markdownControllerFactory = function(markdownSubdir, markdownFile, markdownName) {
  var markdownController = function($scope, $location, $http, $sce, $timeout, $anchorScroll) {

   $scope.mdcontents = '<h3>Loading '+markdownName+'<img width=\"50px\" src=\"images/spinner.gif\"></h3>';

    $timeout(function () {
      $http.get(markdownSubdir + '/'+markdownFile).then(function (response) {
        var markdown = response.data;

        var converter = new Markdown.Converter(); // jshint ignore:line
        Markdown.Extra.init(converter); // jshint ignore:line
        $scope.mdcontents = $sce.trustAsHtml(converter.makeHtml(markdown));

        // arrange images

        $timeout(function () {
          $('#mdcontents img').each(function () { // jshint ignore:line
            if (!/^http.*/.test($(this).attr('src'))) { // jshint ignore:line
              // fix markdown images base url
              $(this).attr('src', markdownSubdir + '/' + $(this).attr('src')); // jshint ignore:line

              // images max-width
              //$(this).attr('style', 'max-width:600px'); // jshint ignore:line

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
  };
  return markdownController;
};

/**
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the pandrugsFrontendApp
 */
angular.module('pandrugsFrontendApp')
  .controller('HelpCtrl', ['$scope', '$location', '$http', '$sce', '$timeout', '$anchorScroll',
  markdownControllerFactory('help', 'help.md', 'Help')]);

  /**
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:FaqCtrl
 * @description
 * # FaqCtrl
 * Controller of the pandrugsFrontendApp
 */
angular.module('pandrugsFrontendApp')
  .controller('FaqCtrl', ['$scope', '$location', '$http', '$sce', '$timeout', '$anchorScroll',
  markdownControllerFactory('faqs', 'faqs.md', 'FAQs')]);

  /**
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pandrugsFrontendApp
 */
  angular.module('pandrugsFrontendApp')
  .controller('AboutCtrl', ['$scope', '$location', '$http', '$sce', '$timeout', '$anchorScroll',
  markdownControllerFactory('about', 'about.md', 'About')]);

  /**
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:CitationCtrl
 * @description
 * # CitationCtrl
 * Controller of the pandrugsFrontendApp
 */
    angular.module('pandrugsFrontendApp')
    .controller('CitationCtrl', ['$scope', '$location', '$http', '$sce', '$timeout', '$anchorScroll',
    markdownControllerFactory('citation', 'citation.md', 'Citation')]);

  /**
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:SourcesCtrl
 * @description
 * # SourcesCtrl
 * Controller of the pandrugsFrontendApp
 */
    angular.module('pandrugsFrontendApp')
    .controller('SourcesCtrl', ['$scope', '$location', '$http', '$sce', '$timeout', '$anchorScroll',
    markdownControllerFactory('sources', 'sources.md', 'Sources')]);