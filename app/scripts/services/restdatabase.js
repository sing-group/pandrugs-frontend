'use strict';

/**
* @ngdoc service
* @name pandrugsFrontendApp.RestDatabase
* @description
* # RestDatabase
* Factory in the pandrugsFrontendApp.
*/
angular.module('pandrugsFrontendApp')
.factory('restDatabase', ['$q', '$timeout', '$filter', '$http', 'BACKEND',
  function restDatabaseFactory($q, $timeout, $filter, $http, BACKEND) {
    function constructQueryString(
      advancedQueryOptions,
      queryDirect,
      queryIndirect
    ) {
      // query server
      var cancerDrugStatus = '';
      if (advancedQueryOptions.cancerFda) {
        cancerDrugStatus += 'cancerDrugStatus=APPROVED&';
      }
      if (advancedQueryOptions.cancerClinical) {
        cancerDrugStatus += 'cancerDrugStatus=CLINICAL_TRIALS&';
      }
      if (cancerDrugStatus === '') {
        cancerDrugStatus = 'cancerDrugStatus=NONE&';
      }

      var nonCancerDrugStatus = '';
      if (advancedQueryOptions.otherClinical) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=CLINICAL_TRIALS&';
      }
      if (advancedQueryOptions.otherExperimental) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=EXPERIMENTAL&';
      }
      if (advancedQueryOptions.otherFda) {
        nonCancerDrugStatus += 'nonCancerDrugStatus=APPROVED&';
      }
      if (nonCancerDrugStatus === '') {
        nonCancerDrugStatus = 'nonCancerDrugStatus=NONE&';
      }

      var target = '';
      if (advancedQueryOptions.target && advancedQueryOptions.marker) {
        target = 'target=BOTH&';
      } else if (advancedQueryOptions.target) {
        target = 'target=TARGET&';
      } else if (advancedQueryOptions.marker) {
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
      advancedQueryOptions,
      queryDirect,
      queryIndirect
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
        advancedQueryOptions,
        queryDirect,
        queryIndirect
      );

      $http.get(BACKEND.API + 'genedrug?' + queryString)
      .then(function(results) {
        deferred.resolve(results.data);
      });

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
        advancedQueryOptions,
        queryDirect,
        queryIndirect
      ) {
        var deferred = $q.defer();

        var queryString = constructQueryString(
          advancedQueryOptions,
          queryDirect,
          queryIndirect
        );

        var fd = new FormData();
        fd.append('generank', geneRankFile);

        $http.post(BACKEND.API + 'genedrug?' + queryString, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .then(function(results) {
            deferred.resolve(results.data);
          }
        );

        return deferred.promise;
      },

      searchByGenes: function (
        genesArray,
        advancedQueryOptions,
        queryDirect,
        queryIndirect

      ) {
        return searchBy(
          'gene',
          genesArray,
          advancedQueryOptions,
          queryDirect,
          queryIndirect);
      },

      searchByDrugs: function (
        drugsArray,
        advancedQueryOptions,
        queryDirect,
        queryIndirect) {
        return searchBy(
          'drug',
          drugsArray,
          advancedQueryOptions,
          queryDirect,
          queryIndirect);
      },

      computationIdSearch: function (
        computationId,
        advancedQueryOptions,
        queryDirect,
        queryIndirect
      ) {
          var deferred = $q.defer();

          var queryString = '';
          queryString += constructQueryString(
            advancedQueryOptions,
            queryDirect,
            queryIndirect
          );

          $http.get(BACKEND.API + 'genedrug/fromComputationId?computationId=' + computationId + '&' + queryString)
          .then(function(results) {
            deferred.resolve(results.data);
          }
        );

        return deferred.promise;
      },

      getCancerTypes: function() {
        var deferred = $q.defer();

        $http.get(BACKEND.API + 'cancer')
        .then(function(results) {
          deferred.resolve(results.data.name);
        });

        return deferred.promise;
      },

      getInteractingGenes: function(genes, degree) {
        var deferred = $q.defer();

        $http.get(BACKEND.API + 'gene/interactions', {params: {gene: genes, degree: degree}})
        .then(function(results) {
          deferred.resolve(results.data);
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
        var presence = {present:[], absent:[]};
        var split = 50;

        function createQuery(queryUrl) {
          return function() {
              return $http.get(BACKEND.API + 'genedrug/gene/presence'+queryUrl);
          };
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
