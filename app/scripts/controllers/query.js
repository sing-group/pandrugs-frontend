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
    $location,
    $filter
  ) {

    this.isValidTab = function(tab) {
      return tab === 'genes' || tab === 'drugs' || tab === 'generank' || tab === 'vcfrank';
    };

    var example = $location.search().example;
    this.triggerQueryOnChange = this.isValidTab(example);
    $scope.selectedTab = this.isValidTab(example) ? example : 'genes';

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

    $scope.computationId = undefined;
    $scope.computation = undefined;

    $scope.advancedQueryOptions = undefined;

    // ======== RESULTS ========
    $scope.results = null;
    $scope.resultsFiltered = null;

    $scope.genePresence = null;

    $scope.paginationOptions= [5, 20, 100, 'all'];


    $scope.setSelectedTab = function (tab) {
      if (this.isValidTab(tab) && $scope.selectedTab !== tab) {
        $scope.selectedTab = tab;
      }
    }.bind(this);

    $scope.newQuery = function() {
      $scope.results = null;
      $scope.resultsFiltered = null;
    };

    $scope.canQuery = function () {
      return !$scope.isLoading
        && ($scope.selectedTab === 'drugs' || ($scope.advancedQueryOptions && $scope.advancedQueryOptions.isValid()))
        && (
          ($scope.selectedTab === 'genes' && $scope.genes && $scope.geneList)
          || ($scope.selectedTab === 'drugs' && $scope.selectedDrug)
          || ($scope.selectedTab === 'generank' && $scope.generank)
          || ($scope.selectedTab === 'vcfrank' && $scope.computationId && $scope.computation && $scope.computation.canBeQueried())
        );
    };

    $scope.updateGenes = function(genes, uniqueGeneList) {
      $scope.genes = genes;
      $scope.geneList = uniqueGeneList;

      this.checkTriggerQuery();
    }.bind(this);

    $scope.updateDrug = function(drugQuery, selectedDrug) {
      $scope.selectedDrug = selectedDrug ? selectedDrug.standardName : null;

      if ($scope.selectedDrug) {
        $scope.drugQuery = $scope.selectedDrug;
      }

      this.checkTriggerQuery();
    }.bind(this);

    $scope.updateGenerank = function(generank) {
      $scope.generank = generank;
    };

    $scope.updateComputation = function(computationId, computation) {
      $scope.computationId = computationId;
      $scope.computation = computation;

      if ($scope.computationId && $scope.computation) {
        $scope.setSelectedTab('vcfrank');
      }

      this.checkTriggerQuery();
    }.bind(this);

    $scope.updateAdvancedQueryOptions = function(options) {
      this.advancedQueryOptions = options;
    };

    $scope.getGeneSymbols = function(genesArray) {
      return genesArray.map(function(e) { return e.geneSymbol; });
    };

    $scope.hasResult = function() {
      return $scope.results !== null;
    };

    $scope.hasZeroResults = function() {
      return $scope.hasResult() && $scope.results.isEmpty();
    };

    $scope.hasAtLeastOneResult = function() {
      return $scope.hasResult() && !$scope.results.isEmpty();
    };

    //  ========== QUERY ========
    $scope.query = function(tableState) {
      if ($scope.selectedTab === 'generank' && $scope.generank) {
        var reader = new FileReader();

        reader.onload = function() {
          $scope.geneList = utilities.parseGenes(reader.result);
          db.genesPresence($scope.geneList)
            .then(function(presence){
              $scope.genePresence = presence;
            });
        };

        reader.readAsText($scope.generank);

        this.searchBy(db.rankedSearch, $scope.generank, tableState);
      } else if ($scope.selectedTab === 'vcfrank' && $scope.computation) {
        db.genesPresence($scope.computation.affectedGenes).then(function(presence){
          $scope.genePresence = presence;
        });

        this.searchBy(db.computationIdSearch, $scope.computationId, tableState);
      } else if ($scope.selectedTab === 'genes' && $scope.genes) {
        db.genesPresence($scope.geneList).then(function(presence){
          $scope.genePresence = presence;
        });

        this.searchBy(db.searchByGenes, $scope.geneList, tableState);
      } else if ($scope.selectedTab === 'drugs' && $scope.selectedDrug) {
        this.searchBy(db.searchByDrugs, [ $scope.selectedDrug ], tableState, AdvancedQueryOptionsFactory.createAdvancedQueryOptions());
      }
    }.bind(this);

    $scope.populateTable = function(tableState) {
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

      if (tableState.sort.predicate) {
        $scope.resultsFiltered = sort($scope.resultsFiltered);
      }

      $scope.resultsPaginated = paginate($scope.resultsFiltered);

      $scope.isLoading = false;
    };

    this.checkTriggerQuery = function() {
      if (this.triggerQueryOnChange && $scope.canQuery()) {
        this.triggerQueryOnChange = false;

        $timeout($scope.query);
      }
    };

    this.updateCharts = function(results) {
      for (var i = 0; i < charts.length; i++) {
        charts[i].updateChart(results);
      }
    };

    this.searchBy = function(searchFunction, value, tableState, advancedQueryOptions) {
      $scope.isLoading = true;

      if ($scope.results) {
        this.manageResults(tableState)($scope.results);
      } else {
        searchFunction(value, advancedQueryOptions || $scope.advancedQueryOptions, true, true)
          .then(function(result) {
            $scope.results = QueryResultFactory.createQueryResult(result.geneDrugGroup, $scope.advancedQueryOptions);
            $scope.resultsFiltered = $scope.results.getFilteredGroups();

            $scope.csvcontent = encodeURI('data:text/csv;charset=utf-8,' + $scope.results.toCSV());
            this.updateCharts($scope.resultsFiltered);
          }.bind(this));
      }
    };
  }]);
