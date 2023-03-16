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
      autoreload: '<'
    },
    controller: ['user', '$location', '$timeout', '$scope', function (user, $location, $timeout, $scope) {
      this.vcfFile = '';
      this.computationName = 'My Computation';
      this.computationId = $location.search().computationId;
      this.withPharmcat = false;
      this.tsvFile = '';
      this.errorVCFFile = '';
      
      if (this.autoreload === undefined) {
        this.autoreload = true;
      }

      this.changeFile = function(file, option) {
        if (option == "VCF"){
          this.vcfFile = file;          
        }else if (option == "TSV"){
          this.tsvFile = file;
        }
      };

      this.checkVCF = function(file, onOK, onNotOK){
        
        var reader = new FileReader();

        reader.onload = function () {
          var allrows = reader.result.split('\n');
          var isValid = true;
          var error = ''

         
          for(var row = 0; row < allrows.length; row++) {
              var line = allrows[row].trim();
              
              if (line.startsWith('#') && !line.startsWith('##')) {
                  // in header
                  var colsCount = line.split('\t').length;
                  if (!this.withPharmcat) {
                    if (colsCount > 11) {
                      isValid = false;
                      error = "Number of columns exceeds 11. ";
                    }
                  } else {
                    if (colsCount < 10 || colsCount > 11){
                      isValid = false;
                      error = "For PharmCAT analysis the number of columns must be 10 or 11 in the VCF. ";
                    }
                  }
                  if (colsCount === 11) {                    
                    var lastTwoColumns = [line.split('\t')[9].toUpperCase(), line.split('\t')[10].toUpperCase()]; 
                    if (!lastTwoColumns.includes('TUMOR') || !lastTwoColumns.includes('NORMAL')) {                    
                        isValid = false;
                        error = 'The two latests columns should be named "tumor/normal" or "normal/tumor. ';
                    }            
                  }
                  error = error + 'See help for details.'
                  break;
              }
          }
          if (isValid) {              
              onOK();
          } else {
              onNotOK(error);
          }
        }.bind(this);

        reader.readAsText(file);
      
      };

      this.onSubmissionComplete = function(newId) {        
        if (this.isAnonymous()) {
          var absoluteUrl = $location.absUrl();

          var followUrl = absoluteUrl.substring(0, absoluteUrl.indexOf('#!')) + '#!/query?tab=vcfrank&computationId=' + newId;
          window.alert('Computation submitted successfully. Please keep this link in a SAFE PLACE in order to get back and follow the computation progress:\n' + followUrl);
          
          $timeout(function() {
            //do redirection asynchronously, since in chrome the modal vcf dialog black background does not disappear ...
            document.location.href = followUrl;
          });
        } else {
          window.alert('Computation submitted successfully. We will start to analyze it as soon as we can.');
        }
      }.bind(this);

      this.submitVCF = function() {
        this.checkVCF(this.vcfFile,
          // on OK
          function() {
            $('#'+this.idPrefix+'-new-modal').modal('hide');
            this.errorVCFFile = '';
            user.submitComputation(this.vcfFile, this.computationName, this.withPharmcat, this.tsvFile,
              this.onSubmissionComplete,
              function() { // onSubmissionError
                window.alert('ERROR: computation could not be submitted.');
              }.bind(this)
            )}.bind(this), 
          // on not OK
          function(error) {
            this.errorVCFFile = error;
            $scope.$apply();
          }.bind(this))
      }.bind(this);

      this.isAnonymous = function() {
        return user.getCurrentUser() === 'anonymous';
      };
    }]
  });
