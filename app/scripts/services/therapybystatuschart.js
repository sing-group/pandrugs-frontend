'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.therapyByStatusChart
 * @description
 * # therapyByStatusChart
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('therapyByStatusChart', function () {
    // Public API here
    return {
      options: {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Drugs by approval status'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        }
      },
        series: [{
            name: "Drugs",
            colorByPoint: true,
            data: [{
                name: "approved",
                y: 0,
                sliced: true,
                selected: true,
		color:'#2BBE83'
            }, {
                name: "clinical trials",
                y: 0,
		color: '#FFCF3A'
            }, {
                name: "experimental",	   
                y: 0,
                color: '#337BB7'
            }]
        }]
        ,
	updateChart: function(results) {
	  
      
	  var approved = 0;
	  var clinical = 0;
	  var experimental = 0;
	  
	  for (var i = 0; i < results.length; i++) {
	    
	    
	    if (results[i].status === 'APPROVED') {
	      approved ++;
	    }
	    if (results[i].status === 'CLINICAL_TRIALS') {
	      clinical ++;
	    }
	    if (results[i].status === 'EXPERIMENTAL') {
	      experimental ++;
	    }  
	 }
	 
	 this.series[0].data[0].y = (approved / results.length)*100;
	 this.series[0].data[1].y = (clinical / results.length)*100;
	 this.series[0].data[2].y = (experimental / results.length)*100;	
	 
	 
	}
    };
  });
