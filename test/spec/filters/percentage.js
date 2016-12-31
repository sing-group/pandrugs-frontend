'use strict';

describe('Filter: percentage', function () {

  // load the filter's module
  beforeEach(module('pandrugsFrontendApp'));

  // initialize a new instance of the filter before each test
  var percentage;
  beforeEach(inject(function ($filter) {
    percentage = $filter('percentage');
  }));

  it('should return 10% when input is 0.1"', function () {
    var text = '0.1';
    expect(percentage(text)).toBe('10%');
  });

});
