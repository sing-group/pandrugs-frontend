'use strict';

describe('Controller: QueryCtrl', function () {

  // load the controller's module
  beforeEach(module('pandrugsdbFrontendApp'));

  var QueryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QueryCtrl = $controller('QueryCtrl', {
      $scope: scope
    });
  }));

  /*it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });*/
});
