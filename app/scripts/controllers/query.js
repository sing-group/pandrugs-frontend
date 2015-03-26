'use strict';

/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:QueryCtrl
 * @description
 * # QueryCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
  .controller('QueryCtrl', ['$scope', 'DatabaseFactory', function ($scope, db) {
   
    // query filters
    $scope.query_cancer_fda = true;
    $scope.query_cancer_clinical = true;
    $scope.query_other_fda = true;
    $scope.query_other_clinical = true;
    $scope.query_other_experimental = true;
    $scope.query_target = true;
    $scope.query_marker = true;
    $scope.query_direct = true;
    $scope.query_indirect = true;
    
    $scope.results=[];
    $scope.genes="";
    // methods
    $scope.query = function(tableState) {
      
      if($scope.genes!="") {	
	$scope.isLoading=true;
	db.search($scope.genes, tableState).then(function(result) {
	  $scope.results = result;
	  $scope.isLoading=false;
	});
      }
    }
}]);
