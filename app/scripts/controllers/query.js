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
    $location
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

    $scope.generank = null;

    $scope.computationId = undefined;
    $scope.computation = undefined;

    $scope.advancedQueryOptions = undefined;

    // ======== RESULTS ========
    $scope.isLoading = false;
    $scope.results = null;
    $scope.resultsFiltered = null;


    $scope.setSelectedTab = function (tab) {
      if (this.isValidTab(tab) && $scope.selectedTab !== tab) {
        $scope.selectedTab = tab;
      }
    }.bind(this);

    $scope.newQuery = function() {
      $scope.results = null;
      $scope.resultsFiltered = null;
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
      $scope.advancedQueryOptions = options;

      this.checkTriggerQuery();
    }.bind(this);

    $scope.hasResult = function() {
      return $scope.results !== null;
    };

    $scope.hasZeroResults = function() {
      return $scope.hasResult() && $scope.results.isEmpty();
    };

    $scope.hasAtLeastOneResult = function() {
      return $scope.hasResult() && !$scope.results.isEmpty();
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

    //  ========== QUERY ========
    $scope.query = function() {
      if ($scope.selectedTab === 'genes' && $scope.geneList) {
        db.genesPresence($scope.geneList).then(function(presence){
          $scope.genePresence = presence;
        });

        this.searchBy(db.searchByGenes, $scope.geneList);
      } else if ($scope.selectedTab === 'drugs' && $scope.selectedDrug) {
        this.searchBy(db.searchByDrugs, [ $scope.selectedDrug ], AdvancedQueryOptionsFactory.createAdvancedQueryOptions());
      } else if ($scope.selectedTab === 'generank' && $scope.generank) {
        var reader = new FileReader();

        reader.onload = function() {
          $scope.geneList = utilities.parseGenes(reader.result);
          db.genesPresence($scope.geneList)
            .then(function(presence){
              $scope.genePresence = presence;
            });
        };

        reader.readAsText($scope.generank);

        this.searchBy(db.rankedSearch, $scope.generank);
      } else if ($scope.selectedTab === 'vcfrank' && $scope.computation) {
        db.genesPresence($scope.computation.affectedGenes).then(function(presence){
          $scope.genePresence = presence;
        });

        this.searchBy(db.computationIdSearch, $scope.computationId);
      }
    }.bind(this);

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

    this.searchBy = function(searchFunction, value, advancedQueryOptions) {
      if (!$scope.hasResult()) {
        $scope.isLoading = true;

        searchFunction(value, advancedQueryOptions || $scope.advancedQueryOptions, true, true)
          .then(function(result) {
            $scope.isLoading = false;

            $scope.results = QueryResultFactory.createQueryResult(result.geneDrugGroup, $scope.advancedQueryOptions);
            $scope.resultsFiltered = $scope.results.getFilteredGroups();

            this.updateCharts($scope.resultsFiltered);
          }.bind(this),
          function() {
            $scope.isLoading = false;
          });
      }
    };
  }]);
