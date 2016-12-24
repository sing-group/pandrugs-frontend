'use strict';

/**
 * @ngdoc filter
 * @name pandrugsdbFrontendApp.filter:highlight
 * @function
 * @description
 * # highlight
 * Filter in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .filter('highlight', function ($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(
        new RegExp('(' + phrase + ')', 'gi'),
        '<span class="highlightedText">$1</span>'
      );

      return $sce.trustAsHtml(text);
    };
  });
