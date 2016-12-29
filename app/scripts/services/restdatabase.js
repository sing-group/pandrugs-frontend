'use strict';

/**
* @ngdoc service
* @name pandrugsdbFrontendApp.RestDatabase
* @description
* # RestDatabase
* Factory in the pandrugsdbFrontendApp.
*/
angular.module('pandrugsdbFrontendApp')
.factory('restDatabase', ['$q', '$timeout', '$filter', '$http', 'BACKEND',
  function restDatabaseFactory($q, $timeout, $filter, $http, BACKEND) {
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
      var cancerDrugStatus = '';
      if (queryCancerFda) {
        cancerDrugStatus += 'cancerDrugStatus=APPROVED&';
      }
      if (queryCancerClinical) {
        cancerDrugStatus += 'cancerDrugStatus=CLINICAL_TRIALS&';
      }
      if (cancerDrugStatus === '') {
        cancerDrugStatus = 'cancerDrugStatus=NONE&';
      }

      var nonCancerDrugStatus = '';
      if (queryOtherClinical) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=CLINICAL_TRIALS&';
      }
      if (queryOtherExperimental) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=EXPERIMENTAL&';
      }
      if (queryOtherFda) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=APPROVED&';
      }
      if (nonCancerDrugStatus === '') {
        nonCancerDrugStatus = 'nonCancerDrugStatus=NONE&';
      }

      var target = '';
      if (queryTarget && queryMarker) {
        target = 'target=BOTH&';
      } else if (queryTarget) {
        target = 'target=TARGET&';
      } else if (queryMarker) {
        target = 'target=MARKER&';
      }

      var direct = '';
      if (queryDirect && queryIndirect) {
        direct = 'direct=BOTH&';
      } else if (queryDirect) {
        direct = 'direct=DIRECT&';
      } else if (queryIndirect) {
        direct = 'direct=INDIRECT&';
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

        $http.get(BACKEND.API + 'genedrug?' + queryString)
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
      return $http.get(BACKEND.API + resource, {
        params: {
          query: query.toUpperCase(),
          maxResults: maxResults === undefined ? 20 : maxResults
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
        fd.append('generank', geneRankFile);

        $http.post(BACKEND.API + 'genedrug?' + queryString, fd, {
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

          $http.get(BACKEND.API + 'genedrug/fromComputationId?computationId=' + computationId + '&' + queryString)
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
        $http.get(BACKEND.API + 'cancer')
        .success(function(results) {
          deferred.resolve(results.name);
          }
        );
        return deferred.promise;
      },

      getInteractingGenes: function(genes, degree) {
        var deferred = $q.defer();

        $http.get(BACKEND.API + 'gene/interactions', {params: {gene: genes, degree: degree}})
        .success(function(results) {
          deferred.resolve(results);
          }
        );
        return deferred.promise;
      },

      listGeneSymbols: function(query, maxResults) {
        return validValues('genedrug/gene', query, maxResults);
      },

      listDrugNames: function(query, maxResults) {
        return validValues('genedrug/drug', query, maxResults);
      },

      genesPresence: function(genes) {
        var promise = null;
        var presence = {present:[], absent:[]};
        var split = 50;

        function createQuery(queryUrl) {
          return function() {
              console.log('starting '+queryUrl);
              return $http.get(BACKEND.API + 'genedrug/gene/presence'+queryUrl);
          }
        }


        var iterations = Math.ceil(genes.length / split);
        var queries = [];
        for (var i = 0; i < iterations; i++) {

          var query = '?';
          for (var j = i * split; j < Math.min(i * split + split, genes.length); j++) {
            query += 'gene='+genes[j]+'&';
          }
          queries.push(createQuery(query));
        }

        var currentPromise = null;

        //chain promises
        queries.forEach(function(query){

          if (currentPromise === null) {
            currentPromise = query();
          } else {
            currentPromise = currentPromise.then(function(results) {
              console.log(results);
              presence.present = presence.present.concat(results.data.present);
              presence.absent = presence.absent.concat(results.data.absent);

              return query();
            });
          }

        });

        return currentPromise.then(function(results) {
          presence.present = presence.present.concat(results.data.present);
          presence.absent = presence.absent.concat(results.data.absent);
          return presence;
        });
      }
    };
  }
]);
