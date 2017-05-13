'use strict';
angular.module('pandrugsFrontendApp')
.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    scope: {
      fileModel: '=',
      onFileChange: '&'
    },
    link: function(scope, element, attrs) {
      element.bind('change', function (changeEvent) {
        scope.$apply(function () {
          scope.fileModel = changeEvent.target.files[0];
          scope.onFileChange({ file: scope.fileModel });
        });
      });
    }
  };
}]);
