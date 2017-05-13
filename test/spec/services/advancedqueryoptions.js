'use strict';

describe('Service: AdvancedQueryOptions', function () {

  // load the service's module
  beforeEach(module('pandrugsFrontendApp'));

  // instantiate service
  var AdvancedQueryOptions;
  beforeEach(inject(function (_AdvancedQueryOptions_) {
    AdvancedQueryOptions = _AdvancedQueryOptions_;
  }));

  it('should do something', function () {
    expect(!!AdvancedQueryOptions).toBe(true);
  });

});
