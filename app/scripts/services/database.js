'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.Database
 * @description
 * # Database
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('Database', ['$q', '$timeout', '$filter', '$http', function databaseFactory($q, $timeout, $filter, $http) {
    // Service logic
    // ...
    var SERVER = 'http://192.168.111.150:8080';
  
    // Public API here
    return {
      search: function (genes, params) {
	
	var deferred = $q.defer();
	
	
	 $http.get(SERVER+'/pandrugsdb-backend/public/genedrugs')
	 .success(function(results) {
	   
	 
	  if (!angular.isUndefined(params)) {
	    if (params.sort.predicate) {
		results = $filter('orderBy')(results, params.sort.predicate, params.sort.reverse);
	    }
	  }
	  deferred.resolve(
	     results
	  );
	});
	
	return deferred.promise;
        
      }
    };
  }]);