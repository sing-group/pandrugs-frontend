'use strict';

describe('Filter: enumeration', function () {

	// load the filter's module
	beforeEach(module('pandrugsdbFrontendApp'));

	// initialize a new instance of the filter before each test
	var enumeration;
	beforeEach(inject(function ($filter) {
		enumeration = $filter('enumeration');
	}));

	it('should return the input prefixed with "enumeration filter:"', function () {
		var text = 'angularjs';
		expect(enumeration(text)).toBe('enumeration filter: ' + text);
	});

});
