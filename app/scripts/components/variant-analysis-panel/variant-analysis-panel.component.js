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
  .component('variantAnalysisPanel', {
    templateUrl: 'views/components/variant-analysis-panel/variant-analysis-panel.template.html',
    bindings: {
      reloadInterval: '@',
      autoreload: '<',
      onSelected: '&',
      isMultiomics: '<'
    },
    controller: ['user', '$location', '$interval', '$timeout', function (user, $location, $interval, $timeout) {
      this.computations = {};
      this.computationId = $location.search().computationId;
      this.fetchedComputations = false;
      
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
        this.reloadComputations();
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
        this.onSelected({
          computationId: this.computationId,
          computation: this.computations[this.computationId]
        });
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

      this.getPharmcatURL = function(computationId) {
        return user.getPharmcatURLForComputation(computationId); 
      };

      this.goTo = function() {
        document.location.href = "/#!/query?tab=vcfrank";
      };

      this.getFetchedComputationsCount = function() {
        if (this.fetchedComputations === true) {
          return Object.keys(this.computations).length;
        } else {
          return 0;
        }
      }.bind(this);
      
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
            this.fetchedComputations = true;
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
            this.fetchedComputations = true;
            this.notifyComputationIdChange();
          }.bind(this));
        } else {
          this.fetchedComputations = true;
        }
      }.bind(this);
    }]
      
  });
