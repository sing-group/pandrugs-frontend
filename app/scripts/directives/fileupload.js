'use strict';
angular.module('pandrugsFrontendApp')
.directive('fileModel', function () {
  return {
    restrict: 'A',
    scope: {
      fileModel: '=',
      onFileChange: '&'
    },
    link: function(scope, element) {
      element.bind('change', function (changeEvent) {
        scope.$apply(function () {
          scope.fileModel = changeEvent.target.files[0];
          scope.onFileChange({ file: scope.fileModel });
        });
      });
    }
  };
});
