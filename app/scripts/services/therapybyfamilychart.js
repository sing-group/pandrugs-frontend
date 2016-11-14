'use strict';

/**
* @ngdoc service
* @name pandrugsdbFrontendApp.therapyByFamilyChart
* @description
* # therapyByFamilyChart
* Factory in the pandrugsdbFrontendApp.
*/
angular.module('pandrugsdbFrontendApp')
.factory('therapyByFamilyChart', function () {
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
				text: 'Drugs by family'
			},
			tooltip: {
				pointFormat: '{point.y} drugs ({point.percentage:.1f}%)'
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
			var total = 0;
			var familycounts = {};
			for (var i = 0; i < results.length; i++) {
				var families = results[i].family;
				total = total + 1;
				for (var j = 0; j < families.length; j++) {
					var family = families[j];
					familycounts[""+family] =
					family in familycounts ? familycounts[family] + 1: 1;
				}
			}

			this.series[0].data = [];
			for (family in familycounts) {
				this.series[0].data.push(
					{
						name: family,
						y: familycounts[family],
						sliced: true,
						selected: true
					}
				);
			}

			//sort
			this.series[0].data = this.series[0].data.sort(function(data1, data2){
				return data1.y - data2.y;
			});
		}
	};
});
