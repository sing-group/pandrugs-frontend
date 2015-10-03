'use strict';

describe('Service: therapyByStatusChart', function () {

  // load the service's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // instantiate service
  var therapyByStatusChart;
  beforeEach(inject(function (_therapyByStatusChart_) {
    therapyByStatusChart = _therapyByStatusChart_;
  }));

  it('should do something', function () {
    expect(!!therapyByStatusChart).toBe(true);
  });

});
