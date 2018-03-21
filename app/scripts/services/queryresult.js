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
 * @name pandrugsFrontendApp.QueryResultFactory
 * @description
 * # QueryResultFactory
 * Factory in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .factory('QueryResultFactory', ['$sce', function ($sce) {
    var geneDrugHeader =
      'Gene(s),Target,Alteration,Status Info,Threrapy,Indirect Gene(s),' +
      'Indirect Pathway(s),Sensitivity,Source(s),Warning(s),DScore,GScore';

    var geneDrugGroupsHeader =
      'Gene(s),Standard Drug Name,Show Drug Name,PubChemId(s),Status,' +
      'Status Description,Therapy,Target,Source(s),Curated Source(s),' +
      'Family(ies),Cancer(s),Indirect Gene(s),Drug response,Best Interaction,' +
      'DScore,GScore,' + geneDrugHeader;

    var geneDrugGroupsHeaderSimple = 'Gene(s),Show Drug Name,' +
      'Status Description,Therapy,Drug response,Best Interaction,Family(ies),' +
      'Source(s),DScore,GScore,Best Candidate Therapy,Warning(s)';

    function drugToLink(drug, pubchemId) {
      return '<a href="https://pubchem.ncbi.nlm.nih.gov/compound/PUBCHEM_ID_TOKEN" target="_blank">DRUG_NAME_TOKEN</a>'
        .replace('PUBCHEM_ID_TOKEN', pubchemId)
        .replace('DRUG_NAME_TOKEN', drug);
    }

    function geneToLink(geneSymbol) {
      return '<a href="http://www.ncbi.nlm.nih.gov/gene?term=GENE_TOKEN" target="_blank">GENE_TOKEN</a>'
        .replace(new RegExp('GENE_TOKEN', 'g'), geneSymbol);
    }

    function drugLinkReplacer(drug, pubchemId) {
      return function(text) {
        return text.replace(drug, drugToLink(drug, pubchemId));
      };
    }

    function geneLinkReplacer(geneSymbol) {
      return function(text) {
        return text.replace(geneSymbol, geneToLink(geneSymbol));
      };
    }

    function GeneDrug(geneDrugGroup, geneDrug) {
      /*this.drug = geneDrug.drug;
      this.status = geneDrug.status;
      this.cancers = geneDrug.cancers;
      this.therapy = geneDrug.threapy;
      this.indirect = geneDrug.indirect;
      this.target = geneDrug.target;
      this.sensitivity = geneDrug.sensitivity;
      this.alteration = geneDrug.alteration;
      this.drugStatusInfo = geneDrug.drugStatusInfo;
      this.dScore = geneDrug.dScore;
      this.gScore = geneDrug.gScore;
      this.gene = geneDrug.gene;
      this.warning = geneDrug.warning;
      this.family = geneDrug.family;
      this.source = geneDrug.source;*/

      angular.merge(this, geneDrug);
      this.geneDrugGroup = geneDrugGroup;
      if (this.getInteraction() === 'pathway-member')
        this.pathwayId = 'pathway-' + this.geneDrugGroup.standardDrugName.replace(' ', '-') + '-' + this.getIndirectGeneSymbol();
    }

    function GeneDrugGroup(geneDrugGroup) {
      /*this.standardDrugName = geneDrugGroup.standardDrugName;
      this.showDrugName = geneDrugGroup.showDrugName;
      this.status = geneDrugGroup.status;
      this.statusDescription = geneDrugGroup.statusDescription;
      this.therapy = geneDrugGroup.therapy;
      this.target = geneDrugGroup.target;
      this.pubchemId = geneDrugGroup.pubchemId;
      this.dScore = geneDrugGroup.dScore;
      this.gScore = geneDrugGroup.gScore;
      this.gene = geneDrugGroup.gene;
      this.family = geneDrugGroup.family;
      this.source = geneDrugGroup.source;
      this.curatedSource = geneDrugGroup.curatedSource;
      this.cancer = geneDrugGroup.cancer;
      this.geneDrugInfo = geneDrugGroup.geneDrugInfo;*/
      angular.merge(this, geneDrugGroup);

      this.moreinfo = false;

      this.geneDrugs = this.geneDrugInfo.map(function(gdi) {
        return new GeneDrug(this, gdi);
      }.bind(this));
      delete this.geneDrugInfo;
    }


    function QueryResult(geneDrugGroups, advancedQueryOptions) {
      this.advancedQueryOptions = advancedQueryOptions;
      this.geneDrugGroups = geneDrugGroups.map(function(gdg) {
        return new GeneDrugGroup(gdg);
      });

      this.filteredGeneDrugGroups = this.geneDrugGroups.filter(function(geneDrugGroup) {
        if (geneDrugGroup.status === 'EXPERIMENTAL' || geneDrugGroup.status === 'CLINICAL_TRIALS') {
          return true;
        }

        if (geneDrugGroup.cancer.length === 0) {
          return advancedQueryOptions.areAllCancerTypesSelected();
        } else {
          return geneDrugGroup.cancer.find(function(cancer) {
            return advancedQueryOptions.isCancerSelected(cancer);
          });
        }
      });

      if (this.filteredGeneDrugGroups.length === 1) {
        this.filteredGeneDrugGroups[0].moreinfo = true;
      }
    }

    GeneDrug.prototype.getGeneSymbols = function() {
      return this.gene.map(function (gene) {
        return gene.geneSymbol;
      });
    };

    GeneDrug.prototype.getPubchemId = function() {
      return this.geneDrugGroup.pubchemId[0];
    };

    GeneDrug.prototype.getDrugStatusInfoWithLinks = function() {
      var info = this.drugStatusInfo;

      info = drugLinkReplacer(this.showDrugName, this.getPubchemId())(info);

      info = this.getGeneSymbols().map(geneLinkReplacer)
      .reduce(
        function (previous, current) {
          return current(previous);
        },
        info
      );

      if (this.indirect) {
        info = geneLinkReplacer(this.getIndirectGeneSymbol())(info);
      }

      return $sce.trustAsHtml(info);
    };

    GeneDrug.prototype.getDrugSourcesInfo = function() {
      return this.source.map(function(drugSourceName) {
        return this.geneDrugGroup.source.find(function(source) {
          return source.name === drugSourceName;
        });
      }.bind(this));
    };

    GeneDrug.prototype.getIndirectGeneSymbol = function() {
      if (this.indirect) {
        return this.indirect.geneInfo.geneSymbol;
      } else {
        return null;
      }
    };

    GeneDrug.prototype.getDrugAndGenesAsText = function(joiner) {
      var geneSymbol = this.indirect !== null ? this.getIndirectGeneSymbol() : this.getGeneSymbols();

      return this.drug + joiner + geneSymbol;
    };

    GeneDrug.prototype.getDrugAndGenesAsHtml = function(joiner) {
      var geneSymbol = this.indirect !== null ? this.getIndirectGeneSymbol() : this.getGeneSymbols();
      geneSymbol = geneToLink(geneSymbol);
      var drug = drugToLink(this.drug, this.getPubchemId());

      return $sce.trustAsHtml(drug + joiner + geneSymbol);
    };

    GeneDrug.prototype.getIndirectPathways = function() {
      if (this.indirect) {
        return this.indirect.pathway.map(function (pathway) {
          return pathway.keggId;
        });
      } else {
        return [];
      }
    };

    GeneDrug.prototype.getIndirectGeneSymbols = function() {
      return this.indirect.map(function (gene) {
        return gene.geneSymbol;
      });
    };

    GeneDrug.prototype.getAdjustedGScore = function() {
      return Math.round(this.gScore * 10000) / 10000;
    };

    GeneDrug.prototype.getAdjustedDScore = function() {
      return Math.round(this.dScore * 10000) / 10000;
    };

    GeneDrug.prototype.getInteraction = function() {
      if (this.target === 'marker') {
        return 'biomarker';
      } else if (this.indirect === null) {
        return 'direct-target';
      } else if (this.indirect !== null){
        return 'pathway-member';
      } else {
        throw Error('Invalid gene drug group type');
      }
    };

    function prepareValueForCSV(value) {
      if (Array.isArray(value)) {
        value = value.length > 0 ? value.join('|') : '-';
      } else {
        value = value || '-';
      }

      return '"' + value + '"';
    }

    GeneDrug.prototype.toCSV = function(addHeader) {
      var header = addHeader === true ? geneDrugHeader + '\n' : '';

      return header + [
        this.getGeneSymbols(),
        this.target,
        this.alteration,
        this.drugStatusInfo,
        this.therapy,
        this.getIndirectGeneSymbol(),
        this.getIndirectPathways(),
        this.sensitivity,
        this.source,
        this.warning,
        this.getAdjustedDScore(),
        this.getAdjustedGScore()
      ]
        .map(prepareValueForCSV)
      .join(',');
    };

    GeneDrugGroup.prototype.getBestInteraction = function() {
      var isBetterInteractionThan = function(interaction1, interaction2) {
        var interactionOrder = [ 'direct-target', 'biomarker', 'pathway-member' ];

        var index1 = interactionOrder.indexOf(interaction1);
        var index2 = interactionOrder.indexOf(interaction2);

        return index2 > index1;
      };

      var bestInteraction = null;
      var bestGScore = null;
      for (var i = 0; i < this.geneDrugs.length; i++) {
        var geneDrug = this.geneDrugs[i];

        if (
          (geneDrug.dScore === this.dScore)
          && ((bestInteraction === null)
            || (geneDrug.gScore > bestGScore
                || (geneDrug.gScore === bestGScore
                  && isBetterInteractionThan(geneDrug.getInteraction(), bestInteraction)
                )
              )
            )
        ) {
          bestInteraction = geneDrug.getInteraction();
          bestGScore = geneDrug.gScore;
        }
      }

      return bestInteraction;
    };

    GeneDrugGroup.prototype.getSensitivity = function() {
      var sensitivity;

      for (var i = 0; i < this.geneDrugs.length; i++) {
        var gd = this.geneDrugs[i];

        if (gd.sensitivity === 'BOTH') {
          return 'BOTH';
        } else if (sensitivity) {
          if (sensitivity !== gd.sensitivity) {
            return 'BOTH';
          }
        } else {
          sensitivity = gd.sensitivity;
        }
      }

      return sensitivity;
    };

    GeneDrugGroup.prototype.isBestCandidate = function() {
      return this.dScore > 0.7 && this.gScore > 0.6;
    };

    GeneDrugGroup.prototype.isCuratedSource = function(source) {
      return this.curatedSource.some(function(curatedSource) {
        return curatedSource === source;
      });
    };

    GeneDrugGroup.prototype.getWarnings = function() {
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      function flatten(array) {
        return [].concat.apply([], array);
      }
      return flatten(this.geneDrugs
                .map(function(gd) { return gd.warning; })
                .filter(function (warning) { return warning.length > 0; })
             ).filter(onlyUnique).join('\n');
    };

    GeneDrugGroup.prototype.getAdjustedGScore = function() {
      return Math.round(this.gScore * 10000) / 10000;
    };

    GeneDrugGroup.prototype.getAdjustedDScore = function() {
      return Math.round(this.dScore * 10000) / 10000;
    };

    GeneDrugGroup.prototype.getGeneSymbols = function() {
      return this.gene.map(function (gene) {
        return gene.geneSymbol;
      });
    };

    GeneDrugGroup.prototype.getIndirectGeneSymbols = function() {
      return this.indirectGene.map(function (gene) {
        return gene.geneSymbol;
      });
    };

    GeneDrugGroup.prototype.getSourceNames = function() {
      return this.source.map(function (source) {
        return source.name;
      });
    };

    GeneDrugGroup.prototype.toCSV = function(addHeader, expanded) {
      if (expanded === undefined) {
        expanded = true;
      }
      var header = addHeader === true ? geneDrugGroupsHeader + '\n' : '';
      var groupRow = [];
      if (expanded) {
        groupRow = [
          this.getGeneSymbols(),
          this.standardDrugName,
          this.showDrugName,
          this.pubchemId,
          this.status,
          this.statusDescription,
          this.therapy || '-',
          this.target ? 'target' : 'marker',
          this.getSourceNames(),
          this.curatedSource,
          this.family,
          this.cancer,
          this.getIndirectGeneSymbols(),
          this.getSensitivity(),
          this.getBestInteraction(),
          this.getAdjustedDScore(),
          this.getAdjustedGScore(),
          '', '', '', '', '', '', '', '', '', '', '', '', '', ''
        ];
      } else {
        groupRow = [
          this.getGeneSymbols(),
          this.showDrugName,
          this.statusDescription,
          this.therapy || '-',
          this.getSensitivity(),
          this.getBestInteraction(),
          this.family,
          this.getSourceNames(),
          this.getAdjustedDScore(),
          this.getAdjustedGScore(),
          this.isBestCandidate(),
          this.getWarnings()
        ];
      }
      groupRow = groupRow.map(prepareValueForCSV)
      .join(',');

      var geneDrugRows = '';
      if (expanded) {
        // include individual genedrugs
        var geneDrugPadding = [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]
          .map(prepareValueForCSV)
          .join(',');


        geneDrugRows = this.geneDrugs
          .map(function(geneDrug) { return geneDrugPadding + ',' + geneDrug.toCSV(); })
        .join('\n');
      }

      return header + groupRow + (expanded ? ('\n' + geneDrugRows) : '');
    };

    QueryResult.prototype.getFilteredGroups = function() {
      return this.filteredGeneDrugGroups;
    };

    QueryResult.prototype.isEmpty = function() {
      return this.filteredGeneDrugGroups.length === 0;
    };

    QueryResult.prototype.toCSV = function(expanded) {
      if (expanded === undefined) {
        expanded = true;
      }
      var groups = this.getFilteredGroups()
        .map(function(group) { return group.toCSV(false, expanded); })
      .join('\n');

      return (expanded?geneDrugGroupsHeader:geneDrugGroupsHeaderSimple) + '\n' + groups;
    };

    QueryResult.prototype.getGroupsCount = function() {
      return this.getFilteredGroups().length;
    };

    return {
      createQueryResult: function (geneDrugGroups, advancedQueryOptions) {
        return new QueryResult(geneDrugGroups, advancedQueryOptions);
      }
    };
  }]);
