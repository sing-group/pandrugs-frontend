'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.geneDrugNetworkChart
 * @description
 * # geneDrugNetworkChart
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('geneDrugNetworkChart', ['$q', 'database', 'utilities', function ($q, db, util) {

    var elementID = 'genedrugnetworkgraph';

    var graph;
    return {

      updateChart: function(results, degree) {
        var deferred = $q.defer();

        var idsCache = [];
        function createGeneNode(nodes, geneName, isRootGene) {

          var id = geneName;
          if (!idsCache[id]) {
            idsCache[id] = true;
            nodes.push({
              data: {
                id: id,
                genename: geneName,
                type: 'gene'
              },
              classes: 'gene'+((isRootGene)?' rootGene':'')
            });
          }
        }

        function drugAdded(drugName) {
          var id = 'drug-'+drugName;
          if (idsCache[id]){
            return true;
          }
          return false;
        }

        function createDrugNode(nodes, drugName, status) {
          var id = 'drug-'+drugName;
          if (!idsCache[id]) {
            idsCache[id] = true;
            nodes.push({
              data: {
                id: id,
                drug: drugName,
                type: 'drug'
              },
              classes: 'drugs '+status.toLowerCase()
            });
          }
        }

        function createGeneToGeneInteractionNode(edges, geneA, geneB) {

          var gene1 = [geneA, geneB].sort()[0];
          var gene2 = [geneA, geneB].sort()[1];

          var id = 'gene-'+gene1+'-'+'gene-'+gene2;
          if (!idsCache[id]) {
            idsCache[id] = true;

            edges.push({
              data: {
                  id: id,
                  source: gene1,
                  target: gene2,
                  type: 'protein-interaction'
                },
              classes: 'protein-interaction '
            });
          }
        }

        function createDrugGeneInteraction(edges, drug, gene, dScore, isTarget, isDirect) {
          var classes = (isTarget?'target':'marker')+' '+(isDirect?'direct':'indirect');
          var id = gene+'-'+drug+'-'+classes.replace(' ', '_');
          if (!idsCache[id]) {
            idsCache[id] = true;

            edges.push({
              data: {
                  id: id,
                  source: gene,
                  target: 'drug-'+drug,
                  weight: 0.5 + (Math.pow(dScore, 6.0))*5.0,
                  type: 'interaction'
                },
              classes: 'interaction '+classes
            });
          }
        }

        //create elements
        var geneNodes = [];
        var drugNodes = [];
        var edges = [];

        if (results) {

          results.forEach(function(group) {
            if (group.gScore > 0.6 && group.dScore > 0.7) {
              group.geneDrugInfo.forEach(function(genedruginfo) {

                var drug = {drugname: genedruginfo.drug.substring(0, Math.min(genedruginfo.drug.length, 30))};
                if (genedruginfo.indirect !== null) {
                  drug.indirectgene = genedruginfo.indirect;
                }

                createDrugNode(drugNodes, drug.drugname, genedruginfo.status);

                genedruginfo.gene.forEach(function(gene){
                  createGeneNode(geneNodes, gene, true);

                  var isDirect = true;
                  if (genedruginfo.indirect !== null) {
                    isDirect = false;
                  }

                  var isTarget = false;
                  if (genedruginfo.target === 'target') {
                    isTarget = true;
                  }

                  createDrugGeneInteraction(edges, drug.drugname, gene, group.dScore, isTarget, isDirect);
                });
              });
            }
          });



          // gene interaction
          var genesToQuery = util.unique(geneNodes.map(function(node){
              return node.data.genename;
          }));

          db.getInteractingGenes(genesToQuery, degree).then(function(results){

            results.forEach(function(geneInteractionInfo) {
              createGeneNode(geneNodes, geneInteractionInfo.geneSymbol, false);

              geneInteractionInfo.geneInteraction.forEach(function(interactingGene){
              //  geneNodes.push(createGeneNode(interactingGene));
                createGeneToGeneInteractionNode(edges, geneInteractionInfo.geneSymbol, interactingGene);
              });

              geneInteractionInfo.drugInteraction.forEach(function(interactingDrug){
                if (drugAdded(interactingDrug.showDrugName)){
                  createDrugGeneInteraction(edges, interactingDrug.showDrugName, geneInteractionInfo.geneSymbol, 0.0, interactingDrug.target === 'target', interactingDrug.indirectGene === null);
                }
              });

            });
            //
            //alert('creating graph '+geneNodes.length+' '+edges.length);
            var graph = createGraph(geneNodes, drugNodes, edges);

            deferred.resolve(graph);
          });

        }

        function createGraph(geneNodes, drugNodes, edges) {
          graph = cytoscape({

            container: document.getElementById(elementID),

            //layout 1
            layout: {
              name: 'concentric',
              concentric: function(node) {

                if(node.id() === 'root') {
                  return 1000;
                }
                if(node.data().genename) { //is gene
                  return 10;
                } else {
                  return 1000;
                }

                return node.degree();
              },
            },

            // layout 2
            /*layout: {
              name: 'grid',
              position: function(node) { //for grid
              //  alert(JSON.stringify(node));
                return {row:node.position.row,col:(node.data('type')==='gene')?0:1};
              },
              cols: 2
            },*/

            // layout 3
            /*layout: {
              name: 'cose',
              edgeElasticity: function(edge){
                if (edge.data('type') === 'protein-interaction') {
                  return 5;
                } else {
                  return 100;
                }
              },
              idealEdgeLength: function(edge) {
                return 100;
              }
            },*/
            style: [
              {
                selector: 'node',
                style: {
                  'color': 'white',
                  'text-valign':'center',
                  'text-halign':'center',
                  'cursor': 'pointer'
                }
              },
              {
                selector: '.highlight',
                style: {
                  'opacity' : 1
                }
              },
              {
                selector: '.lowlight',
                style: {
                  'opacity' : 0
                }
              },
              {
                selector: '.gene',
                style: {
                  'content': 'data(genename)',
                  /*'width': 'label',*/
                  'background-color': '#9EDAFF',
                  'text-outline-width': 2,
                  'text-outline-color': '#9EDAFF',
                }
              },
              {
                selector: '.gene.rootGene',
                style: {
                  'background-color': '#00acee',
                  'text-outline-color': '#00acee',
                }
              },
              {
                selector: '.drugs',
                style: {
                  'content': 'data(drug)',
                  'text-valign':'center',
                  'text-halign':'center',
                  'width': 'label',
                  'height': 'label',
                  'shape': 'rectangle',
                  'text-wrap': 'wrap'
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
                selector: '.interaction',
                style: {
                  'width': 'data(weight)'
                }
              },
              {
                selector: '.interaction.direct',
                style: {
                  'line-color': 'black'
                }
              },
              {
                selector: '.interaction.indirect',
                style: {
                  'line-color': 'grey'
                }
              },
              {
                selector: '.interaction.marker',
                style: {
                  'line-style': 'dashed'
                }
              },
              {
                selector: '.interaction.target',
                style: {
                  'line-style' : 'solid'
                }
              },
              {
                selector: '.protein-interaction',
                style: {
                  'line-color' : 'blue',
                  'curve-style': 'unbundled-bezier',
                  'control-point-distances': 120,
                  'control-point-weights': 0.1
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
            elements: { nodes: geneNodes.concat(drugNodes), edges: edges }
          });
          graph.on('mouseover', 'node', function(event) {
            graph.$('node').addClass('lowlight');
            graph.$('edge').addClass('lowlight');

            event.cyTarget.addClass('highlight');
            event.cyTarget.removeClass('lowlight');

            event.cyTarget.connectedEdges().forEach(function(edge){
              edge.addClass('highlight');
              edge.removeClass('lowlight');
              edge.connectedNodes().forEach(function(node){
                node.addClass('highlight');
                node.removeClass('lowlight');
              });
            });
          });

          graph.on('mouseout', 'node', function( ) {
            graph.$('node').removeClass('lowlight');
            graph.$('node').removeClass('highlight');
            graph.$('edge').removeClass('lowlight');
            graph.$('edge').removeClass('highlight');

          });
          return graph;
        }
        return deferred.promise;
      },

      exportnetwork: function(scale) {
        return graph.png({scale: scale});
      }

    };
  }]);
