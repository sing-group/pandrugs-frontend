
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
            zoomType: 'xy',
	    events: {
	      
	      redraw: function() {
		var hchart = $scope.highchartsBubble.getHighcharts();
		
		function toXPixel(xAxisPos) {
		  return hchart.xAxis[0].toPixels(xAxisPos, false);
		}
		function toYPixel(yAxisPos) {
		  return hchart.yAxis[0].toPixels(yAxisPos, false);
		}
		
		function drawRectFromCoordinates(fromX, fromY, toX, toY, radius) {		  
		  return hchart.renderer.rect(
		    toXPixel(fromX),
		    toYPixel(fromY),     
		    toXPixel(toX) - toXPixel(fromX),
		    toYPixel(toY) - toYPixel(fromY),    
		    radius);
		}
		
		function drawPath(fromX, fromY, toX, toY) {
		    return hchart.renderer.path(['M',  
		    toXPixel(fromX),
		    toYPixel(fromY), 
		    'L', 
		    toXPixel(toX),
		    toYPixel(toY)]);
		}
		
		function drawText(atX, atY, text) {
		  return hchart.renderer.text(text, toXPixel(atX), toYPixel(atY));
		}
		 
		 //clearing rectangle
		  
		 drawRectFromCoordinates(-1.5, 1.5, 1.5, -0.5, 0).attr({
		    fill: '#ffffff',
		    stroke: 'black',	
		    'stroke-width': 0
		    
		  }).add();
		  
		  // add rectangle for best candidates
		  drawRectFromCoordinates(0.7, 1, 1, 0.6, 20).attr({
		    fill: '#DCFCEF',
		    stroke: 'black',	
		    'stroke-width': 0
		    
		  }).add();
		
		  //plot lines
		  drawPath(-1, 0.6, 1, 0.6).attr({
		    'stroke-width': 2,
		    dashstyle: 'ShortDot',
		    stroke: '#FAAFC4'
		  }).add();
		  
		  drawPath(0.7, 0, 0.7, 1).attr({
		    'stroke-width': 2,
		    dashstyle: 'ShortDot',
		    stroke: '#FAAFC4'
		  }).add();
		  
		  drawPath(0, 0, 0, 1).attr({
		    'stroke-width': 1,
		    dashstyle: 'Solid',
		    stroke: '#888'
		  }).add();
		  
		  // draw thik RESISTANCE - SENSISITIVITY bars
		  drawPath(-1, 0, 0, 0).attr({
		    'stroke-width': 5,
		    stroke: '#FF7F7F'
		  }).add();
		  
		  drawPath(0, 0, 1, 0).attr({
		    'stroke-width': 5,
		    stroke: '#7FBF7F'
		  }).add();
		  		  
		  
		  drawText(0.72, 1.01, 'BEST CANDIDATES')
		  .css({color: '#888', fontWeight:'bold'})
		  .add();
		  
		  drawText(-0.45, -0.115, 'RESISTANCE')
		  .css({color: '#FF7F7F', fontWeight:'bold'})
		  .add();
		  
		  drawText(0.45, -0.115, 'SENSITIVITY')
		  .css({color: '#7FBF7F', fontWeight:'bold'})
		  .add();
		  
	      }
	    }
        },
	legend: {
	    verticalAlign: 'top'
	},
	xAxis: {
	  title: { 
	    text: '<span class=\"help_icon\" title=\"Drug Score is ... under construction\"></span>Drug Score',  
	    useHTML: true    
	  },
	  min: -1,
	  max: 1,
	  plotLines: [
	    {
	      color: 'red',
	      dashStyle: 'ShortDash',
	      value: 0.7,
	      width: 2      
	    }
	  ]
	},
	yAxis: {
	  title: { 
	    text: '<span class=\"help_icon\" title=\"Gene Score is ... under construction\"></span>Gene Score',  
	    useHTML: true    
	  },
	 
	  min: 0,
	  max: 1,
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
            text: '',    
        },
	plotOptions: {
            bubble: {
                minSize: 1,
                maxSize: 20,
                tooltip: {
                    headerFormat: '',
                    pointFormat: 'Status: {series.name}<br>DScore: {point.xRound}<br>GScore: {point.yRound}<br>Genes: {point.genes}<br>Drug: {point.drug}<br>',
                    style: { wrap: 'hard'}

                }
            }
        }
      },
        series:  [
	{name: 'approved', data: [], color:'#2BBE83'},
	{name: 'clinical trials', data: [], color: '#FFCF3A'},
	{name: 'experimental', data: [], color: '#337BB7'}

      ]
      };
    
    function updateChart(results) {       
      var series = $scope.highchartsBubble.series;
    
      for (var i = 0; i < results.length; i++) {
	var genedrugresults = results[i]['gene-drug-info'];
	for (var j = 0; j < genedrugresults.length; j++ ) {
	  var result = genedrugresults[j];
	  var datapoint = {genes: result.gene.join(', '), drug: results[i]['show-drug-name'], x: result.dScore, xRound: result.dScore.toFixed(4), y: result.gScore, yRound: result.gScore.toFixed(2), z: Math.pow(((Math.abs(result.dScore) + result.gScore)/2) * 10, 10) };
	  if (result.status === 'Approved') {
	    series[0].data.push(datapoint);
	  }
	  if (result.status === 'Clinical') {
	    series[1].data.push(datapoint);
	  }
	  if (result.status === 'Experimental') {
	    series[2].data.push(datapoint);
	  }  
	}
      }
      
    }
    
    $scope.newQuery = function() {
      $scope.results = null;
    };
    
    $scope.showChart = function() {      
	updateChart($scope.results);
	$scope.chartIsShowing = true;
    };
    
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
