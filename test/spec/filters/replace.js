'use strict';

describe('Filter: replace', function () {

	// load the filter's module
	beforeEach(module('pandrugsdbFrontendApp'));

	// initialize a new instance of the filter before each test
	var replace;
	beforeEach(inject(function ($filter) {
		replace = $filter('replace');
	}));

	it('should return the input prefixed with "replace filter:"', function () {
		var text = 'angularjs';
		expect(replace(text)).toBe('replace filter: ' + text);
	});

});
