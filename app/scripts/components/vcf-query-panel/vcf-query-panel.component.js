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
  .component('vcfQueryPanel', {
    templateUrl: 'views/components/vcf-query-panel/vcf-query-panel.template.html',
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
      this.withPharmcat = false;
      this.tsvFile = '';

      if (this.autoreload === undefined) {
        this.autoreload = true;
      }

      this.$onInit = function () {
        if ($location.search().example === 'vcfrank') {
          this.computationId = 'example';

          user.getComputation('guest', 'example', function(computation){
            this.computationId = 'example';
            this.computations.example = new Computation(this.computationId, computation);
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

      this.changeFile = function(file, option) {
        if (option == "VCF"){
          this.vcfFile = file; 
        }else if (option == "TSV"){
          this.tsvFile = file;
        }
      };

      this.submitVCF = function() {
        user.submitComputation(this.vcfFile, this.computationName, this.withPharmcat, this.tsvFile,
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

      this.downloadVScoreFile = function(computationId) {
        window.location.href = user.getVscoreDownloadURLForComputation(computationId);
      };

      function Computation(computationId, computation) {
        this.id = computationId;
        angular.merge(this, computation);
      };

      Computation.prototype.canBeQueried = function() {
        return this.isSuccess() && this.hasAffectedGenes();
      };

      Computation.prototype.hasAffectedGenes = function() {
        return this.countAffectedGenes() > 0;
      };

      Computation.prototype.countAffectedGenes = function() {
        return this.affectedGenes ? this.affectedGenes.length : 0;
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
            for (var computationId in computations) {
              if (computations.hasOwnProperty(computationId)) {
                this.computations[computationId] = new Computation(computationId, computations[computationId]);
              }
            }

            if (savedExample) {
              this.computations.example = savedExample;
            }
          }.bind(this));
        } else if(this.computationId) {
          user.getComputation('guest', this.computationId, function(computation) {
            this.computations = {};
            this.computations[this.computationId] = new Computation(this.computationId, computation);

            this.notifyComputationIdChange();
          }.bind(this));
        }
      }.bind(this);
    }]
  });
