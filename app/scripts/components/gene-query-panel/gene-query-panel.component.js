angular.module('pandrugsFrontendApp')
  .component('geneQueryPanel', {
    templateUrl: 'views/components/gene-query-panel/gene-query-panel.template.html',
    bindings: {
      genes: '<',
      onChange: '&'
    },
    controller: ['database', 'utilities', '$location', '$timeout', function (database, utilities, $location, $timeout) {
      this.genesTextAreaConfig = {
        autocomplete: [{
          words: [/([()-_A-Za-z0-9]+)/gi]
        }],
        dropdown: [{
          trigger: /([()-_A-Za-z0-9]+)/gi,
          list: function(match, callback) {
            database.listGeneSymbols(match[1])
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

      this.$onInit = function () {
        if ($location.search().example === 'genes') {
          $timeout(this.pasteSignalingPathwayExample());
        } else {
          $timeout(this.notifyChange());
        }
      }.bind(this);

      this.notifyChange = function (genes) {
        var parsedGenes;

        if (genes === undefined) {
          parsedGenes = utilities.parseGenes(this.genes, false);
          genes = parsedGenes.join('\n').trim();
        } else {
          parsedGenes = utilities.parseGenes(genes, false);
        }

        var parsedGenesUnique = utilities.uniqueIgnoreCase(parsedGenes);

        this.onChange({ genes: genes, geneList: parsedGenes, uniqueGeneList: parsedGenesUnique });
      }.bind(this);

      this.pasteStomachCarcinomaExample = function() {
        this.notifyChange('TP53\nARID1A\nB2M\nPIK3CA\nPTEN\nKRAS\nRHOA\nMXRA8\n');
      }.bind(this);

      this.pasteAngiogenesisExample = function() {
        this.notifyChange('VEGFA\nVEGFB\nKDR\nIL8\nCXCR1\nCXCR2\n');
      }.bind(this);

      this.pasteSignalingPathwayExample = function() {
        this.notifyChange('PIK3CA\nPIK3R1\nPIK3R2\nPTEN\nPDPK1\nAKT1\nAKT2\nFOXO1\nFOXO3\nMTOR\nRICTOR\nTSC1\nTSC2\nRHEB\nAKT1S1\nRPTOR\nMLST8\n');
      }.bind(this);
    }]
  });
