'use strict';

describe('Service: TableHelper', function () {

  // load the service's module
  beforeEach(module('pandrugsFrontendApp'));

  // instantiate service
  var TableHelper;
  beforeEach(inject(function (_TableHelper_) {
    TableHelper = _TableHelper_;
  }));

  it('should do something', function () {
    expect(!!TableHelper).toBe(true);
  });

});
