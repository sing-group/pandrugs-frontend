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
          if (result.canBeQueried) {
            this.cancerTypes.push({name: result.name, selected: true});
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
