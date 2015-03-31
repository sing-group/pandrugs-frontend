'use strict';

describe('Service: MockDatabase', function () {

  // load the service's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // instantiate service
  var MockDatabase;
  beforeEach(inject(function (_MockDatabase_) {
    MockDatabase = _MockDatabase_;
  }));

  it('should do something', function () {
    expect(!!MockDatabase).toBe(true);
  });

});
