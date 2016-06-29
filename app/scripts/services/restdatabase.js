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

    search: function (
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
        var deferred = $q.defer();

        // build query string
        var queryString = '';
        for (var i = 0; i < genesArray.length; i++) {
          if (!angular.isUndefined(genesArray[i])) {
            genesArray[i] = genesArray[i].trim().toUpperCase();
            if (genesArray[i].length > 0) {
              queryString += 'gene=' + genesArray[i] + '&';
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
  }
};
}]);
