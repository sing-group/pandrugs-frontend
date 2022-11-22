angular.module('pandrugsFrontendApp')
  .filter('toIconClass', function () {
    return function (input) {
        switch(input){
            case 'WARNING':
              return 'glyphicon glyphicon-warning-sign';
            case 'STRONGLY_RECOMMENDED':
              return 'glyphicon glyphicon-plane';
            case 'STRONGLY_NOT_RECOMMENDED':
              return 'glyphicon glyphicon-pencil';
            case 'MODERATELY_RECOMMENDED':
              return 'glyphicon glyphicon-search';
            case 'MODERATELY_NOT_RECOMMENDED':
              return 'glyphicon glyphicon-print';
            case 'NOT_AVAILABLE':
              return '';
        }
    };
  });