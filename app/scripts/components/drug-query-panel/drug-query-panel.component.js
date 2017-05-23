function DrugItem(drugItem, query, htmlMapper) {
  angular.merge(this, drugItem);

  this.query = query;
  this.standardNameHtml = htmlMapper(this.standardName);
  this.showNameHtml = htmlMapper(this.showName);

  this.sourceName.forEach(function (sourceName) {
    sourceName.drugNameHtml = htmlMapper(sourceName.drugName);
  });
}

angular.module('pandrugsFrontendApp')
  .component('drugQueryPanel', {
    templateUrl: 'views/components/drug-query-panel/drug-query-panel.template.html',
    bindings: {
      drug: '<',
      onChange: '&'
    },
    controller: ['database', '$sce', '$scope', '$q', '$location', function (database, $sce, $scope, $q, $location) {
      this.drugItems = [];
      this.selectedDrugItems = [];
      this.drugTemplateUrl = 'views/components/drug-query-panel/drugname-list-item.tpl.html';

      this.$onInit = function () {
        if ($location.search().example === 'drugs') {
          this.pastePalbociclib();
        }
      }.bind(this);

      this.$onChanges = function(changes) {
        this.updateDrugList();
      }.bind(this);

      this.updateDrugList = function () {
        this.drugItems = [];
        this.selectedDrugItems = [];

        if (this.drug) {
          database.listDrugNames(this.drug, 10)
            .then(function (response) {
              this.drugItems = response.data.map(function (item) {
                return new DrugItem(item, this.drug, highlight);
              }.bind(this));

              if (this.drug) {
                this.selectedDrugItems = this.drugItems.find(function (drugItem) {
                  return drugItem.standardName.toUpperCase() === this.drug.toUpperCase();
                }.bind(this));

                if (this.selectedDrugItems) {
                  this.selectedDrugItems = [this.selectedDrugItems];
                  this.notifyChange();
                }
              }

            }.bind(this));
        } else {
          this.notifyChange();
        }
      }.bind(this);

      this.notifyChange = function () {
        if (this.selectedDrugItems)
          this.onChange({drugQuery: this.drug, selectedDrug: this.selectedDrugItems[0]});
        else
          this.onChange({drugQuery: this.drug, selectedDrug: null});
      }.bind(this);

      var highlight = function (text) {
        return $sce.trustAsHtml(text.replace(new RegExp(this.drug, 'gi'), '<span class="highlightedText">$&</span>'));
      }.bind(this);

      this.showDrugList = function () {
        return this.drugItems.length > 0;
      };

      this.pastePalbociclib = function () {
        this.drug = 'Palbociclib';
        this.updateDrugList();
      }.bind(this);
    }]
  });
