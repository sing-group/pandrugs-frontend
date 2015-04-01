'use strict';

describe('Controller: QueryCtrl', function () {

  // load the controller's module
  beforeEach(module('pandrugsdbFrontendApp'));

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
    
    beforeEach(function() {
      service = {search: function() {}};      
      $controller('QueryCtrl', { $scope: $scope, MockDatabase: service });
      deferred = $q.defer();      
      spyOn(service, 'search').and.returnValue(deferred.promise);
    });
    
    it('should call search function on the service', function() {
      $scope.genes='BRCA2';
      var tableState = null;
      
      $scope.query(tableState);
      
      deferred.resolve([]);
      $scope.$digest(); // force then method in promise to run
      
      expect(service.search).toHaveBeenCalledWith('BRCA2', tableState);      
    });
    
    it('should put results on $scope.results', function() {
      $scope.genes='BRCA2';
      var tableState = null;
      
      $scope.query(tableState);
      
      deferred.resolve([{gene:'BRCA2'}, {gene:'BRCA2'}]);
      $scope.$digest(); // force then method in promise to run
      
      expect($scope.results.length).toBe(2);
    });
  });
});
