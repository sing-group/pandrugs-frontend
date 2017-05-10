angular.module('pandrugsFrontendApp')
  .component('advancedQueryOptions', {
    templateUrl: 'scripts/components/advanced-query-options/advanced-query-options.template.html',
    bindings: {
      onChange: '&'
    },
    controller: ['database', function (database) {
      this.cancerFda = true;
      this.cancerClinical = true;
      this.otherFda = true;
      this.otherClinical = true;
      this.otherExperimental = true;
      this.target = true;
      this.marker = true;
      this.cancerTypes = [];

      this.$onInit = function () {
        this.notifyChange();
      }.bind(this);

      // cancer types
      database.getCancerTypes().then(function (results) {
        results.forEach(function(result) {
          this.cancerTypes.push({name: result, selected: true});
        }.bind(this));
      }.bind(this));

      this.notifyChange = function () {
        var options = {
          cancerFda: this.cancerFda,
          cancerClinical: this.cancerClinical,
          otherFda: this.otherFda,
          otherClinical: this.otherClinical,
          otherExperimental: this.otherExperimental,
          target: this.target,
          marker: this.marker,
          cancerTypes: this.cancerTypes,

          areAllCancerTypesSelected: function() {
            return this.cancerTypes.every(function(cancer) {
              return cancer.selected;
            });
          }.bind(this),
          isCancerSelected: function (cancerType) {
            return this.cancerTypes.find(function(cancer) {
              return cancer.name.toUpperCase() === cancerType.toUpperCase();
            });
          }.bind(this),
          isValid: function() {
            return (this.cancerFda || this.cancerClinical || this.otherClinical || this.otherExperimental || this.otherFda)
              && (this.target || this.marker);
          }.bind(this)
        };

        this.onChange({options: options});
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
    }]
  });
