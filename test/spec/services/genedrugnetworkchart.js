'use strict';

describe('Service: geneDrugNetworkChart', function () {

  // load the service's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // instantiate service
  var geneDrugNetworkChart;
  beforeEach(inject(function (_geneDrugNetworkChart_) {
    geneDrugNetworkChart = _geneDrugNetworkChart_;
  }));

  it('should do something', function () {
    expect(!!geneDrugNetworkChart).toBe(true);
  });

});
