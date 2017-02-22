'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:enumeration
 * @function
 * @description
 * # enumeration
 * Filter in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .filter('kegglink', function () {
    return function (pathway, indirectGeneInfo) {
      var link = 'http://www.kegg.jp/kegg-bin/show_pathway?'+pathway.keggId+'/default%3D%3Cdcolor%3E/'+indirectGeneInfo.entrezId[0]+'%09white,red';
      pathway.gene.forEach(function(gene) {
        link += '/'+gene.entrezId[0]+'%09white,orange';
      });

      return link;
    }
    });
