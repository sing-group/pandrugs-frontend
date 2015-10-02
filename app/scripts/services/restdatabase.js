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
    //var SERVER = 'http://xistral.ei.uvigo.es:8080';
    var SERVER = 'http://localhost:9080';
      
    // Public API here
    return {
      search: function (genes,
		  queryCancerFda,
		  queryCancerClinical,
		  queryOtherFda,
		  queryOtherClinical,
		  queryOtherExperimental,
		  queryTarget,
		  queryMarker,
		  queryDirect,
		  queryIndirect,
		  tableState) {
	
	
	var deferred = $q.defer();
	
	var genesArray = genes.split('\n');
	
	// build query string
	var queryString = '';
	for (var i = 0; i<genes.length; i++) {
	  if (!angular.isUndefined(genesArray[i])) {
	    genesArray[i] = genesArray[i].trim().toUpperCase();
	    if (genesArray[i].length > 0 ) {
	      queryString += 'gene='+genesArray[i]+'&';
	    }
	 }
	}
	
	// query server
	var cancerDrugStatus = "";
	if (queryCancerFda) {
	    cancerDrugStatus += "cancerDrugStatus=APPROVED&";
	}
	if (queryCancerClinical) {
	    cancerDrugStatus += "cancerDrugStatus=CLINICAL_TRIALS&";
	}
	if (cancerDrugStatus === "") {
	    cancerDrugStatus = "cancerDrugStatus=NONE&";
	}
	
	var nonCancerDrugStatus = "";
	if (queryOtherClinical) {
	  nonCancerDrugStatus += "nonCancerDrugStatus=CLINICAL_TRIALS&";
	}
	if (queryOtherExperimental) {
	  nonCancerDrugStatus += "nonCancerDrugStatus=EXPERIMENTAL&";
	}
	if (queryOtherFda) {
	  nonCancerDrugStatus += "nonCancerDrugStatus=APPROVED&";
	}
	if (nonCancerDrugStatus == "") {
	  nonCancerDrugStatus = "nonCancerDrugStatus=NONE&";
	}
	
	var target = "";
	if (queryTarget && queryMarker) {
	  target = "target=BOTH&";
	} else if (queryTarget) {
	  target = "target=TARGET&";
	} else if (queryMarker) {
	  target = "target=MARKER&";
	}
	
	var direct = "";
	if (queryDirect && queryIndirect) {
	  direct = "direct=BOTH&";
	} else if (queryDirect) {
	  direct = "direct=DIRECT&";
	} else if (queryIndirect) {
	  direct = "direct=INDIRECT&";
	}
	
	$http.get(SERVER+'/pandrugsdb-backend/public/genedrug/?'+queryString+cancerDrugStatus+nonCancerDrugStatus+target+direct)
	 .success(function(results) {
	   
	   if (!angular.isUndefined(tableState)) {
	      if (tableState.sort.predicate) {
		results = $filter('orderBy')(results, tableState.sort.predicate, tableState.sort.reverse);
	      }
	    }
	    deferred.resolve(results);
	    }
	);
	
	return deferred.promise;        
      }
    };
  }]);
