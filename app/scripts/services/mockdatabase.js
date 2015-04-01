'use strict';

/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.MockDatabase
 * @description
 * # MockDatabase
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('MockDatabase', ['$q', '$timeout', function mockDatabaseFactory($q, $timeout) {
    // Service logic
    // ...

    // Public API here
    return {
      search: function (gene, params) {
	
	var deferred = $q.defer();
	
	$timeout(function() {
	    deferred.resolve(
	      [
		{ 
		  gene: 'BRCA2',
		  drug: 'AFATINIB',
		  family: 'Other',
		  source: 'GDSC',
		  status: 'Approved',
		  cancer: 'metastatic non-small cell lung cancer with EGFR mutations',
		  therapy: 'TARGETED THERAPY',
		  indirect: '-',
		  target: '',
		  score: 0.5
		},
		{ 
		  gene: 'BRCA2',
		  drug: 'IDARUBICIN',
		  family: 'Other',
		  source: 'CTRP',
		  status: 'Approved',
		  cancer: 'acute myelogenous leukemia',
		  therapy: 'CHEMOTHERAPY',
		  indirect: '-',
		  target: '',
		  score: 0.5
		},
		{ 
		  gene: 'BRCA2',
		  drug: 'PEMETREXED',
		  family: 'Other',
		  source: 'CTRP',
		  status: 'Approved',
		  cancer: 'malignant pleural mesothelioma',
		  therapy: 'CHEMOTHERAPY',
		  indirect: '-',
		  target: '',
		  score: 0.5
		},
		{ 
		  gene: 'BRCA2',
		  drug: 'ABT-751',
		  family: 'Other',
		  source: 'CTRP',
		  status: 'Clinical',
		  cancer: 'cancer',
		  therapy: '',
		  indirect: '-',
		  target: '',
		  score: 0.3
		},
		{ 
		  gene: 'BRCA2',
		  drug: 'BMN673',
		  family: 'Other',
		  source: 'ClearityFoundationBiomarkers',
		  status: 'Clinical',
		  cancer: 'cancer',
		  therapy: '',
		  indirect: '-',
		  target: '',
		  score: 0.3
		}
		
	      ]
	    )	  
	}, 1000);
	
        return deferred.promise;
      }
    };
  }]);
/*
 * <td>{{row.gene}}</td>
		<td>{{row.drug}}</td>
		<td>{{row.family}}</td>
		<td>{{row.source}}</td>
		<td>{{row.status}}</td>
		<td>{{row.cancer}}</td>
		<td>{{row.therapy}}</td>
		<td>{{row.indirect}}</td>
		<td>{{row.target}}</td>
		<td>{{row.score}}</td>
		*/