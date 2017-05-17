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
      'Indirect Pathway(s),Sensitivity,Original Sensitivity,' +
      'Indirect Resistance(s),Source(s),Warning(s),DScore,GScore';

    var geneDrugGroupsHeader =
      'Gene(s),Standard Drug Name,Show Drug Name,PubChemId(s),Status,' +
      'Status Description,Therapy,Target,Source(s),Curated Source(s),' +
      'Family(ies),Cancer(s),Indirect Gene(s),Best Interaction,' +
      'DScore,GScore,' + geneDrugHeader;

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
      this.indirectResistance = geneDrug.indirectResistance;
      this.family = geneDrug.family;
      this.source = geneDrug.source;*/

      angular.merge(this, geneDrug);
      this.geneDrugGroup = geneDrugGroup;
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
      this.indirectGene = geneDrugGroup.indirectGene;
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
    }

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

    GeneDrug.prototype.hasIndirectResistance = function() {
      return this.indirectResistance.length > 0;
    };

    GeneDrug.prototype.getAdjustedGScore = function() {
      return Math.round(this.gScore * 10000) / 10000;
    };

    GeneDrug.prototype.getAdjustedDScore = function() {
      return Math.round(this.dScore * 10000) / 10000;
    };

    GeneDrug.prototype.getSensitivity = function() {
      return this.sensitivity === 'BOTH' ? 'SENSITIVITY / RESISTANCE' : this.sensitivity;
    };

    GeneDrug.prototype.getOriginalSensitivity = function() {
      return this.originalSensitivity === 'BOTH' ? 'SENSITIVITY / RESISTANCE' : this.originalSensitivity;
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
        this.getSensitivity(),
        this.getOriginalSensitivity(),
        this.indirectResistance,
        this.source,
        this.warning,
        this.getAdjustedDScore(),
        this.getAdjustedGScore()
      ]
        .map(prepareValueForCSV)
      .join(',');
    };

    GeneDrugGroup.prototype.getBestInteraction = function() {
      var bestDscore = -1;
      var best = '';

      for (var i = 0; i < this.geneDrugs.length; i++) {
        if (this.geneDrugs[i].dScore > bestDscore) {
          bestDscore = this.geneDrugs[i].dScore;

          if (this.geneDrugs[i].target === 'marker') {
            best = 'marker';
          } else if (this.geneDrugs[i].target === 'target' && this.geneDrugs[i].indirect === null) {
            best = 'target-direct';
          } else if (this.geneDrugs[i].target === 'target' && this.geneDrugs[i].indirect !== null){
            best = 'target-indirect';
          }
        }
      }

      return best;
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

    GeneDrugGroup.prototype.getWarnings = function() {
      return this.geneDrugs
        .map(function(gd) { return gd.warning; })
        .filter(function (warning) { return warning.length > 0; })
      .join('\n');
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

    GeneDrugGroup.prototype.toCSV = function(addHeader) {
      var header = addHeader === true ? geneDrugGroupsHeader + '\n' : '';

      var groupRow = [
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
        this.getBestInteraction(),
        this.getAdjustedDScore(),
        this.getAdjustedGScore(),
        '', '', '', '', '', '', '', '', '', '', '', '', '', ''
      ]
        .map(prepareValueForCSV)
      .join(',');

      var geneDrugPadding = [ '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '' ]
        .map(prepareValueForCSV)
      .join(',');

      var geneDrugRows = this.geneDrugs
        .map(function(geneDrug) { return geneDrugPadding + ',' + geneDrug.toCSV(); })
      .join('\n');

      return header + groupRow + '\n' + geneDrugRows;
    };

    QueryResult.prototype.getFilteredGroups = function() {
      return this.filteredGeneDrugGroups;
    };

    QueryResult.prototype.isEmpty = function() {
      return this.filteredGeneDrugGroups.length === 0;
    };

    QueryResult.prototype.toCSV = function() {
      var groups = this.getFilteredGroups()
        .map(function(group) { return group.toCSV(); })
      .join('\n');

      return geneDrugGroupsHeader + '\n' + groups;
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
