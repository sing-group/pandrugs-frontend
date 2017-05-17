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
