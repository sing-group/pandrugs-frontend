'use strict';

/**
 * @ngdoc service
 * @name pandrugsFrontendApp.QueryResultFactory
 * @description
 * # QueryResultFactory
 * Factory in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .factory('QueryResultFactory', function () {
    function GeneDrug(geneDrug) {
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
        return new GeneDrug(gdi);
      });
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


    GeneDrug.prototype.toCSV = function() {
      return [
        '', '', '', '', '', '', '', '', '',
        this.drugStatusInfo,
        this.gene.map(function(gene) { return gene.geneSymbol; }).join('|'),
        this.getSensitivity(),
        this.alteration,
        this.family,
        this.source.join('|'),
        this.getAdjustedDScore(),
        this.getAdjustedGScore()
      ]
        .map(function(value) { return '\"' + value + '\"'; })
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

    GeneDrugGroup.prototype.toCSV = function() {
      var groupRow = [
        this.gene.map(function(gene) { return gene.geneSymbol; }).join('|'),
        this.showDrugName,
        this.family.join('|'),
        this.source.map(function(source) { return source.name; }).join('|'),
        this.statusDescription,
        (this.therapy ? this.therapy : ''),
        this.getBestInteraction(),
        this.getAdjustedDScore(),
        this.getAdjustedGScore(),
        '-', '-', '-', '-', '-', '-', '-', '-'
      ]
        .map(function(value) { return '\"' + value + '\"'; })
      .join(',');

      var geneDrugRows = this.geneDrugs
        .map(function(geneDrug) { return geneDrug.toCSV(); })
      .join('\n');

      return groupRow + '\n' + geneDrugRows;
    };

    QueryResult.prototype.getFilteredGroups = function() {
      return this.filteredGeneDrugGroups;
    };

    QueryResult.prototype.toCSV = function() {
      var header = [
        'Gene(s),Drug,Family,Source(s),Drug status,Type of therapy,Interaction,DScore,GScore,Info,Gene,Sensitivity,Alteration,Family,Source(s),DScore,GScore'
      ];

      var groups = this.getFilteredGroups()
        .map(function(group) { return group.toCSV(); })
      .join('\n');

      return header + '\n' + groups;
    };

    QueryResult.prototype.getGroupsCount = function() {
      return this.getFilteredGroups().length;
    };

    return {
      createQueryResult: function (geneDrugGroups, advancedQueryOptions) {
        return new QueryResult(geneDrugGroups, advancedQueryOptions);
      }
    };
  });
