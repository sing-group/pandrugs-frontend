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
	var SERVER = 'http://sing.ei.uvigo.es';
	//var SERVER = 'http://localhost:8080'; // development: local backend;
	//var SERVER = 'http://0.0.0.0:9000'; // development: via grunt reverse proxy to local backend
  //var SERVER = ''; // the server is in this machine (e.g.: docker distribution)
	function constructQueryString(
		queryCancerFda,
		queryCancerClinical,
		queryOtherFda,
		queryOtherClinical,
		queryOtherExperimental,
		queryTarget,
		queryMarker,
		queryDirect,
		queryIndirect
	) {
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

		return cancerDrugStatus + nonCancerDrugStatus + target + direct;
	}

	function searchBy (
		queryType,
		queryValues,
		queryCancerFda,
		queryCancerClinical,
		queryOtherFda,
		queryOtherClinical,
		queryOtherExperimental,
		queryTarget,
		queryMarker,
		queryDirect,
		queryIndirect,
		tableState
	) {
			var deferred = $q.defer();

			// build query string
			var queryString = '';
			for (var i = 0; i < queryValues.length; i++) {
				if (!angular.isUndefined(queryValues[i])) {
					queryValues[i] = queryValues[i].trim().toUpperCase();
					if (queryValues[i].length > 0) {
						queryString += queryType + '=' + queryValues[i] + '&';
					}
				}
			}

			queryString += constructQueryString(
				queryCancerFda,
				queryCancerClinical,
				queryOtherFda,
				queryOtherClinical,
				queryOtherExperimental,
				queryTarget,
				queryMarker,
				queryDirect,
				queryIndirect
			);

			$http.get(SERVER + '/pandrugsdb-backend/public/genedrug/?' + queryString)
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

	function validValues(resource, query, maxResults) {
		return $http.get(SERVER + resource, {
			params: {
				query: query.toUpperCase(),
				maxResults: maxResults == undefined ? 20 : maxResults
			}
		});
	}

	// Public API here
	return {
		rankedSearch: function(
			geneRankFile,
			queryCancerFda,
			queryCancerClinical,
			queryOtherFda,
			queryOtherClinical,
			queryOtherExperimental,
			queryTarget,
			queryMarker,
			queryDirect,
			queryIndirect,
			tableState
		) {
			var deferred = $q.defer();

			var queryString = constructQueryString(
				queryCancerFda,
				queryCancerClinical,
				queryOtherFda,
				queryOtherClinical,
				queryOtherExperimental,
				queryTarget,
				queryMarker,
				queryDirect,
				queryIndirect
			);

			var fd = new FormData();
			fd.append("generank", geneRankFile);

			$http.post(SERVER + '/pandrugsdb-backend/public/genedrug/?' + queryString, fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
			})
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
		},

		searchByGenes: function (
      genesArray,
      queryCancerFda,
      queryCancerClinical,
      queryOtherFda,
      queryOtherClinical,
      queryOtherExperimental,
      queryTarget,
      queryMarker,
      queryDirect,
      queryIndirect,
      tableState
    ) {
			return searchBy(
				'gene',
				genesArray,
				queryCancerFda,
				queryCancerClinical,
				queryOtherFda,
				queryOtherClinical,
				queryOtherExperimental,
				queryTarget,
				queryMarker,
				queryDirect,
				queryIndirect,
				tableState);
		},

    searchByDrugs: function (
      drugsArray,
      queryCancerFda,
      queryCancerClinical,
      queryOtherFda,
      queryOtherClinical,
      queryOtherExperimental,
      queryTarget,
      queryMarker,
      queryDirect,
      queryIndirect,
      tableState
    ) {
			return searchBy(
				'drug',
				drugsArray,
				queryCancerFda,
				queryCancerClinical,
				queryOtherFda,
				queryOtherClinical,
				queryOtherExperimental,
				queryTarget,
				queryMarker,
				queryDirect,
				queryIndirect,
				tableState);
		},

		computationIdSearch: function (
			computationId,
			queryCancerFda,
			queryCancerClinical,
			queryOtherFda,
			queryOtherClinical,
			queryOtherExperimental,
			queryTarget,
			queryMarker,
			queryDirect,
			queryIndirect,
			tableState
		) {
				var deferred = $q.defer();

				var queryString = '';
				queryString += constructQueryString(
					queryCancerFda,
					queryCancerClinical,
					queryOtherFda,
					queryOtherClinical,
					queryOtherExperimental,
					queryTarget,
					queryMarker,
					queryDirect,
					queryIndirect
				);

				$http.get(SERVER + '/pandrugsdb-backend/public/genedrug/fromComputationId?computationId='+computationId + "&" + queryString)
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
		},

		getCancerTypes: function() {

			var deferred = $q.defer();
			$http.get(SERVER+'/pandrugsdb-backend/public/cancer')
			.success(function(results) {
				deferred.resolve(results['name']);
				}
			);
			return deferred.promise;
	},

	getInteractingGenes: function(genes, degree) {
		var deferred = $q.defer();

		$http.get(SERVER+'/pandrugsdb-backend/public/gene/interactions', {params: {gene: genes, degree: degree}})
		.success(function(results) {
			deferred.resolve(results);
			}
		);
		return deferred.promise;
	},

	listGeneSymbols: function(query, maxResults) {
		return validValues('/pandrugsdb-backend/public/genedrug/gene', query, maxResults);
	},

  listStandardDrugNames: function(query, maxResults) {
		return validValues('/pandrugsdb-backend/public/genedrug/drug', query, maxResults);
  }
};
}]);
