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
          this.pasteTemsirolimus();
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

      this.pasteTemsirolimus = function () {
        this.drug = 'Temsirolimus';
        this.updateDrugList();
      }.bind(this);
    }]
  });
