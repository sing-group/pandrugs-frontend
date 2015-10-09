'use strict';

describe('Service: therapyByFamilyChart', function () {

  // load the service's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // instantiate service
  var therapyByFamilyChart;
  beforeEach(inject(function (_therapyByFamilyChart_) {
    therapyByFamilyChart = _therapyByFamilyChart_;
  }));

  it('should do something', function () {
    expect(!!therapyByFamilyChart).toBe(true);
  });

});
