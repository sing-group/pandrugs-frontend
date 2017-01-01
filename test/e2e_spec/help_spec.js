'use strict';

describe('Application Help', function() {
  it('should display the help table of contents', function() {
    browser.get('/#/help');

    var tableOfContentsElement = element(by.css('a[href*="#/help#query-options"]'));
    expect(tableOfContentsElement.isDisplayed()).toBe(true);

  });

});
