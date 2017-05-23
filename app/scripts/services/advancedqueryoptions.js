'use strict';

/**
 * @ngdoc service
 * @name pandrugsFrontendApp.AdvancedQueryOptions
 * @description
 * # AdvancedQueryOptions
 * Factory in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .factory('AdvancedQueryOptionsFactory', ['$filter', function ($filter) {
    function AdvancedQueryOptions(options) {
      this.cancerFda = options ? options.cancerFda : true;
      this.cancerClinical = options ? options.cancerClinical : true;
      this.otherFda = options ? options.otherFda : true;
      this.otherClinical = options ? options.otherClinical : true;
      this.otherExperimental = options ? options.otherExperimental : true;
      this.target = options ? options.target : true;
      this.marker = options ? options.marker : true;
      this.cancerTypes = options ? options.cancerTypes : '*';
    }

    AdvancedQueryOptions.prototype.getSelectedCancerTypes = function() {
      if (this.cancerTypes === '*') {
        return this.cancerTypes;
      } else {
        return this.cancerTypes.filter(function (cancer) {
          return cancer.selected;
        }).map(function (cancer) {
          return $filter('titlecase')($filter('replace')(cancer.name, '_', ' '));
        });
      }
    };

    AdvancedQueryOptions.prototype.getSelectedCancerTypeNames = function() {
      if (this.cancerTypes === '*') {
        return null;
      } else {
        return this.cancerTypes.filter(function (cancer) {
          return cancer.selected;
        }).map(function (cancer) {
          return cancer.name;
        });
      }
    };

    AdvancedQueryOptions.prototype.areAllCancerTypesSelected = function() {
      return this.cancerTypes === '*' || this.cancerTypes.every(function(cancer) {
        return cancer.selected;
      });
    };

    AdvancedQueryOptions.prototype.isCancerSelected = function (cancerType) {
      return this.cancerTypes === '*' || this.cancerTypes.find(function(cancer) {
        return cancer.name.toUpperCase() === cancerType.toUpperCase();
      });
    };

    AdvancedQueryOptions.prototype.hasAnyCancerSelected = function () {
      return this.cancerTypes === '*' || this.cancerTypes.find(function(cancer) {
          return cancer.selected;
        });
    };

    AdvancedQueryOptions.prototype.hasCancerStatusSelected = function() {
      return this.cancerFda || this.cancerClinical;
    };

    AdvancedQueryOptions.prototype.isValid = function () {
      return (this.cancerFda || this.cancerClinical || this.otherClinical || this.otherExperimental || this.otherFda)
        && (this.target || this.marker)
        && (!this.hasCancerStatusSelected() || this.hasAnyCancerSelected());
    };

    // Public API here
    return {
      createAdvancedQueryOptions: function(options) {
        return new AdvancedQueryOptions(options);
      }
    };
  }]);
