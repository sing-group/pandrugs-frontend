'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:highlight
 * @function
 * @description
 * # highlight
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('highlight', function ($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(
        new RegExp('(' + phrase + ')', 'gi'),
        '<span class="highlightedText">$1</span>'
      );

      return $sce.trustAsHtml(text);
    };
  });
