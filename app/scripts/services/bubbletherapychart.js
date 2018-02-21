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
* @name pandrugsFrontendApp.bubbleTherapyChart
* @description
* # bubbleTherapyChart
* Factory in the pandrugsFrontendApp.
*/
angular.module('pandrugsFrontendApp')
.factory('bubbleTherapyChart', function () {

  // Public API here
  return {
      chart: {
        type: 'bubble',
        zoomType: 'xy',
        events: {

          redraw: function() {
            var hchart = this;
            //window.alert("axis: "+hchart.xAxis[0])
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

              drawRectFromCoordinates(-1.5, 1.0, 1.5, -0.5, 0).attr({
                fill: '#ffffff',
                stroke: 'black',
                'stroke-width': 0

              }).add();

              // add rectangle for best candidates
              drawRectFromCoordinates(0.7, 1, 1, 0.6, 20).attr({
                fill: '#EEFAEE',
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


              drawText(0.72, 0.97, 'BEST CANDIDATES')
              .css({color: '#888', fontWeight:'bold', opacity: 0.5})
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
          verticalAlign: 'bottom'
        },
        xAxis: {
          title: {
            text: '<span class=\"help_icon\" title=\"Measure of the suitability of the drug according to the genomic profile\"></span>Drug Score',
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
            text: '<span class=\"help_icon\" title=\"Measure of the biological relevance of the gene in the tumoral process\"></span>Gene Score',
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
          text: 'Gene and Drugs score chart (click and drag to make zoom)'
        },
        subtitle: {
          text: 'drug approval status: <span style="color: #2BBE83; font-weight: bold">approved</span>, <span style="color: #FFCF3A; font-weight: bold">clinical trials</span>, <span style="color:#337BB7; font-weight: bold">experimental</span>',
          useHTML: true,
          verticalAlign: 'bottom'
        },

        plotOptions: {
          bubble: {
            minSize: 1,
            maxSize: 20,
            tooltip: {
              headerFormat: '',
              pointFormat: 'Status: {point.status}<br>Interaction: {series.name}<br>DScore: {point.xRound}<br>GScore: {point.yRound}<br>Genes: {point.genes}<br>Drug: {point.drug}',
              style: { wrap: 'hard'}

            }
          }
        },
      series:  [
        {name: 'biomarker', data: [], color: 'black', marker: {symbol:'triangle'}},
        {name: 'target', data: [], color: 'black', marker: {symbol:'circle'}},
        {name: 'pathway member', data: [], color: 'black', marker: {symbol:'diamond'}}

      ],

      updateChart: function(results) {
        //window.alert(this.options.chart);
        var series = this.series;
        series[0].data = [];
        series[1].data = [];
        series[2].data = [];
        for (var i = 0; i < results.length; i++) {
          var jitterX = (Math.round((Math.random() - 0.5)*100000) / 1000000000);
          var jitterY = (Math.round((Math.random() - 0.5)*100000) / 1000000000);
          var datapoint = {
            genes: results[i].gene.map(function(geneItem) { return geneItem.geneSymbol; }).join(', '),
            drug: results[i].showDrugName,
            x: results[i].dScore + jitterX,
            xRound: results[i].dScore.toFixed(4),
            y: results[i].gScore + jitterY,
            yRound: results[i].gScore.toFixed(4),
            z: Math.pow(((Math.abs(results[i].dScore) + results[i].gScore)/2) * 10, 10),
            jitter: 'x: '+jitterX.toExponential()+', y: '+jitterY.toExponential(),
            color: results[i].status === 'APPROVED'? '#2BBE83': results[i].status === 'CLINICAL_TRIALS'?'#FFCF3A':'#337BB7',
            status: results[i].status.toLowerCase().replace('_', ' ')

          };
          if (results[i].getBestInteraction() === 'marker') {
            series[0].data.push(datapoint);
          }
          if (results[i].getBestInteraction() === 'target-direct') {
            series[1].data.push(datapoint);
          }
          if (results[i].getBestInteraction() === 'target-indirect') {
            series[2].data.push(datapoint);
          }
        }

        //sort
        series[0].data.sort(function(a,b) {return a.x - b.x});
        series[1].data.sort(function(a,b) {return a.x - b.x});
        series[2].data.sort(function(a,b) {return a.x - b.x});
      }
    };
  });
