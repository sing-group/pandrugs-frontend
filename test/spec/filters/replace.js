'use strict';

describe('Filter: replace', function () {

  // load the filter's module
  beforeEach(module('pandrugsdbFrontendApp'));

  // initialize a new instance of the filter before each test
  var replace;
  beforeEach(inject(function ($filter) {
    replace = $filter('replace');
  }));

  it('should return the input prefixed with the replacement made', function () {
    var text = 'Hello I am foo';
    expect(replace(text, 'foo', 'bar')).toBe('Hello I am bar');
  });

});
