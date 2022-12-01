'use strict';

angular.module('pandrugsFrontendApp')
  .filter('toIconClass', function () {
    return function (input) {
        switch(input){
            case 'WARNING':
              return 'images/PharmCAT/warning.png';
            case 'STRONGLY_RECOMMENDED':
              return 'images/PharmCAT/strongly-recommended.png';
            case 'STRONGLY_NOT_RECOMMENDED':
              return 'images/PharmCAT/strongly-not-recommended.png';
            case 'MODERATELY_RECOMMENDED':
              return 'images/PharmCAT/moderately-recommended.png';
            case 'MODERATELY_NOT_RECOMMENDED':
              return 'images/PharmCAT/moderately-not-recommended.png';
            case 'NOT_AVAILABLE':
              return '';
        }
    };
  });