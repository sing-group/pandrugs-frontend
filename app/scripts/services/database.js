'use strict';

/**
* @ngdoc service
* @name pandrugsdbFrontendApp.database
* @description
* # database
* Provider in the pandrugsdbFrontendApp.
*/
angular.module('pandrugsdbFrontendApp')
.provider('database', function databaseProvider() {
  var useMock = false;
  this.useMock = function(value) {
    useMock = !!value;
  };

  this.$get = ['restDatabase', 'mockDatabase', function databaseFactory(rest, mock) {
    return useMock? mock : rest;
  }];
});
