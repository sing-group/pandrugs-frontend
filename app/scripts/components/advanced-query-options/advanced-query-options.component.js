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
  .component('advancedQueryOptions', {
    templateUrl: 'views/components/advanced-query-options/advanced-query-options.template.html',
    bindings: {
      onChange: '&'
    },
    controller: ['database', 'AdvancedQueryOptionsFactory', function (database, AdvancedQueryOptionsFactory) {
      this.cancerFda = true;
      this.cancerClinical = true;
      this.otherFda = true;
      this.otherClinical = true;
      this.otherExperimental = false;
      this.directTarget = true;
      this.biomarker = true;
      this.pathwayMember = false;
      this.geneDependency = true;
      this.cancerTypes = [];

      this.$onInit = function () {
        this.notifyChange();
      }.bind(this);

      // cancer types
      database.getCancerTypes().then(function (results) {
        results.forEach(function(result) {
          if (result.canBeQueried) {
            this.cancerTypes.push({name: result.name, selected: true});
            this.notifyChange();
          }
        }.bind(this));
      }.bind(this));

      this.notifyChange = function () {
        this.onChange({options: AdvancedQueryOptionsFactory.createAdvancedQueryOptions(this)});
      }.bind(this);

      this.selectAllCancerTypes = function () {
        this.cancerTypes.forEach(function (cancer) {
          cancer.selected = true;
        });
        this.notifyChange();
      }.bind(this);

      this.clearCancerTypesSelection = function () {
        this.cancerTypes.forEach(function (cancer) {
          cancer.selected = false;
        });
        this.notifyChange();
      }.bind(this);

      this.hasCancerStatusSelected = function() {
        return this.cancerFda || this.cancerClinical;
      };
    }]
  });
