'use strict';

describe('Service: bubbleTheraphyChart', function () {

  // load the service's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // instantiate service
  var bubbleTheraphyChart;
  beforeEach(inject(function (_bubbleTheraphyChart_) {
    bubbleTheraphyChart = _bubbleTheraphyChart_;
  }));

  it('should do something', function () {
    expect(!!bubbleTheraphyChart).toBe(true);
  });

});
