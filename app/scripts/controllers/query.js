'use strict';

/**
* @ngdoc function
* @name pandrugsFrontendApp.controller:QueryCtrl
* @description
* # QueryCtrl
* Controller of the pandrugsFrontendApp
*/
angular.module('pandrugsFrontendApp')
.controller('QueryCtrl',
['$scope',
  'user',
  'database',
  'utilities',
  'bubbleTherapyChart',
  'therapyByStatusChart',
  'therapyByFamilyChart',
  'QueryResultFactory',
  'AdvancedQueryOptionsFactory',
  '$timeout',
  '$interval',
  '$location',
  '$filter',
  function (
    $scope,
    user,
    db,
    utilities,
    bubbleChart,
    therapyByStatusChart,
    therapyByFamilyChart,
    QueryResultFactory,
    AdvancedQueryOptionsFactory,
    $timeout,
    $interval,
    $location,
    $filter
  ) {

    $scope.$timeout = $timeout;

    $scope.selectedTab = 'genes';

    // ======== VCF ========
    $scope.vcffile = '';
    $scope.computationName = 'My Computation';
    $scope.computations = {};

    // ======== CHARTS ========
    $scope.highchartsBubble = bubbleChart;
    $scope.highchartsTherapyByStatus = therapyByStatusChart;
    $scope.highchartsTherapyByFamily = therapyByFamilyChart;
    var charts = [bubbleChart, therapyByStatusChart, therapyByFamilyChart];

    // ======== QUERY PARAMETERS ========
    $scope.genes = '';
    $scope.geneList = [];

    $scope.drugQuery = '';
    $scope.selectedDrug = null;

    $scope.generank = '';
    $scope.computationId = '';
    $scope.advancedQueryOptions = [];

    // ======== RESULTS ========
    $scope.results = null;
    $scope.paginationOptions= [5, 20, 100, 'all'];


    $scope.setSelectedTab = function (tab) {
      $scope.selectedTab = tab;
    };

    $scope.newQuery = function() {
      $scope.results = null;
    };

    $scope.updateGenes = function(genes, geneList) {
      $scope.genes = genes;
      $scope.geneList = geneList;
    };

    $scope.updateDrug = function(drugQuery, selectedDrug) {
      $scope.selectedDrug = selectedDrug ? selectedDrug.standardName : null;

      if ($scope.selectedDrug) {
        $scope.drugQuery = $scope.selectedDrug;
      }
    };

    $scope.updateAdvancedQueryOptions = function(options) {
      this.advancedQueryOptions = options;
    };

    $scope.getComputationIdQuery = function() {
      return $location.search().computationId;
    };

    function updateCharts(results) {
      for (var i = 0; i < charts.length; i++) {
        charts[i].updateChart(results);
      }
    }

    $scope.showChart = function() {
      updateCharts($scope.results);
      $scope.chartIsShowing = true;
    };

    $scope.getGeneSymbols = function(genesArray) {
      return genesArray.map(function(e) { return e.geneSymbol; });
    };

    function manageResults(tableState) {
      function sort(groups) {
        if (tableState.sort.predicate === 'dScore') {
          return $filter('orderBy')(groups, function(gd) {
            return Math.abs(gd.dScore);
          }, tableState.sort.reverse);
        } else {
          return $filter('orderBy')(groups, tableState.sort.predicate, tableState.sort.reverse);
        }
      }

      function paginate(groups) {
        if (tableState.pagination.number === $scope.paginationOptions[$scope.paginationOptions.length - 1]) {
          tableState.pagination.start = 0;
          tableState.pagination.number = groups.length;
        }

        tableState.pagination.numberOfPages = Math.ceil(groups.length / tableState.pagination.number);
        // show only current page

        return groups.slice(tableState.pagination.start, tableState.pagination.start+tableState.pagination.number);
      }

      return function(result) {
        var results = QueryResultFactory.createQueryResult(result.geneDrugGroup, $scope.advancedQueryOptions);

        $scope.results = results.getFilteredGroups();

        $scope.csvcontent = encodeURI('data:text/csv;charset=utf-8,' + results.toCSV());

        updateCharts($scope.results);

        if (!angular.isUndefined(tableState)) {
          if (tableState.sort.predicate) {
            $scope.results = sort($scope.results);
          }
          $scope.resultsPaginated = paginate($scope.results);
        }

        $scope.isLoading = false;
      };
    }

    //  ========== QUERY ========
    $scope.query = function(tableState) {
      if ($scope.selectedTab === 'generank' && $scope.generank) {
        var reader = new FileReader();
        reader.onload = function() {
          $scope.parsedInputGenes = utilities.parseGenes(reader.result);

          db.genesPresence($scope.parsedInputGenes)
            .then(function(presence){
              $scope.genespresence = presence;
            });
        };

        reader.readAsText($scope.generank);

        searchBy(db.rankedSearch, $scope.generank, tableState);
      } else if ($scope.selectedTab === 'vcfranking' && $scope.computationId) {
        db.genesPresence($scope.computations[$scope.computationId].affectedGenes).then(function(presence){
          $scope.genespresence = presence;
        });

        searchBy(db.computationIdSearch, $scope.computationId, tableState);
      } else if ($scope.selectedTab === 'genes' && $scope.genes) {
        db.genesPresence($scope.geneList).then(function(presence){
          $scope.genespresence = presence;
        });

        searchBy(db.searchByGenes, $scope.geneList, tableState);
      } else if ($scope.selectedTab === 'drugs' && $scope.selectedDrug) {
        searchBy(db.searchByDrugs, [ $scope.selectedDrug ], tableState, AdvancedQueryOptionsFactory.createAdvancedQueryOptions());
      }
    };

    function searchBy(searchFunction, value, tableState, advancedQueryOptions) {
      $scope.isLoading = true;

      searchFunction(value, advancedQueryOptions || $scope.advancedQueryOptions, true, true)
        .then(manageResults(tableState));
    }

    $scope.getCurrentUser = function() {
      return user.getCurrentUser();
    };

    $scope.submitVCF = function() {
      $scope.largeProcess = 'Uploading VCF File, please wait';
      user.submitComputation($scope.vcffile, $scope.computationName,
        function(newId) {
          if (user.getCurrentUser() === 'anonymous') {

            var followUrl = $location.absUrl().substring(0, $location.absUrl().indexOf('#'))+'#/query?computationId='+newId;
            window.alert('Computation submitted successfully. Please keep this link in a SAFE PLACE in order to get back and follow the computation progress:\n'+followUrl);

            $timeout(function() {
              //do redirection asynchronously, since in chrome the modal vcf dialog black background does not disappear ...
              document.location.href = followUrl;
            });

          } else {
            window.alert('Computation submitted successfully. We will start to analyze it as soon as we can.');
          }
          $scope.largeProcess = null;
        },
        function() {
          window.alert('ERROR: computation could not be submitted.');
          $scope.largeProcess = null;
        }
      );
    };

    $scope.deleteComputation = function(computationId) {
      if (window.confirm('Are you sure?')) {
        user.deleteComputation(computationId,
          function() {
            window.alert('Computation deleted successfully.');
          },
          function() {
            window.alert('ERROR: computation could not be deleted.');
          });
      }
    };

    //update computation status...
    function reloadComputations() {

      if ($scope.selectedTab === 'vcfranking') {
        if (user.getCurrentUser() !== 'anonymous') {
          user.getComputations(function(computations) {
            var savedExample;

            if ($scope.computations.example !== undefined) {
              savedExample = $scope.computations.example;
            }
            $scope.computations = computations;

            if (savedExample) {
              $scope.computations.example = savedExample;
            }

          }, null);
        } else if($scope.getComputationIdQuery() !== undefined) {
          user.getComputation('guest', $scope.getComputationIdQuery(), function(computation){
            $scope.computations[$scope.getComputationIdQuery()] = computation;
            if (!computation.finished || computation.failed || computation.affectedGenes.length === 0) {
              $scope.computationId = '';
            } else {
              $scope.computationId = $scope.getComputationIdQuery();
            }
          }, null);
        }
      }
    }
    reloadComputations();

    // stop reloading computations
    $scope.$on('$routeChangeStart', function() {
      if ($scope.reloadComputationsTask !== undefined) {
        $interval.cancel($scope.reloadComputationsTask);
      }
    });

    if ($scope.getComputationIdQuery()) {
      $scope.setSelectedTab('vcfranking');
    }
    $scope.reloadComputationsTask = $interval(reloadComputations, 5000);

    // automatic examples
    if ($location.search().example !== undefined) {
      switch ($location.search().example) {
        case 'genes':
          $scope.pasteSignalingPathwayExample();
          $timeout(function(){
            $scope.query();
          });

          break;
        case 'vcf':
          $location.search().computationId = 'example';
          $scope.computationId = 'example';
          user.getComputation('guest', 'example', function(computation){
            $scope.computations.example = computation;
            $scope.setSelectedTab('vcfranking');
            $timeout(function(){
              $scope.query();
            });
          });

          break;
        case 'drugs':
          $scope.setSelectedTab('drugs');
          $scope.drugs = [{standardName: 'Palbociclib'}];
          $timeout(function(){
            $scope.query();
          });
          break;
      }
    }
  }]);
