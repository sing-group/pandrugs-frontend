/*
 * PanDrugs Frontend
 *
 * Copyright (C) 2015 - 2017 Fátima Al-Shahrour, Elena Piñeiro,
 * Daniel Glez-Peña and Miguel Reboiro-Jato
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 */
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
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black' // jshint ignore:line
          }
        }
      }
    },
    series: [{
      name: 'Drugs',
      colorByPoint: true,
      data: [{
        name: 'approved',
        y: 50,
        sliced: true,
        selected: true,
        color:'#2BBE83'
      },{
        name: 'approved',
        y: 100,
        sliced: true,
        selected: true,
        color:'#2BBE83'
      },{
        name: 'approved',
        y: 50,
        sliced: true,
        selected: true,
        color:'#2BBE83'
      }]
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
