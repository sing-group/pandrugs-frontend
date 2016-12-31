'use strict';

describe('Controller: QueryCtrl', function () {

  // load the controller's module
  beforeEach(module('pandrugsFrontendApp'));

  var $controller;
  var $q;
  var $scope;

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_) {
    $controller = _$controller_;
    $q = _$q_;
    $scope = _$rootScope_.$new();
  }));

  describe('$scope.query', function() {
    var service;
    var deferred;
    var user;
    var cancerTypesDeferred;
    var genesPresenceDefer;

    beforeEach(function() {
      service = {
        searchByGenes: function() {},
        getCancerTypes: function() {},
        listGeneSymbols: function() {
          return ['BRCA2']
        },
        listDrugs: function() {
          return []
        },
        listDrugNames: function() {},
        genesPresence: function() {}
      };

      user = {getCurrentUser: function() {return "anonymous"}};

      deferred = $q.defer();
      cancerTypesDeferred = $q.defer();

      genesPresenceDefer = $q.defer();
      genesPresenceDefer.resolve({present:['BRCA2'], absent:[]});

      spyOn(service, 'getCancerTypes').and.returnValue(cancerTypesDeferred.promise);

      spyOn(service, 'searchByGenes').and.returnValue(deferred.promise);

      spyOn(service, 'listGeneSymbols').and.returnValue(['BRCA2']);
      spyOn(service, 'genesPresence').and.returnValue(genesPresenceDefer.promise);
      spyOn(service, 'listDrugNames').and.returnValue([]);
      $controller('QueryCtrl', { $scope: $scope, user: user, database: service});

    });

    it('should call search function on the service', function() {
      $scope.genes='BRCA2';
      var tableState = null;

      $scope.query(tableState);

      deferred.resolve({geneDrugGroup:[]});

      $scope.$digest(); // force then method in promise to run

      expect(service.searchByGenes).toHaveBeenCalledWith(['BRCA2'], true, true, true, true, true, true, true, true, true, tableState);
    });

    it('should put results on $scope.results', function() {
      $scope.genes='BRCA2';
      var tableState = null;

      cancerTypesDeferred.resolve(['breast']);

      $scope.query(tableState);

      deferred.resolve({geneDrugGroup:[
        {
          status: 'EXPERIMENTAL',
          cancer: ['breast'],
          gene:'BRCA2',
          family: [],
          source: [],
          statusDescription: 'description',
          geneDrugInfo:[]
        },
        {
          status: 'EXPERIMENTAL',
          cancer: ['breast'],
          gene:'BRCA2',
          family: [],
          source: [],
          statusDescription: 'description',
          geneDrugInfo:[]

        }]});
      $scope.$digest(); // force then method in promise to run

      expect($scope.results.length).toBe(2);
    });
  });
});
