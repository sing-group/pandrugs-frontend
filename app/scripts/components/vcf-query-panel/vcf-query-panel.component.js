angular.module('pandrugsFrontendApp')
  .component('vcfQueryPanel', {
    templateUrl: 'scripts/components/vcf-query-panel/vcf-query-panel.template.html',
    bindings: {
      idPrefix: '@',
      reloadInterval: '@',
      autoreload: '<',
      onChange: '&'
    },
    controller: ['user', '$location', '$scope', '$interval', '$timeout', function (user, $location, $scope, $interval, $timeout) {
      this.vcfFile = '';
      this.computationName = 'My Computation';
      this.computations = [];
      this.computationId = $location.search().computationId;

      if (this.autoreload === undefined) {
        this.autoreload = true;
      }

      this.$onInit = function () {
        angular.element(document).ready(function () {
          angular.element(document.querySelector('#' + this.idPrefix + '-input-file'))
            .fileinput({'showUpload': false, 'showRemove': false, 'previewFileType': 'any', 'multiple': false});
        }.bind(this));

        if ($location.search().example === 'vcfrank') {
          this.computationId = 'example';

          user.getComputation('guest', 'example', function(computation){
            this.computationId = 'example';
            this.computations.example = new Computation(computation);
            this.notifyComputationIdChange();
          }.bind(this));
        }

        // User requires some time to load the actual user.
        // This delay wait for the current user to be set.
        $timeout(this.reloadComputations, 1000)
          .then(function() {
            this.reloadComputationsTask = $interval(
              function() {
                if (this.autoreload) {
                  this.reloadComputations();
                }
              }.bind(this),
              this.reloadInterval ? this.reloadInterval : 5000
            );
          }.bind(this));
      }.bind(this);

      this.$onDestroy = function() {
        if (this.reloadComputationsTask !== undefined) {
          $interval.cancel(this.reloadComputationsTask);
        }
      }.bind(this);

      this.notifyComputationIdChange = function () {
        this.onChange({
          computationId: this.computationId,
          computation: this.computations[this.computationId]
        });
      }.bind(this);

      this.changeFile = function(file) {
        this.vcfFile = file;
      };

      this.submitVCF = function() {
        user.submitComputation(this.vcfFile, this.computationName,
          function(newId) {
            if (this.isAnonymous()) {
              var absoluteUrl = $location.absUrl();

              var followUrl = absoluteUrl.substring(0, absoluteUrl.indexOf('#!')) + '#!/query?computationId=' + newId;
              window.alert('Computation submitted successfully. Please keep this link in a SAFE PLACE in order to get back and follow the computation progress:\n' + followUrl);

              $timeout(function() {
                //do redirection asynchronously, since in chrome the modal vcf dialog black background does not disappear ...
                document.location.href = followUrl;
              });

            } else {
              window.alert('Computation submitted successfully. We will start to analyze it as soon as we can.');
            }
          }.bind(this),
          function() {
            window.alert('ERROR: computation could not be submitted.');
          }.bind(this)
        );
      }.bind(this);

      this.isAnonymous = function() {
        return user.getCurrentUser() === 'anonymous';
      };

      this.deleteComputation = function(computationId) {
        if (window.confirm('Are you sure?')) {
          user.deleteComputation(computationId,
            function() {
              window.alert('Computation deleted successfully.');
            },
            function() {
              window.alert('ERROR: computation could not be deleted.');
            }
          );
        }
      };

      function Computation(computation) {
        angular.merge(this, computation);
      };

      Computation.prototype.canBeQueried = function() {
        return this.isSuccess() && this.hasAffectedGenes();
      };

      Computation.prototype.hasAffectedGenes = function() {
        return this.countAffectedGenes() > 0;
      };

      Computation.prototype.countAffectedGenes = function() {
        return this.affectedGenes.length;
      };

      Computation.prototype.isFailed = function() {
        return this.failed;
      };

      Computation.prototype.isSuccess = function() {
        return this.finished && !this.isFailed();
      };

      //update computation status...
      this.reloadComputations = function() {
        if (!this.isAnonymous()) {
          user.getComputations(function(computations) {
            var savedExample;

            if (this.computations.example) {
              savedExample = this.computations.example;
            }

            this.computations = {};
            for (computationId in computations) {
              if (computations.hasOwnProperty(computationId)) {
                this.computations[computationId] = new Computation(computations[computationId]);
              }
            }

            if (savedExample) {
              this.computations.example = savedExample;
            }
          }.bind(this));
        } else if(this.computationId) {
          user.getComputation('guest', this.computationId, function(computation) {
            this.computations = {};
            this.computations[this.computationId] = new Computation(computation);
            this.notifyComputationIdChange();
          }.bind(this));
        }
      }.bind(this);
    }]
  });
