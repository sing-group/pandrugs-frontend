'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.geneDrugNetworkChart
 * @description
 * # geneDrugNetworkChart
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('geneDrugNetworkChart', function ($timeout) {

    var elementID = "genedrugnetworkgraph";

    var graph;
    return {

      updateChart: function(results) {

        //create data structures
        var graphData = {};
        if (results) {

        results.forEach(function(group) {
          if (group.gScore > 0.6 && group.dScore > 0.7) {
            group['gene-drug-info'].forEach(function(genedruginfo) {

              var drug = {drugname: genedruginfo.drug.substring(0, Math.min(genedruginfo.drug.length, 30))};
              if (genedruginfo['indirect'] != null) {
                drug.indirectgene = genedruginfo['indirect'];
              }

              genedruginfo['gene'].forEach(function(gene){

                if (! (gene in graphData)) {
                  graphData[gene] = {direct: {approved: [], experimental: []},
                                     indirect: {approved: [], experimental: []}};
                }

                var interactionArray = null;
                if (genedruginfo['indirect'] != null) {
                  interactionArray = graphData[gene].indirect;
                }
                else {
                  interactionArray = graphData[gene].direct;
                }

                var drugArray = null;

                if (genedruginfo['status'] === 'APPROVED') {
                  drugArray = interactionArray.approved;
                } else {
                  drugArray = interactionArray.experimental;
                }

                drugArray.push(drug);
              });
            });
          }
        });
      }

      //create elements
      var nodes = [];
      var edges = [];

      nodes.push({ data: {id: 'root'}, classes: 'root'});

      Object.keys(graphData).forEach(function(gene) {
        function createSubgraphForInteractionType(interactionName) {
          function createSubgraphForStatus(statusName) {
            var nodeText = '';
            graphData[gene][interactionName][statusName].forEach(function(drug){
              nodeText += drug.drugname+(('indirectgene' in drug)?'('+drug.indirectgene+')':'')+'\n';
            });

            if (nodeText.length > 0) {
              nodes.push({data: {id: 'drugs-for-'+gene+'-'+interactionName+'-'+statusName, drugs: nodeText}, classes: 'drugs '+statusName});
              edges.push({data: {id: gene+'-'+interactionName+'-drugs-'+statusName, source: gene+'-'+interactionName+'-node', target: 'drugs-for-'+gene+'-'+interactionName+'-'+statusName}});
            }
          }

          if (
            graphData[gene][interactionName]['approved'].length > 0 ||
            graphData[gene][interactionName]['experimental'].length > 0
          ) {
            nodes.push({data:{id:gene+'-'+interactionName+'-node', type:interactionName.toUpperCase()}, classes: 'interaction-type'});
            edges.push({data: {id:gene+'-'+interactionName, source: gene, target: gene+'-'+interactionName+'-node'}});

            createSubgraphForStatus('approved');
            createSubgraphForStatus('experimental');
          }
        }
        nodes.push({data: {id:gene, genename:gene}, classes:'gene'});
        edges.push({data:{id:'root'+gene, source:'root', target:gene}});

        createSubgraphForInteractionType('direct');
        createSubgraphForInteractionType('indirect');
      });


        graph = cytoscape({
          container: document.getElementById(elementID),

          layout: {
            name: 'cose',//'concentric'
            animate: true,
            concentric: function(node) {

              if(node.id()==='root') {
                return 10000;
              }
              if(node.data().genename) {
                return 1000;
              }

              return node.degree()
            }

          },

          style: [
            {
              selector: 'node',
              style: {
                'color': 'white',
                'text-valign':'center',
                'text-halign':'center'
              }
            },
            {
              selector: '.gene',
              style: {
                'content': 'data(genename)',
                'width': 'label',
                'background-color': '#009fc3',
                'text-outline-width': 2,
                'text-outline-color': '#009fc3'
              }
            },
            {
              selector: '.drugs',
              style: {
                'content': 'data(drugs)',
                'text-valign':'center',
                'text-halign':'center',
                'width': 'label',
                'height': 'label',
                'shape': 'rectangle',
                'text-wrap': 'wrap',
              }
            },
            {
              selector: '.approved',
              style: {
                'background-color': '#619B45',
              }
            },
            {
              selector: '.experimental',
              style: {
                'background-color': 'orange',
              }
            },
            {
              selector: '.interaction-type',
              style: {
                'content': 'data(type)',
                'background-color': '#d11b67',
                'shape': 'rectangle',
                'width': 'label'
              }
            },
            {
              selector: '.root',
              style: {
                'content': 'TOP-ASSIGNMENTS',
                'background-color': 'blue',
                'shape': 'rectangle',
                'width': 'label'
              }
            }
          ],
          elements: { nodes: nodes, edges: edges }
        });
      },

      exportnetwork: function(scale) {
        return graph.png({scale: scale});
      }

    };
  });
