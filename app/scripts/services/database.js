'use strict';

/**
* @ngdoc service
* @name pandrugsFrontendApp.database
* @description
* # database
* Provider in the pandrugsFrontendApp.
*/
angular.module('pandrugsFrontendApp')
.provider('database', function databaseProvider() {
  var useMock = false;
  this.useMock = function(value) {
    useMock = !!value;
  };

  this.$get = ['restDatabase', 'mockDatabase', function databaseFactory(rest, mock) {
    return useMock? mock : rest;
  }];
});
