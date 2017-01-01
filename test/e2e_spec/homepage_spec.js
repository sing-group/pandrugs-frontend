'use strict';

describe('Application Homepage', function() {
  it('should display the welcome message', function() {
    browser.get('/');

    var appName = element(by.css('div.jumbotron h1')); //using the CSS selector

    expect(appName.getText()).toEqual('Welcome to');
  });

});
