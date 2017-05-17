angular.module('pandrugsFrontendApp')
  .component('geneResultsTable', {
    templateUrl: 'scripts/components/gene-results-table/gene-results-table.template.html',
    bindings: {
      queryResult: '<',
      geneDrugGroups: '<',
      computation: '<'
    },
    controller: ['TableHelper', function (TableHelper) {
      this.csvContent = null;
      this.geneDrugGroupsPaginated = null;

      this.paginationOptions = [5, 20, 100, 'All'];

      this.$onChanges = function(changes) {
        if (changes.queryResult && changes.queryResult.currentValue) {
          this.csvContent = encodeURI('data:text/csv;charset=utf-8,' + changes.queryResult.currentValue.toCSV());
        }
      }.bind(this);

      this.isLoading = function() {
        return this.geneDrugGroupsPaginated === null;
      };

      this.populateTable = function(tableState) {
        var results = TableHelper.sort(tableState, this.geneDrugGroups);

        this.geneDrugGroupsPaginated = TableHelper.paginate(tableState, this.paginationOptions, results);
      }.bind(this);
    }]
  });
