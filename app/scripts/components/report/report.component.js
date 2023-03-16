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
  .component('report', {
    templateUrl: 'views/components/report/report.template.html',
    bindings: {
      queryResult: '<',
      geneList: '<',
      genePresence: '<',
      geneDrugGroups: '<',
      computation: '<',
      multiomics: '<'
    },
    controller: ['user', function (user) {
      this.keys = Object.keys;

      this.showingReport = false;

      this.date = new Date();

      this.$onChanges = function (changes) {
        // log stuff
        if (changes.geneDrugGroups) {
          console.log(changes.geneDrugGroups.currentValue);

          this.bestCandidateGeneDrugGroups = [];
          this.bestCandidateGeneDrugGroups.statusCounts = {};
          this.bestCandidateGeneDrugGroups.therapyTypeCounts = {};

          this.snvCounts = { all: {}, inBestCandidates: {} };
          this.expressionCounts = { allUp: {}, allDown: {}, upInBestCandidates: {}, downInBestCandidates: {} };
          this.cnvCounts = { allAmp: {}, allDel: {}, ampInBestCandidates: {}, delInBestCandidates: {} };

          this.familyCounts = {};

          changes.geneDrugGroups.currentValue.forEach(function (geneDrugGroup) {
            if (geneDrugGroup.isBestCandidate()) {

              geneDrugGroup.family.forEach(function (family) {
                if (!this.familyCounts[family]) {
                  this.familyCounts[family] = { familyName: family.toLowerCase().includes('other') ? 'Unknown' : family, type: (family && !family.toLowerCase().includes('other')) ? geneDrugGroup.therapy : null, drugs: {}, APCount: 0, CTCount: 0, EXCount: 0 };
                }
                this.familyCounts[family].drugs[geneDrugGroup.standardDrugName] = 'yes';
                if (geneDrugGroup.status.toLowerCase().includes('approved')) {
                  this.familyCounts[family].APCount++;
                }
                if (geneDrugGroup.status.toLowerCase().includes('trials')) {
                  this.familyCounts[family].CTCount++;
                }
                if (geneDrugGroup.status.toLowerCase().includes('experimental')) {
                  this.familyCounts[family].EXCount++;
                }
              }.bind(this));
            }

            geneDrugGroup.geneDrugs.forEach(function (geneDrug) {
              geneDrug.gene.forEach(function (gene) {
                if (geneDrugGroup.calculatedGeneAnnotations && geneDrugGroup.calculatedGeneAnnotations.expression && geneDrugGroup.calculatedGeneAnnotations.expression[gene.geneSymbol]) {

                  // expression
                  if (geneDrugGroup.calculatedGeneAnnotations.expression[gene.geneSymbol].toLowerCase().includes('under')) {
                    this.expressionCounts.allDown[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.expression[gene.geneSymbol];
                    if (geneDrugGroup.isBestCandidate()) {
                      this.expressionCounts.downInBestCandidates[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.expression[gene.geneSymbol];
                    }
                  } else if (geneDrugGroup.calculatedGeneAnnotations.expression[gene.geneSymbol].toLowerCase().includes('over')) {
                    this.expressionCounts.allUp[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.expression[gene.geneSymbol];
                    if (geneDrugGroup.isBestCandidate()) {
                      this.expressionCounts.upInBestCandidates[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.expression[gene.geneSymbol];
                    }
                  }
                }

                //cnv

                if (geneDrugGroup.calculatedGeneAnnotations && geneDrugGroup.calculatedGeneAnnotations.cnv && geneDrugGroup.calculatedGeneAnnotations.cnv[gene.geneSymbol]) {

                  if (geneDrugGroup.calculatedGeneAnnotations.cnv[gene.geneSymbol].toLowerCase().includes('amp')) {
                    this.cnvCounts.allAmp[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.cnv[gene.geneSymbol];
                    if (geneDrugGroup.isBestCandidate()) {
                      this.cnvCounts.ampInBestCandidates[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.cnv[gene.geneSymbol];
                    }
                  } else if (geneDrugGroup.calculatedGeneAnnotations.cnv[gene.geneSymbol].toLowerCase().includes('del')) {
                    this.cnvCounts.allDel[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.cnv[gene.geneSymbol];
                    if (geneDrugGroup.isBestCandidate()) {
                      this.cnvCounts.delInBestCandidates[gene.geneSymbol] = geneDrugGroup.calculatedGeneAnnotations.cnv[gene.geneSymbol];
                    }
                  }

                }
                if (this.getComputation().affectedGenesInfo[gene.geneSymbol]) {
                  this.snvCounts.all[gene.geneSymbol] = 'yes';
                  if (geneDrugGroup.isBestCandidate()) {
                    this.snvCounts.inBestCandidates[gene.geneSymbol] = 'yes';
                  }
                }
              }.bind(this));
            }.bind(this));

            if (geneDrugGroup.isBestCandidate()) {
              this.bestCandidateGeneDrugGroups.push(geneDrugGroup);

              if (!this.bestCandidateGeneDrugGroups.statusCounts[geneDrugGroup.status]) {
                this.bestCandidateGeneDrugGroups.statusCounts[geneDrugGroup.status] = 0;
              }
              this.bestCandidateGeneDrugGroups.statusCounts[geneDrugGroup.status]++;

              var therapy = geneDrugGroup.therapy;
              if (therapy === null) {
                therapy = "OTHER";
              }

              if (!this.bestCandidateGeneDrugGroups.therapyTypeCounts[therapy]) {
                this.bestCandidateGeneDrugGroups.therapyTypeCounts[therapy] = 0;
              }
              this.bestCandidateGeneDrugGroups.therapyTypeCounts[therapy]++;
            }

          }.bind(this));
          console.log(this.familyCounts);

        }

        //sort families
        this.sortedFamilies = Object.values(this.familyCounts).sort(function (familyA, familyB) {
          return (Object.keys(familyB.drugs).length - Object.keys(familyA.drugs).length);
        });

        /*if (changes.multiomics) {
          console.log(changes.multiomics.currentValue);
        }*/

      }.bind(this);

      this.getTopKFamilies = function (top) {
        return this.sortedFamilies.slice(0, top);
      }.bind(this);

      this.isSmallVariantsAnalysis = function () {
        return (this.computation !== undefined && !this.multiomics);
      }.bind(this);

      this.isMultiOmicsAnalysis = function () {
        return this.multiomics ? true : false;
      }.bind(this);

      this.isMultiOmicsWithVCFAnalysis = function () {
        return this.multiomics && this.multiomics.computation ? true : false;
      }.bind(this);


      this.isMultiOmicsWithCNVAnalysis = function () {
        return this.multiomics && this.multiomics.cnvFile ? true : false;
      }.bind(this);

      this.isMultiOmicsWithExpressionAnalysis = function () {
        return this.multiomics && this.multiomics.expressionFile ? true : false;
      }.bind(this);

      this.getComputation = function () {
        if (this.isMultiOmicsWithVCFAnalysis()) {
          return this.multiomics.computation;
        } else {
          return this.computation;
        }
      }.bind(this);

      this.getAnalysisType = function () {
        return this.isSmallVariantsAnalysis() ? "Small Variants" : "Multi-omics";
      }.bind(this);

      this.getQueriedGenesLength = function () {
        return this.genePresence.present.length + this.genePresence.absent.length;
      }
    }]
  });
