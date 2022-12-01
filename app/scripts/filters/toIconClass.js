'use strict';

angular.module('pandrugsFrontendApp')
  .filter('toIconClass', function () {
    return function (input) {
        switch(input){
            case 'WARNING':
              return 'warning_pharmcat_icon';
            case 'STRONGLY_RECOMMENDED':
              return 'strongly_recommended_pharmcat_icon';
            case 'STRONGLY_NOT_RECOMMENDED':
              return 'strongly_not_recommended_pharmcat_icon';
            case 'MODERATELY_RECOMMENDED':
              return 'moderately_recommended_pharmcat_icon';
            case 'MODERATELY_NOT_RECOMMENDED':
              return 'moderately_not_recommended_pharmcat_icon';
            case 'NOT_AVAILABLE':
              return '';
        }
    };
  });