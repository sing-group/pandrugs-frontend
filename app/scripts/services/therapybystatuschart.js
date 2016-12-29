'use strict';

/**
* @ngdoc service
* @name pandrugsFrontendApp.therapyByStatusChart
* @description
* # therapyByStatusChart
* Factory in the pandrugsFrontendApp.
*/
angular.module('pandrugsFrontendApp')
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
        pointFormat: '{point.y} drugs ({point.percentage:.1f}%)</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      }
    },
    series: [{
      name: 'Drugs',
      colorByPoint: true,
      data: []
    }],
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

      this.series[0].data[0] = {
        name: 'approved',
        y: approved,
        sliced: true,
        selected: true,
        color:'#2BBE83'
      };

      this.series[0].data[1] =  {
        name: 'clinical trials',
        y: clinical,
        color: '#FFCF3A'
      };

      this.series[0].data[2] = {
        name: 'experimental',
        y: experimental,
        color: '#337BB7'
      };

      //sort
      this.series[0].data = this.series[0].data.sort(function(data1, data2){
        return data1.y - data2.y;
      });
    }
  };
});
