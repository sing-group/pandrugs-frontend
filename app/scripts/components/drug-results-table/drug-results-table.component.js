angular.module('pandrugsFrontendApp')
  .component('drugResultsTable', {
    templateUrl: 'scripts/components/drug-results-table/drug-results-table.template.html',
    bindings: {
      geneDrugGroup: '<'
    },
    controller: ['TableHelper', function (TableHelper) {
      this.csvContent = null;
      this.geneDrugs = null;

      this.$onChanges = function(changes) {
        console.log(changes);
        if (changes.geneDrugGroup && changes.geneDrugGroup.currentValue) {
          this.csvContent = encodeURI('data:text/csv;charset=utf-8,' + changes.geneDrugGroup.currentValue.toCSV(true));
        }
      }.bind(this);

      this.isLoading = function() {
        return this.geneDrugs === null;
      };

      this.populateTable = function(tableState) {
        this.geneDrugs = TableHelper.sort(tableState, this.geneDrugGroup.geneDrugs);
      }.bind(this);
    }]
  });
