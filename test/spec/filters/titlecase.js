'use strict';

describe('Filter: titlecase', function () {

	// load the filter's module
	beforeEach(module('pandrugsdbFrontendApp'));

	// initialize a new instance of the filter before each test
	var titlecase;
	beforeEach(inject(function ($filter) {
		titlecase = $filter('titlecase');
	}));

	it('should return the input in title-case', function () {
		var text = 'the show must go on';
		expect(titlecase(text)).toBe('The Show Must Go On');
	});

});
