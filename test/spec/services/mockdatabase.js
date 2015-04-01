'use strict';

describe('Service: mockDatabase', function () {

  // load the service's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // instantiate service
  var mockDatabase;
  beforeEach(inject(function (_mockDatabase_) {
    mockDatabase = _mockDatabase_;
  }));

  it('should do something', function () {
    expect(!!mockDatabase).toBe(true);
  });

});
