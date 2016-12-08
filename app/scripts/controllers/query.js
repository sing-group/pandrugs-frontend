'use strict';

/**
* @ngdoc function
* @name pandrugsdbFrontendApp.controller:QueryCtrl
* @description
* # QueryCtrl
* Controller of the pandrugsdbFrontendApp
*/
angular.module('pandrugsdbFrontendApp')
.controller('QueryCtrl',
['$scope',
'user',
'database',
'bubbleTherapyChart',
'therapyByStatusChart',
'therapyByFamilyChart',
'geneDrugNetworkChart',
'$timeout',
'$interval',
'filterFilter',
function (
	$scope,
	user,
	db,
	bubbleChart,
	therapyByStatusChart,
	therapyByFamilyChart,
	geneDrugNetworkChart,
	$timeout,
	$interval,
	filterFilter
) {

		$scope.$timeout = $timeout;

		$scope.vcffile = '';
		$scope.computationName = 'My Computation';

		$scope.computations = {};

		// ======== QUERY PARAMETERS ======
		$scope.genes = '';
    $scope.drugs = '';
		$scope.generank = '';
		$scope.computationId = '';
		$scope.queryCancerFda = true;
		$scope.queryCancerClinical = true;
		$scope.queryOtherFda = true;
		$scope.queryOtherClinical = true;
		$scope.queryOtherExperimental = true;
		$scope.queryTarget = true;
		$scope.queryMarker = true;


		var previousResults = null; //do not redraw graph each time the network tab is selected
		$scope.selectedTab = "genes";
		$scope.setSelectedTab = function (tab) {
			$scope.selectedTab = tab;
			if (tab === 'network') {
				if (previousResults === null || previousResults != results){
					$scope.updateNetworkChart();
					previousResults = results;
				}
			}
		};

		// cancer types
		$scope.cancerTypes = [];
		db.getCancerTypes().then(function(results) {
			for (var i=0; i<results.length; i++){
				$scope.cancerTypes.push({name:results[i], selected:true});
			}
		});

		// selected cancer types
		$scope.selectedCancerTypes = [];

		$scope.selectAllCancerTypes = function() {
			$scope.cancerTypes.forEach(function(cancerType){
				cancerType.selected = true;
			});
		};

		$scope.clearCancerTypesSelection = function() {
			if ($scope.firstTimeCancerSelection) {
				$scope.firstTimeCancerSelection = false;
			}
			$scope.cancerTypes.forEach(function(cancerType){
				cancerType.selected = false;
			});
		};

		$scope.firstTimeCancerSelection = true;
		// watch cancerTypes for changes
		$scope.$watch('cancerTypes|filter:{selected:true}', function (nv) {
			//the first time we will unchek all and invert the unselected one
			//as selected
			if ($scope.firstTimeCancerSelection === true && nv.length < $scope.cancerTypes.length) {
				$scope.firstTimeCancerSelection = false;
				$scope.cancerTypes.forEach(function(cancerType){
					cancerType.selected = !cancerType.selected;
				});
			}
			$scope.selectedCancerTypes = nv.map(function (cancerType) {
				return cancerType.name;
			});
		}, true);

		// ========== RESULTS ========
		$scope.results=null;

		// bubble chart
		$scope.highchartsBubble = bubbleChart;

		$scope.newQuery = function() {
			$scope.results = null;
		};


		// therapy by status chart
		$scope.highchartsTherapyByStatus = therapyByStatusChart;

		// therapy by family chart
		$scope.highchartsTherapyByFamily = therapyByFamilyChart;

		var charts = [bubbleChart, therapyByStatusChart, therapyByFamilyChart/*, geneDrugNetworkChart*/];

		function updateCharts(results) {
			for (var i = 0; i<charts.length; i++) {
				charts[i].updateChart(results);
			}
		}

		$scope.networkparams = {
			showInteractions: false
		};

		$scope.networkChartLoading = true;
		$scope.updateNetworkChart = function() {
			$scope.networkChartLoading = true;
			var degree = 0;
			if ($scope.networkparams.showInteractions) {
				degree = 1;
			}
			$timeout(function() {
				geneDrugNetworkChart.updateChart(results, degree).then(function(graph){$scope.networkChartLoading = false;});
			}, 500);
		}

		function generateCSV(results) {
			var csv = [];
			csv.push("Gene(s),Drug,Family,Source(s),Drug status,Type of therapy,Interaction,DScore,GScore,Info,Gene,Sensitivity,Alteration,Family,Source(s),DScore,GScore");

			results.forEach(function(row) {

				csv.push("\""+row.gene+"\""+","
					+"\""+row['show-drug-name']+"\""+","
					+"\""+row['family'].join("|")+"\""+","
					+"\""+row['source'].map(function(elem){ return elem.name;}).join(", ")+"\""+","
					+"\""+row['status-description']+"\""+","
					+"\""+(row['therapy']?row['therapy']:"")+"\""+","
					+"\""+row.getBestInteraction()+"\""+","
					+"\""+(Math.round(row['dScore']*10000)/10000)+"\""+","
					+"\""+(Math.round(row['gScore']*10000)/10000)+"\"");

					row['gene-drug-info'].forEach(
						function(genedrug) {
							csv.push("\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\","
								+"\""+genedrug['drugStatusInfo']+"\""+","
								+"\""+genedrug['gene']+"\""+","
								+"\""+(genedrug['sensitivity']=='BOTH'?'SENSITIVITY / RESISTANCE':genedrug['sensitivity'])+"\""+","
								+"\""+genedrug['alteration']+"\""+","
								+"\""+genedrug['family']+"\""+","
								+"\""+genedrug['source'].join(', ')+"\""+","
								+"\""+(Math.round(genedrug['dScore']*10000)/10000)+"\""+","
								+"\""+(Math.round(genedrug['gScore']*10000)/10000)+"\""
							);
						}
					);
			});
			return csv.join("\n");
		}

		$scope.showChart = function() {
			updateCharts($scope.results);
			$scope.chartIsShowing = true;
		};

		var results;
		function manageResults(result) {
			results = result['gene-drug-group'];

			$scope.results = results.filter(function(elem) {
				if (elem.status === 'EXPERIMENTAL' || elem.status === 'CLINICAL_TRIALS') {
					return true;
				}

				if (elem.cancer.length == 0) {
					var allCancerSelected = $scope.cancerTypes.every(function (cancerType) {
						return cancerType.selected;
					});

					return allCancerSelected;
				} else {
					var interesting = elem.cancer.find(function(cancerType) {
						return $scope.selectedCancerTypes.indexOf(cancerType.toUpperCase()) != -1;
					});

					return interesting;
				}
			});

			//$scope.results = result['gene-drug-group'];
			for (var i = 0; i < $scope.results.length; i++) {
				var result = $scope.results[i];
				result.getBestInteraction = function() {
					var best = "target-indirect";

					for (var i = 0; i < this['gene-drug-info'].length; i++) {
						if (this['gene-drug-info'][i]['target'] == 'marker') {
							if (best = "target-indirect")
								best = "marker";
						} else if (this['gene-drug-info'][i]['indirect'] == null) {
							best = "target-direct";
							break;
						}
					}

					return best;
				}
			}
			$scope.csvcontent = "data:text/csv;charset=utf-8,";
			$scope.csvcontent += generateCSV($scope.results);
			$scope.csvcontent = encodeURI($scope.csvcontent);

			updateCharts($scope.results);
			$scope.isLoading=false;
		}

		//	========== QUERY ========
		$scope.query = function(tableState) {
			if ($scope.selectedTab == 'generank' && $scope.generank !== '') {
				$scope.isLoading = true;

				db.rankedSearch($scope.generank,
					$scope.queryCancerFda,
					$scope.queryCancerClinical,
					$scope.queryOtherFda,
					$scope.queryOtherClinical,
					$scope.queryOtherExperimental,
					$scope.queryTarget,
					$scope.queryMarker,
					true,
					true,
					tableState
				).then(manageResults);
			} else if ($scope.selectedTab == 'vcfranking' && $scope.computationId !== '') {
				$scope.isLoading = true;

				db.computationIdSearch($scope.computationId,
					$scope.queryCancerFda,
					$scope.queryCancerClinical,
					$scope.queryOtherFda,
					$scope.queryOtherClinical,
					$scope.queryOtherExperimental,
					$scope.queryTarget,
					$scope.queryMarker,
					true,
					true,
					tableState
				).then(manageResults);
			} else if ($scope.selectedTab == 'genes' && $scope.genes !== '') {
				searchBy('searchByGenes', 'genes', tableState);
			} else if ($scope.selectedTab == 'drugs' && $scope.drugs !== '') {
				searchBy('searchByDrugs', 'drugs', tableState);
      }
		};

		function unique(data) {
			var unique = [];
			var toUpper = [];
			data.forEach(function(item) {
				if (toUpper.indexOf(item.toUpperCase())== -1) {
					unique.push(item);
					toUpper.push(item.toUpperCase());
				}
			});
			return unique;
		}

		function searchBy(searchFunction, scopeValue, tableState) {
			var uniqueUpperCaseValues = unique($scope[scopeValue].split('\n')
				.map(function(item) {
					return item.trim().toUpperCase();
				})
			);

			$scope[scopeValue] = uniqueUpperCaseValues.join('\n');

			$scope.isLoading = true;
			db[searchFunction](uniqueUpperCaseValues,
				$scope.queryCancerFda,
				$scope.queryCancerClinical,
				$scope.queryOtherFda,
				$scope.queryOtherClinical,
				$scope.queryOtherExperimental,
				$scope.queryTarget,
				$scope.queryMarker,
				true,
				true,
				tableState
			).then(manageResults);
		}

		$scope.exportnetwork = function() {
			$scope.pngcontent = geneDrugNetworkChart.exportnetwork(3);
		};

		function buildTextAreaConfig(searchFunction) {
			return {
				autocomplete: [{
					words: [/([()-_A-Za-z0-9]+)/gi]
				}],
				dropdown: [{
					trigger: /([()-_A-Za-z0-9]+)/gi,
					list: function(match, callback) {
						db[searchFunction](match[1])
							.then(function(response) {
								var data = response.data.map(function(queryValue) {
									return {
										display: queryValue,
										item: queryValue
									}
								});

								callback(data);
							});
					},
					onSelect: function(item) {
						return item.item + '\n';
					},
					mode: 'replace'
				}]
			};
		}

		$scope.genesTextAreaConfig = buildTextAreaConfig('listGeneSymbols');

    $scope.drugsTextAreaConfig = buildTextAreaConfig('listStandardDrugNames');

		$scope.getCurrentUser = function() {
			return user.getCurrentUser();
		}

		$scope.submitVCF = function() {
			$scope.largeProcess = "Uploading VCF File, please wait";
			user.submitComputation($scope.vcffile, $scope.computationName,
				function(){
					alert("Computation submitted successfully. We will start to analyze it as soon as we can.");
					$scope.largeProcess = null;
				},
				function(){
					alert("ERROR: computation could not be submitted.");
					$scope.largeProcess = null;
				}
			)
		}

		$scope.deleteComputation = function(computationId) {
			if (window.confirm("Are you sure?")) {
				user.deleteComputation(computationId,
				function() {
					alert("Computation deleted successfully.")
				},
				function() {
					alert("ERROR: computation could not be deleted.")
				});
			}
		}

		//update computation status...
		function reloadComputations() {
			if (user.getCurrentUser() !== 'anonymous') {
				user.getComputations(function(computations) {
					$scope.computations = computations;
				}, null);
			}
		}
		reloadComputations();
		$interval(reloadComputations, 5000);
	}]);
