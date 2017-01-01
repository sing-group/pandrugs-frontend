'use strict';

describe('Query Examples', function() {
  it('should retrieve palbociclib row the drug example query', function() {
    browser.get('/#/query?example=drugs');

    expect(element.all(by.repeater('row in results')).count()).toBeGreaterThan(0);

    var palbociclibLink = element(by.css('a[href*="https://pubchem.ncbi.nlm.nih.gov/compound/5330286"]'));
    expect(palbociclibLink.isDisplayed()).toBe(true);
  });

  it('should retrieve tamoxifen in the genes example query', function() {
    browser.get('/#/query?example=genes');

    expect(element.all(by.repeater('row in results')).count()).toBeGreaterThan(0);

    var tamoxifenLink = element(by.css('a[href*="https://pubchem.ncbi.nlm.nih.gov/compound/2733526"]'));
    expect(tamoxifenLink.isDisplayed()).toBe(true);
  });

  it('should retrieve desatinib row the vcf example query (melanoma braf mutant)', function() {
    browser.get('/#/query?example=vcf');

    expect(element.all(by.repeater('row in results')).count()).toBeGreaterThan(0);

    var desanitibLink = element(by.css('a[href*="https://pubchem.ncbi.nlm.nih.gov/compound/3062316"]'));
    expect(desanitibLink.isDisplayed()).toBe(true);
  });
});
