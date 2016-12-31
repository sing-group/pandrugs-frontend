'use strict';

describe('Controller: QuerymenuCtrl', function () {

  // load the controller's module
  beforeEach(module('pandrugsFrontendApp'));

  var QuerymenuCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuerymenuCtrl = $controller('QuerymenuCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
