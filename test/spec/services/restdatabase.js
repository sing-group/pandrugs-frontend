'use strict';

describe('Service: restDatabase', function () {

  // load the service's module
  beforeEach(module('pandrugsFrontendApp'));

  // instantiate service
  var restDatabase;
  beforeEach(inject(function (_restDatabase_) {
    restDatabase = _restDatabase_;
  }));

  it('should do something', function () {
    expect(!!restDatabase).toBe(true);
  });

});
