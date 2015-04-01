'use strict';

/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:QueryCtrl
 * @description
 * # QueryCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
  .controller('QueryCtrl', ['$scope', 'database', function ($scope, db) {
   
    // query filters
    $scope.queryCancerFda = true;
    $scope.queryCancerClinical = true;
    $scope.queryOtherFda = true;
    $scope.queryOtherClinical = true;
    $scope.queryOtherExperimental = true;
    $scope.queryTarget = true;
    $scope.queryMarker = true;
    $scope.queryDirect = true;
    $scope.queryIndirect = true;
    
    $scope.results=[];
    $scope.genes='';
    // methods
    $scope.query = function(tableState) {
      
      if($scope.genes!=='') {	
	$scope.isLoading=true;
	db.search($scope.genes, tableState).then(function(result) {
	  $scope.results = result;
	  $scope.isLoading=false;
	});
      }
    };
    
    //chart
    $scope.highchartsNG = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [{
            data: [10, 15, 12, 8, 7]
        }],
        title: {
            text: 'Hello'
        },
        loading: false
    };
}]);
