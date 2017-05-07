'use strict';

/**
* @ngdoc function
* @name pandrugsFrontendApp.controller:QueryCtrl
* @description
* # QueryCtrl
* Controller of the pandrugsFrontendApp
*/
angular.module('pandrugsFrontendApp')
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
'$sce',
'$location',
'$filter',
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
  $sce,
  $location,
  $filter
) {

    $scope.$timeout = $timeout;

    $scope.vcffile = '';
    $scope.computationName = 'My Computation';

    $scope.computations = {};

    $scope.paginationOptions= [5, 20, 100, 'all'];

    // ======== QUERY PARAMETERS ======
    $scope.genes = '';
    $scope.drugs = [];
    $scope.drugQuery = '';
    $scope.drugItems = [];
    $scope.loadingDrugs = true;
    $scope.generank = '';
    $scope.computationId = '';
    $scope.queryCancerFda = true;
    $scope.queryCancerClinical = true;
    $scope.queryOtherFda = true;
    $scope.queryOtherClinical = true;
    $scope.queryOtherExperimental = true;
    $scope.queryTarget = true;
    $scope.queryMarker = true;

    $scope.drugTemplateUrl = 'views/partials/drugname-list-item.tpl.html';

    var previousResults = null; //do not redraw graph each time the network tab is selected
    $scope.selectedTab = 'genes';
    $scope.setSelectedTab = function (tab) {
      $scope.selectedTab = tab;
      if (tab === 'network') {
        if (previousResults === null || previousResults !== results) {
          $scope.updateNetworkChart();
          previousResults = results;
        }
      }
    };


    $scope.getComputationIdQuery = function() {
      return $location.search().computationId;
    };

    if ($scope.getComputationIdQuery() !== undefined) {
      $scope.setSelectedTab('vcfranking');
      /*$scope.computationIdQuery.each(function(item){
        window.alert(item);
      });*/
    }

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
        geneDrugNetworkChart.updateChart(results, degree)
          .then(function() { $scope.networkChartLoading = false; });
      }, 500);
    };

    function parseGenes(genes) {
      return unique(genes.split('\n')
        .filter(function(item){
          return item.trim().length > 0;
        })
        .map(function(item){
          return item.replace(/\s.*/, '');
        })
        .map(function(item) {
          return item.trim().toUpperCase();
        })
      );
    }

    function generateCSV(results) {
      var csv = [];
      csv.push('Gene(s),Drug,Family,Source(s),Drug status,Type of therapy,Interaction,DScore,GScore,Info,Gene,Sensitivity,Alteration,Family,Source(s),DScore,GScore');

      results.forEach(function(row) {

        csv.push('\"'+row.gene+'\"'+
          ','+'\"'+row.showDrugName+'\"'+
          ','+'\"'+row.family.join('|')+'\"'+
          ','+'\"'+row.source.map(function(elem){ return elem.name;}).join(', ')+'\"'+
          ','+'\"'+row.statusDescription+'\"'+
          ','+'\"'+(row.therapy?row.therapy:'')+'\"'+
          ','+'\"'+row.getBestInteraction()+'\"'+
          ','+'\"'+(Math.round(row.dScore*10000)/10000)+'\"'+
          ','+'\"'+(Math.round(row.gScore*10000)/10000)+'\"' +
          ',\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\",\"-\"');

          row.geneDrugInfo.forEach(
            function(genedrug) {
              csv.push('\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",'+
                '\"'+genedrug.drugStatusInfo+'\"'+','+
                '\"'+genedrug.gene+'\"'+','+
                '\"'+(genedrug.sensitivity==='BOTH'?'SENSITIVITY / RESISTANCE':genedrug.sensitivity)+'\"'+','+
                '\"'+genedrug.alteration+'\"'+','+
                '\"'+genedrug.family+'\"'+','+
                '\"'+genedrug.source.join(', ')+'\"'+','+
                '\"'+(Math.round(genedrug.dScore*10000)/10000)+'\"'+','+
                '\"'+(Math.round(genedrug.gScore*10000)/10000)+'\"'
              );
            }
          );
      });
      return csv.join('\n');
    }

    $scope.showChart = function() {
      updateCharts($scope.results);
      $scope.chartIsShowing = true;
    };

    $scope.allCancerSelected = function() {
      return $scope.cancerTypes.every(function (cancerType) {
        return cancerType.selected;
      });
    };

    $scope.getGeneSymbols = function(genesArray) {
      return genesArray.map(function(e) {return e.geneSymbol;});
    };


    var results;

    function manageResults(tableState) {
      function sort(results) {
        return $filter('orderBy')(results, tableState.sort.predicate, tableState.sort.reverse);
      }

      function paginate(results) {
        if (tableState.pagination.number === $scope.paginationOptions[$scope.paginationOptions.length - 1]) {
          tableState.pagination.start = 0;
          tableState.pagination.number = results.length;
        }

        tableState.pagination.numberOfPages = Math.ceil(results.length / tableState.pagination.number);
        // show only current page

        return results.slice(tableState.pagination.start, tableState.pagination.start+tableState.pagination.number);
      }

      return function(result) {
        results = result.geneDrugGroup;

        $scope.results = results.filter(function(elem) {
          if (elem.status === 'EXPERIMENTAL' || elem.status === 'CLINICAL_TRIALS') {
            return true;
          }

          if (elem.cancer.length === 0) {
            return $scope.allCancerSelected();
          } else {
            var interesting = elem.cancer.find(function(cancerType) {
              return $scope.selectedCancerTypes.indexOf(cancerType.toUpperCase()) !== -1;
            });

            return interesting;
          }
        });

        var getBestIteration = function() {
          var bestdscore = -1;
          var best = '';

          for (var i = 0; i < this.geneDrugInfo.length; i++) {
            if (this.geneDrugInfo[i].dScore > bestdscore) {
              bestdscore = this.geneDrugInfo[i].dScore;
              if (this.geneDrugInfo[i].target === 'marker') {
                best = 'marker';
              } else if (this.geneDrugInfo[i].target === 'target' && this.geneDrugInfo[i].indirect === null) {
                best = 'target-direct';
              } else if (this.geneDrugInfo[i].target === 'target' && this.geneDrugInfo[i].indirect !== null){
                best = 'target-indirect';
              }
            }
          }
          return best;
        };

        var getSensitivity = function() {
          var sensitivity;

          for (var i = 0; i < this.geneDrugInfo.length; i++) {
            var gdi = this.geneDrugInfo[i];

            if (gdi.sensitivity === 'BOTH') {
              return 'BOTH';
            } else if (sensitivity) {
              if (sensitivity !== gdi.sensitivity) {
                return 'BOTH';
              }
            } else {
              sensitivity = gdi.sensitivity;
            }
          }

          return sensitivity;
        };

        var getWarnings = function() {
          var warnings;

          this.geneDrugInfo.forEach(function(gdi) {
            gdi.warning.forEach(function(warning) {
              if (warnings) {
                warnings += '\n' + warning;
              } else {
                warnings = warning;
              }
            });
          });

          return warnings;
        };

        for (var i = 0; i < $scope.results.length; i++) {
          var geneDrugGroup = $scope.results[i];

          geneDrugGroup.getBestInteraction = getBestIteration;
          geneDrugGroup.getSensitivity = getSensitivity;
          geneDrugGroup.getWarnings = getWarnings;
        }

        if ($scope.results.length === 1) {
          $scope.results[0].moreinfo = true;
        }

        $scope.csvcontent = 'data:text/csv;charset=utf-8,';
        $scope.csvcontent += generateCSV($scope.results);
        $scope.csvcontent = encodeURI($scope.csvcontent);

        updateCharts($scope.results);

        if (!angular.isUndefined(tableState)) {
          if (tableState.sort.predicate) {
            $scope.results = sort($scope.results);
          }
          $scope.resultsPaginated = paginate($scope.results);
        }

        $scope.isLoading = false;
      };
    }

    $scope.pasteStomachCarcinomaExample = function() {
      $scope.genes = 'TP53\nARID1A\nB2M\nPIK3CA\nPTEN\nKRAS\nRHOA\nMXRA8';
    };

    $scope.pasteAngiogenesisExample = function() {
      $scope.genes = 'VEGFA\nVEGFB\nKDR\nIL8\nCXCR1\nCXCR2\n';
    };

    $scope.pasteSignalingPathwayExample = function() {
      $scope.genes = 'PIK3CA\nPIK3R1\nPIK3R2\nPTEN\nPDPK1\nAKT1\nAKT2\nFOXO1\nFOXO3\nMTOR\nRICTOR\nTSC1\nTSC2\nRHEB\nAKT1S1\nRPTOR\nMLST8\n';
    };

    //  ========== QUERY ========
    $scope.query = function(tableState) {
      if ($scope.selectedTab === 'generank' && $scope.generank !== '') {
        $scope.isLoading = true;
        var reader = new FileReader();
        reader.onload = function() {
            $scope.parsedInputGenes = parseGenes(reader.result);
            db.genesPresence($scope.parsedInputGenes).then(function(presence){
              $scope.genespresence = presence;
            });
        };

        reader.readAsText($scope.generank);

        db.rankedSearch($scope.generank,
          $scope.queryCancerFda,
          $scope.queryCancerClinical,
          $scope.queryOtherFda,
          $scope.queryOtherClinical,
          $scope.queryOtherExperimental,
          $scope.queryTarget,
          $scope.queryMarker,
          true,
          true
        ).then(manageResults(tableState));
      } else if ($scope.selectedTab === 'vcfranking' && $scope.computationId !== '') {
        $scope.isLoading = true;
        db.genesPresence($scope.computations[$scope.computationId].affectedGenes).then(function(presence){
          $scope.genespresence = presence;
        });

        db.computationIdSearch($scope.computationId,
          $scope.queryCancerFda,
          $scope.queryCancerClinical,
          $scope.queryOtherFda,
          $scope.queryOtherClinical,
          $scope.queryOtherExperimental,
          $scope.queryTarget,
          $scope.queryMarker,
          true,
          true
        ).then(manageResults(tableState));
      } else if ($scope.selectedTab === 'genes' && $scope.genes) {

        var uniqueUpperCaseGenes = parseGenes($scope.genes);

        $scope.genes = uniqueUpperCaseGenes.join('\n');
        $scope.parsedInputGenes = uniqueUpperCaseGenes;

        db.genesPresence($scope.parsedInputGenes).then(function(presence){
          $scope.genespresence = presence;
        });

        searchBy(db.searchByGenes, uniqueUpperCaseGenes, tableState);
      } else if ($scope.selectedTab === 'drugs' && $scope.drugs) {
        var standardDrugNames = unique($scope.drugs
          .map(function(item) {
            return item.standardName;
          })
        );

        searchBy(db.searchByDrugs, standardDrugNames, tableState);
      }
    };

    function unique(data) {
      var uniqueElems = [];
      var toUpper = [];
      data.forEach(function(item) {
        if (toUpper.indexOf(item.toUpperCase()) === -1) {
          uniqueElems.push(item);
          toUpper.push(item.toUpperCase());
        }
      });
      return uniqueElems;
    }

    function searchBy(searchFunction, value, tableState) {
      $scope.isLoading = true;
      searchFunction(value,
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
      ).then(manageResults(tableState));
    }

    $scope.exportnetwork = function() {
      $scope.pngcontent = geneDrugNetworkChart.exportnetwork(3);
    };

    $scope.genesTextAreaConfig = {
      autocomplete: [{
        words: [/([()-_A-Za-z0-9]+)/gi]
      }],
      dropdown: [{
        trigger: /([()-_A-Za-z0-9]+)/gi,
        list: function(match, callback) {
          db.listGeneSymbols(match[1])
            .then(function(response) {
              var data = response.data.map(function(queryValue) {
                return {
                  display: queryValue,
                  item: queryValue
                };
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

    $scope.$watch('drugQuery', function(newValue) {
      $scope.loadingDrugs = true;

      if (newValue) {
        var query = $scope.drugQuery;
        db.listDrugNames(newValue, 10)
          .then(function(response) {
            $scope.drugItems = response.data.map(function(item) {
              item.query = query;
              return item;
            });
            $scope.loadingDrugs = false;
          });
      } else {
      //  $scope.$apply(); // Forces UI update for loadingDrugs
        $scope.drugItems = [];
        $scope.loadingDrugs = false;
      }
    });

    $scope.getCurrentUser = function() {
      return user.getCurrentUser();
    };

    $scope.submitVCF = function() {
      $scope.largeProcess = 'Uploading VCF File, please wait';
      user.submitComputation($scope.vcffile, $scope.computationName,
        function(newId) {
          if (user.getCurrentUser() === 'anonymous') {

            var followUrl = $location.absUrl().substring(0, $location.absUrl().indexOf('#'))+'#/query?computationId='+newId;
            window.alert('Computation submitted successfully. Please keep this link in a SAFE PLACE in order to get back and follow the computation progress:\n'+followUrl);

            $timeout(function() {
                //do redirection asynchronously, since in chrome the modal vcf dialog black background does not disappear ...
              document.location.href = followUrl;
            });

          } else {
            window.alert('Computation submitted successfully. We will start to analyze it as soon as we can.');
          }
          $scope.largeProcess = null;
        },
        function() {
          window.alert('ERROR: computation could not be submitted.');
          $scope.largeProcess = null;
        }
      );
    };

    $scope.deleteComputation = function(computationId) {
      if (window.confirm('Are you sure?')) {
        user.deleteComputation(computationId,
        function() {
          window.alert('Computation deleted successfully.');
        },
        function() {
          window.alert('ERROR: computation could not be deleted.');
        });
      }
    };

    $scope.highlight = function(text) {
      return $sce.trustAsHtml(text.replace(new RegExp($scope.drugQuery, 'gi'), '<span class="highlightedText">$&</span>'));
    };

    //update computation status...
    function reloadComputations() {

      if ($scope.selectedTab === 'vcfranking') {
        if (user.getCurrentUser() !== 'anonymous') {
          user.getComputations(function(computations) {
            var savedExample;

            if ($scope.computations.example !== undefined) {
              savedExample = $scope.computations.example;
            }
            $scope.computations = computations;

            if (savedExample) {
              $scope.computations.example = savedExample;
            }

          }, null);
        } else if($scope.getComputationIdQuery() !== undefined) {
          user.getComputation('guest', $scope.getComputationIdQuery(), function(computation){
            $scope.computations[$scope.getComputationIdQuery()] = computation;
            if (!computation.finished || computation.failed || computation.affectedGenes.length === 0) {
              $scope.computationId = '';
            } else {
              $scope.computationId = $scope.getComputationIdQuery();
            }
          }, null);
        }
      }
    }
    reloadComputations();
    $scope.reloadComputationsTask = $interval(reloadComputations, 5000);

    // stop reloading computations
    $scope.$on('$routeChangeStart', function() {
      if ($scope.reloadComputationsTask !== undefined) {
        $interval.cancel($scope.reloadComputationsTask);
      }
    });


    // automatic examples
    if ($location.search().example !== undefined) {
      switch ($location.search().example) {
        case 'genes':
          $scope.pasteSignalingPathwayExample();
          $timeout(function(){
            $scope.query();
          });

        break;
        case 'vcf':
          $location.search().computationId = 'example';
          $scope.computationId = 'example';
          user.getComputation('guest', 'example', function(computation){
            $scope.computations.example = computation;
            $scope.setSelectedTab('vcfranking');
            $timeout(function(){
              $scope.query();
            });
          });

        break;
        case 'drugs':
          $scope.setSelectedTab('drugs');
          $scope.drugs = [{standardName: 'Palbociclib'}];
          $timeout(function(){
            $scope.query();
          });
        break;
      }
    }
  }]);
