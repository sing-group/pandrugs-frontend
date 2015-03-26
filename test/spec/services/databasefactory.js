'use strict';

describe('Service: DatabaseFactory', function () {

  // load the service's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // instantiate service
  var DatabaseFactory;
  beforeEach(inject(function (_DatabaseFactory_) {
    DatabaseFactory = _DatabaseFactory_;
  }));

  it('should do something', function () {
    expect(!!DatabaseFactory).toBe(true);
  });

});
