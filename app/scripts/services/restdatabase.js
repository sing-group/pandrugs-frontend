'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.RestDatabase
 * @description
 * # RestDatabase
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('restDatabase', ['$q', '$timeout', '$filter', '$http', function restDatabaseFactory($q, $timeout, $filter, $http) {
    // Service logic
    // ...
    var SERVER = 'http://xistral.ei.uvigo.es:8080';
  
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
