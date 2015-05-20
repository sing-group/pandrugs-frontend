
'use strict';


/**
 * @ngdoc function
 * @name pandrugsdbFrontendApp.controller:QueryCtrl
 * @description
 * # QueryCtrl
 * Controller of the pandrugsdbFrontendApp
 */
angular.module('pandrugsdbFrontendApp')
  .controller('QueryCtrl', ['$scope', 'database', '$timeout', function ($scope, db, $timeout) {
   
    $scope.$timeout = $timeout;
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
    
    $scope.results=null;
    $scope.genes='';
    
    $scope.highchartsBubble = {
      options: {
       chart: {
            type: 'bubble',
            zoomType: 'xy'
        },
	xAxis: {
	  title: { text: "Drug Score" },
	  plotLines: [
	    {
	      color: 'red',
	      dashStyle: 'ShortDash',
	      value: 0.40,
	      width: 2
	    }
	  ]
	},
	yAxis: {
	  title: { text: "Gene Score" },
	  plotLines: [
	    {
	      color: 'red',
	      dashStyle: 'ShortDash',
	      value: 0.60,
	      width: 2
	    }
	  ]
	},
        title: {
            text: 'Candidate Therapies by GScore vs. DScore'
        },
	plotOptions: {
            bubble: {
                minSize: 1,
                maxSize: 20,
                tooltip: {
                    headerFormat: '',
                    pointFormat: "Status: {series.name}<br>DScore: {point.x}<br>GScore: {point.y}<br>Genes: {point.genes}<br>Drug: {point.drug}<br>",
                    style: { wrap: 'hard'}

                }
            }
        }
      },
        series:  [
	{name: 'approved', data: [] },
	{name: 'clinical trials', data: [] },
	{name: 'experimental', data: [] },
	{name: 'resistance', data: [] }
      ]
      };
    
    function updateChart(results) {
       /*var series = [
	{name: 'approved', data: [] },
	{name: 'clinical trials', data: [] },
	{name: 'experimental', data: [] },
	{name: 'resistance', data: [] }
      ];*/
      var series = $scope.highchartsBubble.series;
    
      for (var i = 0; i < results.length; i++) {
	var genedrugresults = results[i]['gene-drug-info'];
	for (var j = 0; j < genedrugresults.length; j++ ) {
	  var result = genedrugresults[j];
	  var datapoint = {genes: result.gene.join(', '), drug: result.drug, x: result.dScore, y: result.gScore, z: Math.pow(((Math.abs(result.dScore) + result.gScore)/2) * 10, 10) };
	  if (result.status == 'Approved') {
	    series[0].data.push(datapoint);
	  }
	  if (result.status == 'Clinical') {
	    series[1].data.push(datapoint);
	  }
	  if (result.status == 'Experimental') {
	    series[2].data.push(datapoint);
	  }
	  if (result.sensitivity.indexOf('esistance')!=-1) {
	    series[3].data.push(datapoint);
	  }
	}
      }

    }
    
    $scope.newQuery = function() {
      $scope.results = null;
    }
    
    $scope.showChart = function() {
      
     /* $timeout(function() {*/
	updateChart($scope.results);
	$scope.chartIsShowing = true; // }, 1000);
    }
    
    // methods
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
		  $scope.queryDirect,
		  $scope.queryIndirect,
		  tableState).then(function(result) {	  
	  $scope.results = result['gene-drug-group'];
	  updateChart($scope.results);
	  $scope.isLoading=false;
	  //$scope.$apply();
	});
      }
      
      
    };
       
}]);
