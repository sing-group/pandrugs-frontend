'use strict';

/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:QueryCtrl
 * @description
 * # QueryCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
  .controller('QueryCtrl', ['$scope', 'database', 'bubbleTherapyChart', '$timeout', 'filterFilter', 
	      function ($scope, db, bubblechart, $timeout, filterFilter) {   

    $scope.$timeout = $timeout;
    
    // ======== QUERY PARAMETERS ======
    $scope.genes='';
    $scope.queryCancerFda = true;
    $scope.queryCancerClinical = true;
    $scope.queryOtherFda = true;
    $scope.queryOtherClinical = true;
    $scope.queryOtherExperimental = true;
    $scope.queryTarget = true;
    $scope.queryMarker = true;
    
    
    // cancer types
    $scope.cancerTypes = [];
    db.getCancerTypes().then(function(results) {
      for (var i=0; i<results.length; i++){
	 $scope.cancerTypes.push({name:results[i], selected:false});
      }      
    });
    
    // selected cancer types
    $scope.selectedCancerTypes = [];
    // watch cancerTypes for changes
    $scope.$watch('cancerTypes|filter:{selected:true}', function (nv) {
      $scope.selectedCancerTypes = nv.map(function (cancerType) {
	return cancerType.name;
      });      
    }, true);

    // ========== RESULTS ========
    $scope.results=null;
    
    // bubble chart
    $scope.highchartsBubble = bubblechart;
    
    $scope.newQuery = function() {
      $scope.results = null;
    };    
    $scope.showChart = function() {
	bubblechart.updateChart($scope.results);
	$scope.chartIsShowing = true;
    };
    
    //  ========== QUERY ========
    $scope.query = function(tableState) {
      if($scope.genes!=='') {	
	$scope.isLoading=true;
	db.search($scope.genes, 
		  $scope.queryCancerFda,
		  $scope.queryCancerClinical,
		  $scope.queryOtherFda,
		  $scope.queryOtherClinical,
		  $scope.queryOtherExperimental,
		  $scope.queryTarget,
		  $scope.queryMarker,
		  true,
		  true,
		  tableState).then(function(result) {	  
	  $scope.results = result['gene-drug-group'];
	  
	for (var i = 0; i < $scope.results.length; i++) {
		var result = $scope.results[i];
		result.isOnlyIndirect = function() {
			for (var i = 0; i < this['gene-drug-info'].length; i++) {
				if (this['gene-drug-info'][i]['indirect'] == null) {
					return false;
				}
			}

			return true;
		}
	}
	
	  bubblechart.updateChart($scope.results);
	  $scope.isLoading=false;  
	});
      }
    }; 
}]);
