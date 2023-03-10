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
          this.bestCandidateGeneDrugGroups = [];

          this.bestCandidateGeneDrugGroups.statusCounts = {};
          this.bestCandidateGeneDrugGroups.therapyTypeCounts = {};


          changes.geneDrugGroups.currentValue.forEach(function (geneDrugGroup) {
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
          
        }
        /*if (changes.multiomics) {
          console.log(changes.multiomics.currentValue);
        }*/
        
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
        return this.isSmallVariantsAnalysis() ? this.computation.affectedGenes.length : this.geneList.length;
      }
    }]
  });
