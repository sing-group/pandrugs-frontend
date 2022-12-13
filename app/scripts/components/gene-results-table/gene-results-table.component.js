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
  .component('geneResultsTable', {
    templateUrl: 'views/components/gene-results-table/gene-results-table.template.html',
    bindings: {
      queryResult: '<',
      geneDrugGroups: '<',
      computation: '<',
      showVariantInformation: '<',
      showCnvInformation: '<',
      showExpressionInformation: '<',
      showSnvInformation: '<'
    },
    controller: ['user','TableHelper', function (user, TableHelper) {
      this.keys = Object.keys;
      this.csvContent = null;
      this.csvContentSimple = null;

      this.geneDrugGroupsPaginated = null;

      this.paginationOptions = [5, 20, 100, 'All'];
     
      this.$onChanges = function(changes) {
        if (changes.queryResult && changes.queryResult.currentValue) {
          this.csvContent = encodeURI('data:text/csv;charset=utf-8,' + changes.queryResult.currentValue.toCSV());
          this.csvContentSimple = encodeURI('data:text/csv;charset=utf-8,' + changes.queryResult.currentValue.toCSV(false));
        }
      }.bind(this);

      this.isLoading = function() {
        return this.geneDrugGroupsPaginated === null;
      };

      this.populateTable = function(tableState) {
        var results = TableHelper.sort(tableState, this.geneDrugGroups);
        this.geneDrugGroupsPaginated = TableHelper.paginate(tableState, this.paginationOptions, results);
      }.bind(this);

      this.isVariantsAnalysis = function() {
        return this.computation !== undefined && this.showVariantInformation;
      }.bind(this);
      
      
      this.getPharmcatURL = function(computationId, drugName) {
        return user.getPharmcatURLForComputation(computationId) + '#' + drugName; 
      };
    }]
  });
