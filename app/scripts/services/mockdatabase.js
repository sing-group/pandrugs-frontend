'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.MockDatabase
 * @description
 * # MockDatabase
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('MockDatabase', ['$q', function mockDatabaseFactory($q) {
    // Service logic
    // ...

    // Public API here
    return {
      search: function (gene, params) {
	
	var deferred = $q.defer();
	
	deferred.resolve(
	  [
	    { gene: "BRCA2" }
	  ]
	);
	
        return deferred.promise;
      }
    };
  }]);
