angular.module('pandrugsFrontendApp')
  .component('geneRankQueryPanel', {
    templateUrl: 'scripts/components/generank-query-panel/generank-query-panel.template.html',
    bindings: {
      idPrefix: '@',
      onChange: '&'
    },
    controller: function () {
      this.$onInit = function () {
        angular.element(document).ready(function () {
          angular.element(document.querySelector('#' + this.idPrefix + '-input-file'))
            .fileinput({'showUpload': false, 'showRemove': false, 'previewFileType': 'any', 'multiple': false});
        }.bind(this));
      }.bind(this);

      this.changeFile = function (file) {
        this.onChange({generank: file});
      }.bind(this);
    }
  });
