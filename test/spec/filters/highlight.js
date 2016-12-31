'use strict';

describe('Filter: highlight', function () {

  // load the filter's module
  beforeEach(module('pandrugsFrontendApp'));

  // initialize a new instance of the filter before each test
  var highlight;
  var $sce;
  beforeEach(inject(function ($filter, _$sce_) {
    highlight = $filter('highlight');
    $sce = _$sce_;
  }));

  it('should return the input prefixed with "highlight filter:"', function () {
    var text = 'angularjs';
    var query = 'ang';
    expect($sce.getTrustedHtml(highlight(text, query))).toBe('<span class=\"highlightedText\">ang</span>ularjs');
  });

});
