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
angular.module('pandrugsFrontendApp')
  .component('geneQueryPanel', {
    templateUrl: 'views/components/gene-query-panel/gene-query-panel.template.html',
    bindings: {
      onChange: '&'
    },
    controller: ['database', 'utilities', '$location', function (database, utilities, $location) {
      this.genes = '';
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
          this.pasteSignalingPathwayExample();
        } else if ($location.search().genes != undefined) {
          this.notifyChange($location.search().genes.split(',').join('\n'));
        } else {
          this.notifyChange();
        }
      }.bind(this);

      this.notifyChange = function (genes) {
        var parsedGenes;

        if (genes === undefined) {
          parsedGenes = utilities.parseGenes(this.genes, false);
          genes = parsedGenes.join('\n').trim();
        } else {
          try {
            parsedGenes = utilities.parseGenes(genes, false);
            this.genes = genes;
          } catch(e) {
            alert("The gene list is not valid. Check that there is only one gene name per line.");
          }
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

      this.changeFile = function(file) {
        var reader = new FileReader();

        reader.onload = function() {
          this.notifyChange(reader.result);
        }.bind(this);

        reader.readAsText(file);
      }.bind(this);
    }]
  });
