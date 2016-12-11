'use strict';

describe('Application Homepage', function() {
	it('should display the welcome message', function() {
		browser.get('/');

		var appName = element(by.css('div.jumbotron h1')); //using the CSS selector

		expect(appName.getText()).toEqual('Welcome to');
	});

});

describe('Query by Genes page', function() {
	it('should retrieve some results for a simple query', function() {
		browser.get('/#/query');

		element(by.model('genes')).sendKeys('brca1');

		element(by.css('[ng-click="query()"]')).click();

		expect(element.all(by.repeater('row in results')).count()).toBeGreaterThan(0);

	});
});
