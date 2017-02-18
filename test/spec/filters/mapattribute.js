'use strict';

describe('Filter: mapAttribute', function () {

  // load the filter's module
  beforeEach(module('pandrugsFrontendApp'));

  // initialize a new instance of the filter before each test
  var mapAttribute;
  beforeEach(inject(function ($filter) {
    mapAttribute = $filter('mapAttribute');
  }));

  it('should return the input prefixed with "mapAttribute filter:"', function () {
    var text = 'angularjs';
    expect(mapAttribute(text)).toBe('mapAttribute filter: ' + text);
  });

});
