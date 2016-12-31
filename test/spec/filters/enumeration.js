'use strict';

describe('Filter: enumeration', function () {

  // load the filter's module
  beforeEach(module('pandrugsFrontendApp'));

  // initialize a new instance of the filter before each test
  var enumeration;
  beforeEach(inject(function ($filter) {
    enumeration = $filter('enumeration');
  }));

  it('should return the array input comma-separated with \' and \' at the end"', function () {
    var text = [1, 2, 5];
    expect(enumeration(text)).toBe('1, 2 and 5');
  });

});
