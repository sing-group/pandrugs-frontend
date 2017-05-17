angular.module('pandrugsFrontendApp')
  .component('geneRankQueryPanel', {
    templateUrl: 'views/components/generank-query-panel/generank-query-panel.template.html',
    bindings: {
      idPrefix: '@',
      onChange: '&'
    },
    controller: function () {
      this.changeFile = function (file) {
        this.onChange({generank: file});
      }.bind(this);
    }
  });
