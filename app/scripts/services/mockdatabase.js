'use strict';


var mockdata = JSON.parse('[{"gene":["KRAS","EGFR","NF1"],"drug":"ERLOTINIB","family":["Receptor Tyrosine Kinase"],"source":["CancerCommons","ClearityFoundationBiomarkers","ClearityFoundationClinicalTrial","DrugBank","MyCancerGenome","PharmGKB","TALC","TARGET-CGA","TEND","TTD"],"curated-source":["CancerCommons","ClearityFoundationBiomarkers","ClearityFoundationClinicalTrial","MyCancerGenome","TALC","TARGET-CGA","TEND"],"status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect-gene":["MAPK1","MAPK3"],"target":true,"dScore":0.9380000000000001,"gScore":0.8577127454000001,"gene-drug-info":[{"gene":["KRAS"],"alteration": "Missense_mutatio / Amplification","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":null,"target":"marker","sensitivity":"resistance","dScore":-0.968,"gScore":0.9577127454000001,"source":["ClearityFoundationBiomarkers"]},{"gene":["KRAS","NF1"],"alteration": "Missense_mutatio / Amplification","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":"MAPK3","target":"marker","sensitivity":"resistance","dScore":-0.968,"gScore":0.0,"source":["TARGET-CGA"]},{"gene":["EGFR"],"alteration": "Amplification","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":null,"target":"target","sensitivity":"sensitivity","dScore":0.9380000000000001,"gScore":0.9397637670000001,"source":["CancerCommons","ClearityFoundationBiomarkers","ClearityFoundationClinicalTrial","DrugBank","MyCancerGenome","PharmGKB","TALC","TARGET-CGA","TEND","TTD"]},{"gene":["KRAS","NF1"],"alteration": "Missense_mutatio / Amplification","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":"MAPK1","target":"marker","sensitivity":"resistance","dScore":-0.968,"gScore":0.35221087532,"source":["TARGET-CGA"]}]},{"gene":["KRAS","EGFR","NF1"],"drug":"ERLOTINIB","family":["Receptor Tyrosine Kinase"],"source":["CancerCommons","ClearityFoundationBiomarkers","ClearityFoundationClinicalTrial","DrugBank","MyCancerGenome","PharmGKB","TALC","TARGET-CGA","TEND","TTD"],"curated-source":["CancerCommons","ClearityFoundationBiomarkers","ClearityFoundationClinicalTrial","MyCancerGenome","TALC","TARGET-CGA","TEND"],"status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect-gene":["MAPK1","MAPK3"],"target":true,"dScore":0.9380000000000001,"gScore":0.9577127454000001,"gene-drug-info":[{"gene":["KRAS"],"alteration": "Missense_mutatio / Amplification","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":null,"target":"marker","sensitivity":"resistance","dScore":-0.968,"gScore":0.9577127454000001,"source":["ClearityFoundationBiomarkers"]},{"gene":["KRAS","NF1"],"alteration": "Missense_mutatio / Amplification","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":"MAPK3","target":"marker","sensitivity":"resistance","dScore":-0.968,"gScore":0.0,"source":["TARGET-CGA"]},{"gene":["EGFR"],"alteration": "Missense_mutatio / Amplification","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":null,"target":"target","sensitivity":"sensitivity","dScore":0.9380000000000001,"gScore":0.9397637670000001,"source":["CancerCommons","ClearityFoundationBiomarkers","ClearityFoundationClinicalTrial","DrugBank","MyCancerGenome","PharmGKB","TALC","TARGET-CGA","TEND","TTD"]},{"gene":["KRAS","NF1"],"alteration": "Missense_mutatio","drug":"ERLOTINIB","family":"Receptor Tyrosine Kinase","status":"Approved","cancer":"advanced refractory metastatic non-small cell lung cancer","therapy":"TARGETED THERAPY","indirect":"MAPK1","target":"marker","sensitivity":"resistance","dScore":-0.968,"gScore":0.35221087532,"source":["TARGET-CGA"]}]}]');
/**
 * @ngdoc service
 * @name pandrugsdbFrontendApp.mockDatabase
 * @description
 * # MockDatabase
 * Factory in the pandrugsdbFrontendApp.
 */
angular.module('pandrugsdbFrontendApp')
  .factory('mockDatabase', ['$q', '$timeout', '$filter', '$log',  function mockDatabaseFactory($q, $timeout, $filter, $log) {
    // Service logic
    // ...

    // Public API here
    return {
      search: function (gene, params) {
	$log.log(params);
	var deferred = $q.defer();
	
	$timeout(function() {
	  if (!angular.isUndefined(params)){
	    if (params.sort.predicate) {
	      mockdata = $filter('orderBy')(mockdata, params.sort.predicate, params.sort.reverse);
	    }
	  }
	    deferred.resolve(mockdata)
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