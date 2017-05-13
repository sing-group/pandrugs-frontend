angular.module('pandrugsFrontendApp')
  .component('geneQueryPanel', {
    templateUrl: 'scripts/components/gene-query-panel/gene-query-panel.template.html',
    bindings: {
      genes: '<',
      onChange: '&'
    },
    controller: ['database', 'utilities', function (database, utilities) {
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
        this.notifyChange();
      }.bind(this);

      this.notifyChange = function () {
        var parsedGenes = utilities.parseGenes(this.genes);
        var genes = parsedGenes.join('\n');

        this.onChange({ genes: this.genes, geneList: parsedGenes });
      }.bind(this);

      this.pasteStomachCarcinomaExample = function() {
        this.genes = 'TP53\nARID1A\nB2M\nPIK3CA\nPTEN\nKRAS\nRHOA\nMXRA8';
        this.notifyChange();
      }.bind(this);

      this.pasteAngiogenesisExample = function() {
        this.genes = 'VEGFA\nVEGFB\nKDR\nIL8\nCXCR1\nCXCR2\n';
        this.notifyChange();
      }.bind(this);

      this.pasteSignalingPathwayExample = function() {
        this.genes = 'PIK3CA\nPIK3R1\nPIK3R2\nPTEN\nPDPK1\nAKT1\nAKT2\nFOXO1\nFOXO3\nMTOR\nRICTOR\nTSC1\nTSC2\nRHEB\nAKT1S1\nRPTOR\nMLST8\n';
        this.notifyChange();
      }.bind(this);
    }]
  });
